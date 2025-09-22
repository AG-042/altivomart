from django.contrib import admin
from .models import Product, ProductImage, Category


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'formatted_price', 'brand', 'in_stock', 'category', 'featured', 'created_at']
    list_filter = ['in_stock', 'category', 'featured', 'brand', 'created_at']
    search_fields = ['name', 'description', 'brand', 'tags']
    list_editable = ['in_stock', 'featured']
    inlines = [ProductImageInline]
    readonly_fields = ['created_at', 'updated_at', 'formatted_price']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'price', 'in_stock', 'category', 'featured')
        }),
        ('Product Details', {
            'fields': ('brand',),
            'classes': ('collapse',)
        }),
        ('Usage', {
            'fields': ('how_to_use',),
            'classes': ('collapse',)
        }),
        ('Delivery', {
            'fields': ('estimated_delivery_days',),
            'classes': ('collapse',)
        }),
        ('SEO & Marketing', {
            'fields': ('tags',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']
