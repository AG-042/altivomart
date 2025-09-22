from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from products.models import Product
import secrets
import string

def generate_tracking_code(length: int = 10) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('on_delivery', 'On Delivery'),
        ('delivered', 'Delivered'),
    ]

    # Customer information
    customer_name = models.CharField(max_length=200)
    phone_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')]
    )
    customer_email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    
    # Additional delivery info collected at order time
    city = models.CharField(max_length=100, blank=True, null=True, help_text="City for delivery")
    state = models.CharField(max_length=100, blank=True, null=True, help_text="State for delivery")
    landmark = models.CharField(max_length=200, blank=True, null=True, help_text="Nearby landmark for easy delivery")
    delivery_instructions = models.TextField(blank=True, null=True, help_text="Special delivery instructions")
    
    # Order details
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tracking_code = models.CharField(max_length=16, unique=True, db_index=True, editable=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

    def save(self, *args, **kwargs):
        # Set delivered_at when status changes to delivered
        if self.status == 'delivered' and not self.delivered_at:
            self.delivered_at = timezone.now()
        # Ensure tracking_code exists and is unique
        if not self.tracking_code:
            # Loop until a unique code is found
            while True:
                candidate = generate_tracking_code(10)
                if not Order.objects.filter(tracking_code=candidate).exists():
                    self.tracking_code = candidate
                    break
        super().save(*args, **kwargs)

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())
    
    @property
    def full_address(self):
        """Return formatted full address"""
        parts = [self.address]
        if self.city:
            parts.append(self.city)
        if self.state:
            parts.append(self.state)
        if self.landmark:
            parts.append(f"Near {self.landmark}")
        return ", ".join(parts)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at time of order

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"

    @property
    def total_price(self):
        return self.quantity * self.price


class DeliveryInfo(models.Model):
    DELIVERY_STATUS_CHOICES = [
        ('assigned', 'Assigned'),
        ('picked_up', 'Picked Up'),
        ('in_transit', 'In Transit'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('failed', 'Delivery Failed'),
    ]
    
    order = models.OneToOneField(Order, related_name='delivery_info', on_delete=models.CASCADE)
    
    # Delivery person details
    delivery_person = models.CharField(max_length=200, blank=True, null=True)
    delivery_phone = models.CharField(max_length=20, blank=True, null=True)
    delivery_company = models.CharField(max_length=100, blank=True, null=True, help_text="Delivery company/logistics partner")
    
    # Delivery timing
    estimated_delivery = models.DateTimeField(null=True, blank=True)
    actual_delivery = models.DateTimeField(null=True, blank=True)
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='assigned')
    
    # Delivery details
    delivery_notes = models.TextField(blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Delivery fee in Naira")
    tracking_number = models.CharField(max_length=100, blank=True, null=True, help_text="Delivery tracking number")
    
    # Delivery attempts
    delivery_attempts = models.PositiveIntegerField(default=0, help_text="Number of delivery attempts")
    last_attempt_date = models.DateTimeField(null=True, blank=True)
    failure_reason = models.TextField(blank=True, null=True, help_text="Reason for delivery failure")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Delivery for Order #{self.order.id}"

    def save(self, *args, **kwargs):
        # Update delivery attempts when status changes
        if self.delivery_status == 'failed':
            self.delivery_attempts += 1
            self.last_attempt_date = timezone.now()
        elif self.delivery_status == 'delivered':
            self.actual_delivery = timezone.now()
        super().save(*args, **kwargs)
