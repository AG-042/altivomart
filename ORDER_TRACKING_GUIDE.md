# 📱 Order Tracking System - Complete Guide

## 🎯 **How Customers Track Their Orders**

After placing an order, customers receive an order confirmation with their **Order ID**. They can use this ID to track their order status in real-time.

### **1. Order Confirmation Email**
When customers place an order, they receive an email like this:

```
Subject: Order Confirmation - Order #6

Thank you for your order, Fatima Ibrahim!

Your order #6 has been received and is being processed.

Order Details:
- Samsung Galaxy A24 - Quantity: 1 - Price: ₦185,000.00

Total: ₦185,000.00

Delivery Address:
45 Wuse 2, Abuja, Abuja, FCT, Near Near Shoprite Mall

We'll keep you updated on your order status. 
You can check your order status anytime using order ID: 6

Thank you for choosing Altivomart!
```

### **2. Order Tracking Methods**

#### **Method 1: Public Tracking API**
**Endpoint:** `GET /api/orders/{order_id}/track/`

**Example:**
```bash
curl http://localhost:8000/api/orders/6/track/
```

**Response:**
```json
{
  "order_id": 6,
  "customer_name": "Fatima Ibrahim",
  "status": "pending",
  "delivery_status": "out_for_delivery",
  "estimated_delivery": "2025-09-21T14:00:00Z",
  "tracking_number": "GIG123456789",
  "delivery_attempts": 0,
  "delivery_notes": "Package is out for delivery to customer"
}
```

#### **Method 2: Full Order Details**
**Endpoint:** `GET /api/orders/{order_id}/`

**Example:**
```bash
curl http://localhost:8000/api/orders/6/
```

**Response:** Complete order information including items, delivery info, and tracking details.

### **3. Frontend Integration Examples**

#### **React/Next.js Tracking Component**
```javascript
import { useState, useEffect } from 'react';

const OrderTracker = ({ orderId }) => {
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/track/`);
        const data = await response.json();
        setTrackingInfo(data);
      } catch (error) {
        console.error('Error fetching tracking info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingInfo();
  }, [orderId]);

  if (loading) return <div>Loading tracking information...</div>;
  if (!trackingInfo) return <div>Order not found</div>;

  return (
    <div className="order-tracker">
      <h2>Order #{trackingInfo.order_id} Tracking</h2>
      <div className="tracking-status">
        <p><strong>Status:</strong> {trackingInfo.delivery_status}</p>
        <p><strong>Estimated Delivery:</strong> {new Date(trackingInfo.estimated_delivery).toLocaleDateString()}</p>
        <p><strong>Tracking Number:</strong> {trackingInfo.tracking_number}</p>
        <p><strong>Delivery Notes:</strong> {trackingInfo.delivery_notes}</p>
      </div>
    </div>
  );
};
```

#### **Tracking Status Component**
```javascript
const TrackingStatus = ({ status }) => {
  const statusConfig = {
    'assigned': { color: 'blue', text: 'Delivery Assigned' },
    'picked_up': { color: 'orange', text: 'Package Picked Up' },
    'in_transit': { color: 'purple', text: 'In Transit' },
    'out_for_delivery': { color: 'green', text: 'Out for Delivery' },
    'delivered': { color: 'green', text: 'Delivered' },
    'failed': { color: 'red', text: 'Delivery Failed' }
  };

  const config = statusConfig[status] || { color: 'gray', text: 'Unknown' };

  return (
    <span className={`status-badge status-${config.color}`}>
      {config.text}
    </span>
  );
};
```

## 🔄 **Order Tracking Workflow**

### **1. Order Placement**
- Customer places order
- Receives order confirmation email with Order ID
- Order status: `pending`

### **2. Admin Processing**
- Admin assigns delivery person/company
- Sets estimated delivery time
- Generates tracking number
- Delivery status: `assigned`

### **3. Delivery Process**
- Package picked up: `picked_up`
- Package in transit: `in_transit`
- Out for delivery: `out_for_delivery`
- Delivery attempted: `delivered` or `failed`

### **4. Customer Tracking**
- Customer can track at any stage using Order ID
- Real-time status updates
- Delivery notifications via email

## 📊 **Tracking Status Meanings**

| Status | Description | Customer Action |
|--------|-------------|-----------------|
| `assigned` | Delivery person assigned | Wait for pickup |
| `picked_up` | Package collected from warehouse | Package is on the way |
| `in_transit` | Package in transit to your area | Almost there! |
| `out_for_delivery` | Package out for delivery today | Be available for delivery |
| `delivered` | Package successfully delivered | Check your doorstep |
| `failed` | Delivery attempt failed | Contact delivery company |

## 🚚 **Delivery Company Integration**

### **Nigerian Logistics Partners**
- **GIG Logistics** - Tracking: `GIG123456789`
- **DHL Nigeria** - Tracking: `DHL123456789`
- **FedEx Nigeria** - Tracking: `FEDEX123456789`
- **Jumia Logistics** - Tracking: `JUMIA123456789`

### **External Tracking Links**
```javascript
const getTrackingUrl = (company, trackingNumber) => {
  const urls = {
    'GIG Logistics': `https://giglogistics.com/track/${trackingNumber}`,
    'DHL': `https://www.dhl.com/ng-en/home/tracking.html?trackingNumber=${trackingNumber}`,
    'FedEx': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'Jumia Logistics': `https://www.jumia.com.ng/tracking/${trackingNumber}`
  };
  return urls[company] || null;
};
```

## 📱 **Mobile App Integration**

### **Deep Linking**
```javascript
// Open tracking in mobile app
const openTrackingInApp = (orderId) => {
  const deepLink = `altivomart://track/${orderId}`;
  window.location.href = deepLink;
};

// Fallback to web if app not installed
const trackOrder = (orderId) => {
  try {
    openTrackingInApp(orderId);
  } catch (error) {
    // Fallback to web tracking
    window.open(`/track/${orderId}`, '_blank');
  }
};
```

## 🔔 **Push Notifications**

### **Status Update Notifications**
```javascript
// Web Push API integration
const subscribeToOrderUpdates = async (orderId) => {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: 'your-vapid-key'
  });

  // Send subscription to backend
  await fetch('/api/orders/subscribe/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      order_id: orderId,
      subscription: subscription
    })
  });
};
```

## 📧 **Email Notifications**

Customers automatically receive email updates when:
- Order status changes
- Delivery status updates
- Delivery attempts fail
- Package is delivered

## 🎨 **UI/UX Best Practices**

### **Tracking Page Design**
1. **Clear Status Display** - Use color-coded status badges
2. **Progress Timeline** - Show delivery progress visually
3. **Contact Information** - Display delivery person contact
4. **Map Integration** - Show delivery location (if available)
5. **Estimated Time** - Clear delivery time expectations

### **Mobile-First Design**
- Large, touch-friendly buttons
- Clear typography
- Offline capability
- Push notification support

## 🔒 **Security Considerations**

- Order tracking is public (no authentication required)
- Only order ID is needed (no sensitive information exposed)
- Rate limiting on tracking endpoints
- No personal information in tracking responses

This comprehensive tracking system ensures customers always know where their orders are and when to expect delivery!
