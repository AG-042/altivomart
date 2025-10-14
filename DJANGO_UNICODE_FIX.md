# Django Backend - UnicodeEncodeError Fix Guide

## Issue Identified
The production checkout is failing with a `UnicodeEncodeError` in Django at `/api/orders/create/`.

## Root Cause
Django is trying to encode text containing non-ASCII characters (like emojis, special characters, or non-English text) but lacks proper Unicode configuration.

## Backend Fixes Required

### 1. Django Settings (`settings.py`)
```python
# Ensure UTF-8 encoding
import os
import sys

# Force UTF-8 encoding
if sys.version_info[0] == 3:
    import locale
    locale.setlocale(locale.LC_ALL, 'C.UTF-8')

# Database configuration - ensure UTF-8
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # or your DB engine
        'OPTIONS': {
            'charset': 'utf8mb4',  # For MySQL
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            # For PostgreSQL:
            # 'charset': 'utf8',
        },
        # ... other database settings
    }
}

# Ensure UTF-8 handling
DEFAULT_CHARSET = 'utf-8'
FILE_CHARSET = 'utf-8'
```

### 2. Order Model/Serializer (`orders/models.py` & `orders/serializers.py`)
```python
# In models.py - ensure all text fields handle Unicode
class Order(models.Model):
    customer_name = models.CharField(max_length=255, help_text="Customer name")
    address = models.TextField(help_text="Delivery address")
    # ... other fields
    
    def save(self, *args, **kwargs):
        # Ensure all text fields are properly encoded
        if self.customer_name:
            self.customer_name = str(self.customer_name).encode('utf-8', errors='replace').decode('utf-8')
        if self.address:
            self.address = str(self.address).encode('utf-8', errors='replace').decode('utf-8')
        super().save(*args, **kwargs)

# In serializers.py - add validation
class OrderSerializer(serializers.ModelSerializer):
    def validate_customer_name(self, value):
        # Ensure Unicode compatibility
        try:
            value.encode('utf-8')
            return value
        except UnicodeEncodeError:
            raise serializers.ValidationError("Customer name contains unsupported characters")
    
    def validate_address(self, value):
        # Ensure Unicode compatibility
        try:
            value.encode('utf-8')
            return value
        except UnicodeEncodeError:
            raise serializers.ValidationError("Address contains unsupported characters")
```

### 3. Views (`orders/views.py`)
```python
import logging
from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

logger = logging.getLogger(__name__)

@api_view(['POST'])
def create_order(request):
    try:
        # Log incoming data for debugging
        logger.info(f"Creating order with data: {request.data}")
        
        # Ensure all string data is UTF-8 compatible
        cleaned_data = {}
        for key, value in request.data.items():
            if isinstance(value, str):
                # Clean and ensure UTF-8 encoding
                cleaned_value = value.encode('utf-8', errors='replace').decode('utf-8')
                cleaned_data[key] = cleaned_value
            else:
                cleaned_data[key] = value
        
        serializer = OrderSerializer(data=cleaned_data)
        if serializer.is_valid():
            order = serializer.save()
            logger.info(f"Order created successfully: {order.id}")
            return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Order validation failed: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except UnicodeEncodeError as e:
        logger.error(f"Unicode encoding error in order creation: {e}")
        return JsonResponse({
            'error': 'Character encoding error',
            'detail': 'Please ensure all text contains only standard characters'
        }, status=500)
    except Exception as e:
        logger.error(f"Unexpected error in order creation: {e}")
        return JsonResponse({
            'error': 'Order creation failed',
            'detail': str(e)
        }, status=500)
```

### 4. Environment Configuration
```bash
# In your production environment
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export PYTHONIOENCODING=utf-8

# For Docker deployments
ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV PYTHONIOENCODING=utf-8
```

### 5. Immediate Testing
After implementing fixes, test with various characters:
- Regular English text: "John Doe"  
- Special characters: "José María"
- Emojis: "Happy Customer 😊"
- Apostrophes: "O'Connor"

## Quick Fix (Temporary)
If you need immediate resolution, add input sanitization on the frontend:

```javascript
// In checkout form, sanitize inputs before sending
const sanitizeText = (text) => {
  return text
    .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII
    .trim();
};

// Apply before creating order
const sanitizedOrderData = {
  ...orderData,
  customer_name: sanitizeText(orderData.customer_name),
  address: sanitizeText(orderData.address),
  // ... other text fields
};
```

This backend fix should resolve the production checkout issue completely.
