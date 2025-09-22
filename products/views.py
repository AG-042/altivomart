from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from .models import Product, Category, ProductImage
from .serializers import (
    ProductListSerializer, ProductDetailSerializer, 
    ProductCreateUpdateSerializer, CategorySerializer
)


class ProductListView(generics.ListAPIView):
    """Public API for listing products"""
    queryset = Product.objects.filter(in_stock=True)
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'in_stock']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']


class ProductDetailView(generics.RetrieveAPIView):
    """Public API for product details"""
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]


# Admin Views (require authentication)
class AdminProductListCreateView(generics.ListCreateAPIView):
    """Admin API for listing and creating products"""
    queryset = Product.objects.all()
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'in_stock']
    search_fields = ['name', 'description']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer


class AdminProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin API for product detail, update, and delete"""
    queryset = Product.objects.all()
    serializer_class = ProductCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class CategoryListCreateView(generics.ListCreateAPIView):
    """API for listing and creating categories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        return [permissions.AllowAny()]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, permissions.IsAdminUser])
def upload_product_images(request, product_id):
    """Upload images for a product"""
    product = get_object_or_404(Product, id=product_id)
    
    if 'images' not in request.FILES:
        return Response(
            {'error': 'No images provided'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    images = request.FILES.getlist('images')
    created_images = []
    
    for image in images:
        product_image = ProductImage.objects.create(
            product=product,
            image=image,
            alt_text=request.data.get('alt_text', f'Image for {product.name}')
        )
        created_images.append({
            'id': product_image.id,
            'image': product_image.image.url,
            'alt_text': product_image.alt_text
        })
    
    return Response(
        {'message': f'{len(created_images)} images uploaded successfully', 'images': created_images},
        status=status.HTTP_201_CREATED
    )
