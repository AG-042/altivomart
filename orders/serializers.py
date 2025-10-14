from rest_framework import serializers
from .models import Order, OrderItem, DeliveryInfo
from products.serializers import ProductListSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_details = ProductListSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'product_name', 'product_details', 
            'quantity', 'price', 'total_price'
        ]


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders"""
    items = serializers.ListField(write_only=True)
    # Return these on creation response
    id = serializers.IntegerField(read_only=True)
    tracking_code = serializers.CharField(read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'phone_number', 'customer_email', 'address', 'city', 'state', 
            'landmark', 'delivery_instructions', 'items', 'tracking_code'
        ]
    
    def validate_customer_name(self, value):
        """Ensure customer name is UTF-8 compatible"""
        if value:
            try:
                # Ensure value can be encoded/decoded properly
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("Customer name contains unsupported characters")
        return value
    
    def validate_address(self, value):
        """Ensure address is UTF-8 compatible"""
        if value:
            try:
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("Address contains unsupported characters")
        return value
    
    def validate_city(self, value):
        """Ensure city is UTF-8 compatible"""
        if value:
            try:
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("City contains unsupported characters")
        return value
    
    def validate_state(self, value):
        """Ensure state is UTF-8 compatible"""
        if value:
            try:
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("State contains unsupported characters")
        return value
    
    def validate_landmark(self, value):
        """Ensure landmark is UTF-8 compatible"""
        if value:
            try:
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("Landmark contains unsupported characters")
        return value
    
    def validate_delivery_instructions(self, value):
        """Ensure delivery instructions are UTF-8 compatible"""
        if value:
            try:
                value = str(value).encode('utf-8', errors='replace').decode('utf-8')
            except Exception:
                raise serializers.ValidationError("Delivery instructions contain unsupported characters")
        return value

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item.")
        
        for item in value:
            if 'product_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError(
                    "Each item must have 'product_id' and 'quantity'."
                )
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Quantity must be greater than 0.")
        
        return value

    def create(self, validated_data):
        from products.models import Product
        from decimal import Decimal
        
        items_data = validated_data.pop('items')
        
        # Calculate total price
        total_price = Decimal('0.00')
        order_items = []
        
        for item_data in items_data:
            try:
                product = Product.objects.get(id=item_data['product_id'], in_stock=True)
            except Product.DoesNotExist:
                raise serializers.ValidationError(
                    f"Product with id {item_data['product_id']} not found or out of stock."
                )
            
            quantity = item_data['quantity']
            item_total = product.price * quantity
            total_price += item_total
            
            order_items.append({
                'product': product,
                'quantity': quantity,
                'price': product.price
            })
        
        # Create order
        order = Order.objects.create(total_price=total_price, **validated_data)
        
        # Create order items
        for item_data in order_items:
            OrderItem.objects.create(order=order, **item_data)
        
        return order


class DeliveryInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryInfo
        fields = [
            'delivery_person', 'delivery_phone', 'delivery_company',
            'estimated_delivery', 'actual_delivery', 'delivery_status',
            'delivery_notes', 'delivery_fee', 'tracking_number',
            'delivery_attempts', 'last_attempt_date', 'failure_reason',
            'created_at', 'updated_at'
        ]


class OrderListSerializer(serializers.ModelSerializer):
    """Serializer for order list view"""
    total_items = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'phone_number', 'customer_email', 'full_address', 'total_price', 
            'status', 'total_items', 'created_at', 'updated_at', 'tracking_code'
        ]


class OrderDetailSerializer(serializers.ModelSerializer):
    """Serializer for order detail view"""
    items = OrderItemSerializer(many=True, read_only=True)
    delivery_info = DeliveryInfoSerializer(read_only=True)
    total_items = serializers.ReadOnlyField()
    full_address = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            'id', 'customer_name', 'phone_number', 'customer_email', 'address', 'city', 'state',
            'landmark', 'delivery_instructions', 'full_address',
            'total_price', 'status', 'total_items', 'items', 'tracking_code',
            'delivery_info', 'created_at', 'updated_at', 'delivered_at'
        ]


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating order status (admin only)"""
    
    class Meta:
        model = Order
        fields = ['status']


class DeliveryStatusUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating delivery status (admin only)"""
    
    class Meta:
        model = DeliveryInfo
        fields = ['delivery_status', 'delivery_notes', 'failure_reason']
