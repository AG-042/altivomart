from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Order, DeliveryInfo
from .serializers import (
    OrderCreateSerializer, OrderListSerializer, 
    OrderDetailSerializer, OrderStatusUpdateSerializer,
    DeliveryInfoSerializer, DeliveryStatusUpdateSerializer
)
from notifications.utils import send_order_confirmation, send_status_update
from django.utils import timezone
from datetime import timedelta


class OrderCreateView(generics.CreateAPIView):
    """Public API for creating orders"""
    serializer_class = OrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        order = serializer.save()
        # Send confirmation email
        send_order_confirmation(order)
        # Create basic delivery info so tracking is available immediately
        try:
            # Determine estimated delivery based on items' products
            max_days = 3
            try:
                item_days = []
                for item in order.items.all():
                    days = getattr(item.product, 'estimated_delivery_days', None)
                    if isinstance(days, int) and days > 0:
                        item_days.append(days)
                if item_days:
                    max_days = max(item_days)
            except Exception:
                pass
            estimated = timezone.now() + timedelta(days=max_days)
            DeliveryInfo.objects.create(
                order=order,
                delivery_status='assigned',
                estimated_delivery=estimated,
                delivery_notes='Delivery information initialized.',
            )
        except Exception:
            # Do not fail order creation if delivery info init fails
            pass


class OrderDetailView(generics.RetrieveAPIView):
    """Public API for checking order status"""
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'id'


# Admin Views
class AdminOrderListView(generics.ListAPIView):
    """Admin API for listing all orders"""
    queryset = Order.objects.all()
    serializer_class = OrderListSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'city', 'state']
    search_fields = ['customer_name', 'phone_number', 'address']
    ordering = ['-created_at']


class AdminOrderDetailView(generics.RetrieveAPIView):
    """Admin API for order details"""
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def update_order_status(request, order_id):
    """Admin API to update order status"""
    order = get_object_or_404(Order, id=order_id)
    old_status = order.status
    
    serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        
        # Send status update email if status changed
        if old_status != order.status:
            send_status_update(order, old_status)
        
        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST', 'PUT'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def manage_delivery_info(request, order_id):
    """Admin API to create/update delivery information"""
    order = get_object_or_404(Order, id=order_id)
    
    try:
        delivery_info = order.delivery_info
        serializer = DeliveryInfoSerializer(delivery_info, data=request.data, partial=True)
    except DeliveryInfo.DoesNotExist:
        serializer = DeliveryInfoSerializer(data=request.data)
    
    if serializer.is_valid():
        if hasattr(order, 'delivery_info'):
            serializer.save()
        else:
            serializer.save(order=order)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def update_delivery_status(request, order_id):
    """Admin API to update delivery status"""
    order = get_object_or_404(Order, id=order_id)
    
    try:
        delivery_info = order.delivery_info
    except DeliveryInfo.DoesNotExist:
        return Response(
            {'error': 'Delivery info not found for this order'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    serializer = DeliveryStatusUpdateSerializer(delivery_info, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        
        # Update order status based on delivery status
        if delivery_info.delivery_status == 'delivered':
            order.status = 'delivered'
            order.save()
        
        return Response(
            OrderDetailSerializer(order).data,
            status=status.HTTP_200_OK
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def track_delivery(request, order_id):
    """Public API to track delivery status"""
    order = get_object_or_404(Order, id=order_id)
    
    if not hasattr(order, 'delivery_info'):
        return Response(
            {'error': 'Delivery information not available yet'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
    delivery_info = order.delivery_info
    return Response({
        'order_id': order.id,
        'tracking_code': order.tracking_code,
        'customer_name': order.customer_name,
        'status': order.status,
        'delivery_status': delivery_info.delivery_status,
        'estimated_delivery': delivery_info.estimated_delivery,
        'tracking_number': delivery_info.tracking_number,
        'delivery_attempts': delivery_info.delivery_attempts,
        'last_attempt_date': delivery_info.last_attempt_date,
        'delivery_notes': delivery_info.delivery_notes,
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def track_by_code(request, code):
    """Public API to track delivery using tracking_code instead of numeric id"""
    order = get_object_or_404(Order, tracking_code=code)
    if not hasattr(order, 'delivery_info'):
        return Response(
            {'error': 'Delivery information not available yet'},
            status=status.HTTP_404_NOT_FOUND
        )
    delivery_info = order.delivery_info
    return Response({
        'order_id': order.id,
        'tracking_code': order.tracking_code,
        'customer_name': order.customer_name,
        'status': order.status,
        'delivery_status': delivery_info.delivery_status,
        'estimated_delivery': delivery_info.estimated_delivery,
        'tracking_number': delivery_info.tracking_number,
        'delivery_attempts': delivery_info.delivery_attempts,
        'last_attempt_date': delivery_info.last_attempt_date,
        'delivery_notes': delivery_info.delivery_notes,
    })
