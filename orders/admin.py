from django.contrib import admin
from .models import Order, OrderItem, DeliveryInfo


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['price']


class DeliveryInfoInline(admin.StackedInline):
    model = DeliveryInfo
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'tracking_code', 'customer_name', 'customer_email', 'phone_number', 'city', 'state', 'total_price', 'status', 'created_at']
    list_filter = ['status', 'city', 'state', 'created_at']
    search_fields = ['tracking_code', 'customer_name', 'customer_email', 'phone_number', 'address', 'city', 'state']
    list_editable = ['status']
    readonly_fields = ['tracking_code', 'total_price', 'created_at', 'updated_at', 'delivered_at', 'full_address']
    inlines = [OrderItemInline, DeliveryInfoInline]
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'phone_number')
        }),
        ('Delivery Address', {
            'fields': ('address', 'city', 'state', 'landmark', 'delivery_instructions', 'full_address')
        }),
        ('Order Details', {
            'fields': ('tracking_code', 'total_price', 'status', 'created_at', 'updated_at', 'delivered_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product', 'quantity', 'price']
    list_filter = ['order__created_at']


@admin.register(DeliveryInfo)
class DeliveryInfoAdmin(admin.ModelAdmin):
    list_display = ['order', 'customer_email', 'delivery_person', 'delivery_status', 'estimated_delivery', 'actual_delivery', 'delivery_attempts']
    list_filter = ['delivery_status', 'estimated_delivery', 'actual_delivery', 'delivery_company']
    search_fields = ['order__customer_name', 'order__customer_email', 'delivery_person', 'tracking_number']
    readonly_fields = ['created_at', 'updated_at', 'customer_email']
    
    def customer_email(self, obj):
        return getattr(obj.order, 'customer_email', '')
    customer_email.short_description = 'Customer Email'

    fieldsets = (
        ('Delivery Person', {
            'fields': ('delivery_person', 'delivery_phone', 'delivery_company')
        }),
        ('Delivery Timing', {
            'fields': ('estimated_delivery', 'actual_delivery', 'delivery_status')
        }),
        ('Delivery Details', {
            'fields': ('tracking_number', 'delivery_fee', 'delivery_notes')
        }),
        ('Delivery Attempts', {
            'fields': ('delivery_attempts', 'last_attempt_date', 'failure_reason')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'customer_email'),
            'classes': ('collapse',)
        }),
    )
