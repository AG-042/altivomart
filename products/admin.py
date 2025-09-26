from django.contrib import admin
from django import forms
from django.core.exceptions import ValidationError
import json
from .models import Product, ProductImage, ProductVideo, Category


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVideoInline(admin.TabularInline):
    model = ProductVideo
    extra = 1
    fields = ['video', 'title', 'autoplay', 'loop', 'muted', 'show_controls', 'is_featured', 'order']
    readonly_fields = []


class ProductAdminForm(forms.ModelForm):
    # Custom fields for user-friendly input
    details_input = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 4, 
            'cols': 80, 
            'placeholder': 'Enter each detail on a new line:\n• High quality material\n• Durable construction\n• Easy to use'
        }),
        required=False,
        label='Product Details (one per line)',
        help_text='Enter each product detail on a separate line. Each line will become a list item.'
    )
    
    benefits_input = forms.CharField(
        widget=forms.Textarea(attrs={
            'rows': 4, 
            'cols': 80, 
            'placeholder': 'Enter each benefit on a new line:\n• Saves time\n• Cost effective\n• Long lasting'
        }),
        required=False,
        label='Product Benefits (one per line)',
        help_text='Enter each product benefit on a separate line. Each line will become a list item.'
    )

    class Meta:
        model = Product
        fields = '__all__'
        widgets = {
            'product_details': forms.HiddenInput(),
            'product_benefits': forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Populate the text areas with existing data if editing
        if self.instance.pk:
            # Handle product_details
            if self.instance.product_details:
                if isinstance(self.instance.product_details, list):
                    self.fields['details_input'].initial = '\n'.join(self.instance.product_details)
                else:
                    # If it's somehow not a list, convert it
                    self.fields['details_input'].initial = str(self.instance.product_details)
            
            # Handle product_benefits
            if self.instance.product_benefits:
                if isinstance(self.instance.product_benefits, list):
                    self.fields['benefits_input'].initial = '\n'.join(self.instance.product_benefits)
                else:
                    # If it's somehow not a list, convert it
                    self.fields['benefits_input'].initial = str(self.instance.product_benefits)

    def clean_details_input(self):
        details_input = self.cleaned_data.get('details_input', '')
        
        # Handle case where input might be a list (shouldn't happen, but just in case)
        if isinstance(details_input, list):
            return details_input
        
        # Ensure it's a string
        details_text = str(details_input) if details_input else ''
        
        if details_text.strip():
            # Split by lines and clean up
            details = [line.strip().lstrip('•').lstrip('-').lstrip('*').strip() 
                      for line in details_text.split('\n') 
                      if line.strip()]
            return details
        return []

    def clean_benefits_input(self):
        benefits_input = self.cleaned_data.get('benefits_input', '')
        
        # Handle case where input might be a list (shouldn't happen, but just in case)
        if isinstance(benefits_input, list):
            return benefits_input
        
        # Ensure it's a string
        benefits_text = str(benefits_input) if benefits_input else ''
        
        if benefits_text.strip():
            # Split by lines and clean up
            benefits = [line.strip().lstrip('•').lstrip('-').lstrip('*').strip() 
                       for line in benefits_text.split('\n') 
                       if line.strip()]
            return benefits
        return []

    def save(self, commit=True):
        instance = super().save(commit=False)
        
        # Convert the text input to JSON lists
        instance.product_details = self.clean_details_input()
        instance.product_benefits = self.clean_benefits_input()
        
        if commit:
            instance.save()
        return instance


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    form = ProductAdminForm
    list_display = ['name', 'formatted_price', 'brand', 'in_stock', 'category', 'featured', 'created_at']
    list_filter = ['in_stock', 'category', 'featured', 'brand', 'created_at']
    search_fields = ['name', 'description', 'brand', 'tags']
    list_editable = ['in_stock', 'featured']
    inlines = [ProductImageInline, ProductVideoInline]
    readonly_fields = ['created_at', 'updated_at', 'formatted_price', 'details_list_display', 'benefits_list_display']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'price', 'in_stock', 'category', 'featured')
        }),
        ('Product Details & Brand', {
            'fields': ('brand', 'details_input', 'benefits_input'),
            'description': 'Enter product details and benefits in a user-friendly format. Each line will become a separate item.'
        }),
        ('Usage Instructions', {
            'fields': ('how_to_use',),
            'classes': ('collapse',)
        }),
        ('Delivery Information', {
            'fields': ('estimated_delivery_days',),
            'classes': ('collapse',)
        }),
        ('SEO & Marketing', {
            'fields': ('tags',),
            'classes': ('collapse',)
        }),
        ('Preview (Read-only)', {
            'fields': ('details_list_display', 'benefits_list_display'),
            'classes': ('collapse',),
            'description': 'Preview how the details and benefits will appear in the API and frontend.'
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at', 'product_details', 'product_benefits'),
            'classes': ('collapse',),
            'description': 'Internal system fields - normally hidden from view.'
        }),
    )
    
    def details_list_display(self, obj):
        """Display product details as a formatted list"""
        if obj.details_list:
            items = obj.details_list
            if len(items) <= 3:
                return "• " + "\n• ".join(items)
            else:
                return "• " + "\n• ".join(items[:3]) + f"\n... and {len(items) - 3} more"
        return "No details added yet"
    details_list_display.short_description = "Product Details Preview"
    
    def benefits_list_display(self, obj):
        """Display product benefits as a formatted list"""
        if obj.benefits_list:
            items = obj.benefits_list
            if len(items) <= 3:
                return "• " + "\n• ".join(items)
            else:
                return "• " + "\n• ".join(items[:3]) + f"\n... and {len(items) - 3} more"
        return "No benefits added yet"
    benefits_list_display.short_description = "Product Benefits Preview"


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'alt_text', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']


@admin.register(ProductVideo)
class ProductVideoAdmin(admin.ModelAdmin):
    list_display = ['product', 'title', 'is_featured', 'autoplay', 'file_size_mb', 'created_at']
    list_filter = ['is_featured', 'autoplay', 'loop', 'muted', 'created_at']
    search_fields = ['product__name', 'title', 'description']
    list_editable = ['is_featured', 'autoplay']
    readonly_fields = ['file_size_mb', 'created_at']
    
    fieldsets = (
        ('Video File', {
            'fields': ('product', 'video', 'file_size_mb')
        }),
        ('Video Information', {
            'fields': ('title', 'description')
        }),
        ('Playback Settings', {
            'fields': ('autoplay', 'loop', 'muted', 'show_controls'),
            'description': 'Configure how the video behaves when displayed'
        }),
        ('Display Settings', {
            'fields': ('is_featured', 'order'),
            'description': 'Control video ordering and featured status'
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
