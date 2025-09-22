# 📦 Delivery Information Collection Guide

## Overview
The Altivomart backend now has a comprehensive delivery information collection system designed for the Nigerian e-commerce market.

## 🛒 **Customer Delivery Info Collection (Order Creation)**

### **Basic Information (Required)**
When customers create orders, they provide:

```json
{
  "customer_name": "Fatima Ibrahim",
  "phone_number": "+2348123456789",
  "address": "45 Wuse 2, Abuja",
  "items": [...]
}
```

### **Enhanced Delivery Information (Optional)**
Additional delivery details for better service:

```json
{
  "city": "Abuja",
  "state": "FCT", 
  "landmark": "Near Shoprite Mall",
  "delivery_instructions": "Call before delivery, leave with security if not available"
}
```

### **API Endpoint**
```
POST /api/orders/create/
```

### **Response**
The system automatically formats the full address:
```json
{
  "full_address": "45 Wuse 2, Abuja, Abuja, FCT, Near Near Shoprite Mall",
  "total_price": "185000.00",
  "status": "pending"
}
```

## 🚚 **Admin Delivery Management**

### **Delivery Information Model**
The `DeliveryInfo` model tracks comprehensive delivery details:

```python
class DeliveryInfo(models.Model):
    # Delivery person details
    delivery_person = models.CharField(max_length=200)
    delivery_phone = models.CharField(max_length=20)
    delivery_company = models.CharField(max_length=100)  # e.g., "GIG Logistics"
    
    # Delivery timing
    estimated_delivery = models.DateTimeField()
    actual_delivery = models.DateTimeField()
    delivery_status = models.CharField(choices=DELIVERY_STATUS_CHOICES)
    
    # Delivery details
    delivery_notes = models.TextField()
    delivery_fee = models.DecimalField()  # In Nigerian Naira
    tracking_number = models.CharField(max_length=100)
    
    # Delivery attempts tracking
    delivery_attempts = models.PositiveIntegerField()
    last_attempt_date = models.DateTimeField()
    failure_reason = models.TextField()
```

### **Delivery Status Flow**
1. **assigned** - Delivery person assigned
2. **picked_up** - Package picked up from warehouse
3. **in_transit** - Package in transit
4. **out_for_delivery** - Out for delivery to customer
5. **delivered** - Successfully delivered
6. **failed** - Delivery failed (customer not available, etc.)

## 🔧 **Admin API Endpoints**

### **1. Create/Update Delivery Info**
```
POST/PUT /api/orders/admin/{order_id}/delivery/
```

**Request Body:**
```json
{
  "delivery_person": "John Delivery",
  "delivery_phone": "+2348012345678",
  "delivery_company": "GIG Logistics",
  "estimated_delivery": "2025-09-21T14:00:00Z",
  "delivery_fee": "2000.00",
  "tracking_number": "GIG123456789",
  "delivery_notes": "Customer prefers morning delivery"
}
```

### **2. Update Delivery Status**
```
PATCH /api/orders/admin/{order_id}/delivery-status/
```

**Request Body:**
```json
{
  "delivery_status": "out_for_delivery",
  "delivery_notes": "Package is out for delivery",
  "failure_reason": ""
}
```

### **3. Track Delivery (Public)**
```
GET /api/orders/{order_id}/track/
```

**Response:**
```json
{
  "order_id": 6,
  "customer_name": "Fatima Ibrahim",
  "status": "on_delivery",
  "delivery_status": "out_for_delivery",
  "estimated_delivery": "2025-09-21T14:00:00Z",
  "tracking_number": "GIG123456789",
  "delivery_attempts": 0,
  "delivery_notes": "Package is out for delivery"
}
```

## 🎯 **Nigerian Market Features**

### **Nigerian States & Cities**
- Automatic state/city collection
- Landmark-based delivery instructions
- Nigerian phone number format validation

### **Delivery Companies**
Common Nigerian logistics partners:
- GIG Logistics
- DHL Nigeria
- FedEx Nigeria
- Jumia Logistics
- Kobo360
- Max.ng

### **Delivery Fees**
- Configurable delivery fees in Nigerian Naira
- Free delivery thresholds
- State-based delivery pricing

## 📱 **Frontend Integration Examples**

### **Order Creation Form**
```javascript
const orderData = {
  customer_name: "Fatima Ibrahim",
  phone_number: "+2348123456789",
  address: "45 Wuse 2, Abuja",
  city: "Abuja",
  state: "FCT",
  landmark: "Near Shoprite Mall",
  delivery_instructions: "Call before delivery",
  items: [
    { product_id: 8, quantity: 1 }
  ]
};

const response = await fetch('/api/orders/create/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

### **Delivery Tracking**
```javascript
const trackDelivery = async (orderId) => {
  const response = await fetch(`/api/orders/${orderId}/track/`);
  const trackingInfo = await response.json();
  
  console.log(`Order ${trackingInfo.order_id} is ${trackingInfo.delivery_status}`);
  console.log(`Tracking Number: ${trackingInfo.tracking_number}`);
};
```

## 🏪 **Admin Interface**

### **Django Admin Features**
- **Order Management**: View all orders with delivery info
- **Delivery Assignment**: Assign delivery persons and companies
- **Status Updates**: Update delivery status and track attempts
- **Delivery Tracking**: Monitor delivery attempts and failures

### **Admin Dashboard**
- Orders by delivery status
- Failed deliveries requiring attention
- Delivery performance metrics
- Customer delivery preferences

## 📊 **Delivery Analytics**

### **Key Metrics**
- Delivery success rate
- Average delivery time
- Failed delivery reasons
- Customer satisfaction by region
- Delivery cost analysis

### **Reports**
- Daily delivery reports
- Regional delivery performance
- Delivery person performance
- Customer delivery preferences

## 🔄 **Workflow Example**

1. **Customer Places Order**
   - Provides address, city, state, landmark
   - Adds delivery instructions
   - System calculates delivery fee

2. **Admin Processes Order**
   - Assigns delivery person/company
   - Sets estimated delivery time
   - Generates tracking number

3. **Delivery Process**
   - Package picked up
   - Status updated to "in_transit"
   - Status updated to "out_for_delivery"
   - Delivery attempted

4. **Delivery Completion**
   - Success: Status "delivered", actual_delivery timestamp
   - Failure: Status "failed", failure_reason recorded, attempt counter incremented

5. **Customer Tracking**
   - Customer can track delivery via order ID
   - Real-time status updates
   - Delivery notifications

This comprehensive system ensures efficient delivery management for the Nigerian e-commerce market!
