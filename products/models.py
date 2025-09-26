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
    
    # Product details in list format
    product_details = models.JSONField(
        default=list, 
        blank=True,
        help_text="Product details in list format. Example: ['High quality material', 'Durable construction', 'Easy to use']"
    )
    
    # Product benefits in list format
    product_benefits = models.JSONField(
        default=list, 
        blank=True,
        help_text="Product benefits in list format. Example: ['Saves time', 'Cost effective', 'Long lasting']"
    )
    
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
    def main_video(self):
        """Get the first/featured video for this product"""
        featured_video = self.videos.filter(is_featured=True).first()
        if featured_video:
            return featured_video.video.url
        first_video = self.videos.first()
        return first_video.video.url if first_video else None
    
    @property
    def all_videos(self):
        """Get all videos for this product with their properties"""
        return [{
            'url': video.video.url,
            'title': video.title,
            'description': video.description,
            'autoplay': video.autoplay,
            'loop': video.loop,
            'muted': video.muted,
            'show_controls': video.show_controls,
            'is_featured': video.is_featured,
            'file_size_mb': video.file_size_mb
        } for video in self.videos.all()]
    
    @property
    def video_urls(self):
        """Get simple list of video URLs"""
        return [video.video.url for video in self.videos.all()]
    
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
    
    @property
    def details_list(self):
        """Return product details as a list"""
        if self.product_details and isinstance(self.product_details, list):
            return self.product_details
        return []
    
    @property
    def benefits_list(self):
        """Return product benefits as a list"""
        if self.product_benefits and isinstance(self.product_benefits, list):
            return self.product_benefits
        return []
    
    def add_detail(self, detail):
        """Add a new detail to the product details list"""
        if not self.product_details:
            self.product_details = []
        if detail and detail not in self.product_details:
            self.product_details.append(detail)
    
    def remove_detail(self, detail):
        """Remove a detail from the product details list"""
        if self.product_details and detail in self.product_details:
            self.product_details.remove(detail)
    
    def add_benefit(self, benefit):
        """Add a new benefit to the product benefits list"""
        if not self.product_benefits:
            self.product_benefits = []
        if benefit and benefit not in self.product_benefits:
            self.product_benefits.append(benefit)
    
    def remove_benefit(self, benefit):
        """Remove a benefit from the product benefits list"""
        if self.product_benefits and benefit in self.product_benefits:
            self.product_benefits.remove(benefit)


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


class ProductVideo(models.Model):
    product = models.ForeignKey(Product, related_name='videos', on_delete=models.CASCADE)
    video = models.FileField(
        upload_to='products/videos/',
        help_text="Upload video file (MP4, WebM, or MOV recommended for web compatibility)"
    )
    title = models.CharField(max_length=200, blank=True, help_text="Optional title for the video")
    description = models.TextField(blank=True, help_text="Optional description of the video content")
    
    # Auto-play settings
    autoplay = models.BooleanField(
        default=True, 
        help_text="Video will auto-play when visible (muted by default for web compatibility)"
    )
    loop = models.BooleanField(
        default=True, 
        help_text="Video will loop continuously"
    )
    muted = models.BooleanField(
        default=True, 
        help_text="Video will be muted by default (required for autoplay in most browsers)"
    )
    show_controls = models.BooleanField(
        default=True, 
        help_text="Show video controls (play, pause, volume, etc.)"
    )
    
    # Ordering
    order = models.PositiveIntegerField(default=0, help_text="Order of video display (lower numbers first)")
    is_featured = models.BooleanField(default=False, help_text="Featured video (shown first)")
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', 'order', 'created_at']

    def __str__(self):
        title = self.title or f"Video {self.id}"
        return f"{title} for {self.product.name}"

    def save(self, *args, **kwargs):
        # If this is set as featured, remove featured from other videos for this product
        if self.is_featured:
            ProductVideo.objects.filter(product=self.product, is_featured=True).update(is_featured=False)
        super().save(*args, **kwargs)

    @property
    def video_url(self):
        """Get the video URL"""
        return self.video.url if self.video else None

    @property
    def file_size_mb(self):
        """Get file size in MB"""
        try:
            return round(self.video.size / (1024 * 1024), 2) if self.video else 0
        except:
            return 0
