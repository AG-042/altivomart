from rest_framework import serializers
from .models import Product, ProductImage, ProductVideo, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary']


class ProductVideoSerializer(serializers.ModelSerializer):
    file_size_mb = serializers.ReadOnlyField()
    video_url = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductVideo
        fields = [
            'id', 'video', 'video_url', 'title', 'description', 
            'autoplay', 'loop', 'muted', 'show_controls', 
            'is_featured', 'order', 'file_size_mb', 'created_at'
        ]


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer for product list view (minimal data)"""
    main_image = serializers.ReadOnlyField()
    main_video = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    formatted_price = serializers.ReadOnlyField()
    tag_list = serializers.ReadOnlyField()
    details_list = serializers.ReadOnlyField()
    benefits_list = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'price', 'formatted_price', 'in_stock', 'main_image', 'main_video',
            'category_name', 'brand', 'featured', 'tag_list', 'created_at',
            'product_details', 'details_list', 'product_benefits', 'benefits_list'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer for product detail view (full data)"""
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)
    all_images = serializers.ReadOnlyField()
    all_videos = serializers.ReadOnlyField()
    video_urls = serializers.ReadOnlyField()
    main_video = serializers.ReadOnlyField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    formatted_price = serializers.ReadOnlyField()
    tag_list = serializers.ReadOnlyField()
    details_list = serializers.ReadOnlyField()
    benefits_list = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'formatted_price', 'in_stock', 
            'category', 'category_name', 'images', 'all_images', 'videos', 'all_videos', 
            'video_urls', 'main_video',
            
            # Product details
            'brand',
            
            # Usage
            'how_to_use',
            
            # Delivery
            'estimated_delivery_days',
            
            # Product details and benefits
            'product_details', 'details_list', 'product_benefits', 'benefits_list',
            
            # SEO and marketing
            'tags', 'tag_list', 'featured',
            
            'created_at', 'updated_at'
        ]


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products (admin only)"""
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'in_stock', 'category',
            
            # Product details
            'brand',
            
            # Usage
            'how_to_use',
            
            # Delivery
            'estimated_delivery_days',
            
            # Product details and benefits
            'product_details', 'product_benefits',
            
            # SEO and marketing
            'tags', 'featured',
            
            'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
