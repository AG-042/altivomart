from django.core.management.base import BaseCommand
from django.conf import settings
from products.models import Product
import os


class Command(BaseCommand):
    help = 'Check media files and URLs for products'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Checking media files configuration...'))
        
        # Check settings
        self.stdout.write(f'MEDIA_URL: {settings.MEDIA_URL}')
        self.stdout.write(f'MEDIA_ROOT: {settings.MEDIA_ROOT}')
        
        # Check if media directory exists
        if os.path.exists(settings.MEDIA_ROOT):
            self.stdout.write(self.style.SUCCESS(f'✓ Media directory exists: {settings.MEDIA_ROOT}'))
            
            # List products directory
            products_dir = os.path.join(settings.MEDIA_ROOT, 'products')
            if os.path.exists(products_dir):
                files = os.listdir(products_dir)
                self.stdout.write(f'✓ Products directory has {len(files)} files')
                for file in files[:5]:  # Show first 5 files
                    self.stdout.write(f'  - {file}')
                if len(files) > 5:
                    self.stdout.write(f'  ... and {len(files) - 5} more files')
            else:
                self.stdout.write(self.style.WARNING('⚠ Products directory not found'))
        else:
            self.stdout.write(self.style.ERROR(f'✗ Media directory not found: {settings.MEDIA_ROOT}'))
        
        # Check products with images
        products_with_images = Product.objects.filter(images__isnull=False).distinct()
        self.stdout.write(f'Products with images: {products_with_images.count()}')
        
        for product in products_with_images[:3]:
            main_image = product.images.first()
            if main_image:
                image_path = main_image.image.path
                image_url = main_image.image.url
                exists = os.path.exists(image_path)
                
                self.stdout.write(f'Product: {product.name}')
                self.stdout.write(f'  Image path: {image_path}')
                self.stdout.write(f'  Image URL: {image_url}')
                self.stdout.write(f'  File exists: {"✓" if exists else "✗"}')
                self.stdout.write(f'  Total images: {product.images.count()}')
                self.stdout.write('')
        
        self.stdout.write(self.style.SUCCESS('Media files check complete!'))
