from django.db import models
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in Nigerian Naira (₦)")
    in_stock = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Product details
    brand = models.CharField(max_length=100, blank=True, null=True, help_text="Product brand name")
    
    # Usage instructions
    how_to_use = models.TextField(blank=True, null=True, help_text="Instructions on how to use the product")
    
    # Delivery
    estimated_delivery_days = models.PositiveIntegerField(default=3, help_text="Estimated delivery days within Nigeria")
    
    # SEO and marketing
    tags = models.CharField(max_length=500, blank=True, null=True, help_text="Comma-separated tags for search")
    featured = models.BooleanField(default=False, help_text="Featured product on homepage")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def main_image(self):
        """Get the first image for this product"""
        first_image = self.images.first()
        return first_image.image.url if first_image else None

    @property
    def all_images(self):
        """Get all images for this product"""
        return [img.image.url for img in self.images.all()]
    
    @property
    def formatted_price(self):
        """Return formatted price with Nigerian Naira symbol"""
        return f"₦{self.price:,.2f}"
    
    @property
    def tag_list(self):
        """Return tags as a list"""
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []


class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        # If this is set as primary, remove primary from other images
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)
