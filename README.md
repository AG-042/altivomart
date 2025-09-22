# Altivomart E-commerce Backend

A Django REST API backend for a Nigerian e-commerce application with pay-on-delivery functionality.

## Features

- **Products Management**
  - CRUD operations for products (admin only)
  - Multiple product images support
  - Categories for product organization
  - Public product listing and details
  - Nigerian Naira (₦) currency support
  - Product usage instructions
  - Brand information and tags

- **Order Management**
  - Customer order creation
  - Order status tracking (pending, on_delivery, delivered)
  - Admin order management
  - Delivery information tracking

- **Notifications**
  - Email notifications for order confirmation
  - Email updates for order status changes

- **Authentication**
  - Basic admin authentication
  - Session-based authentication for admin operations

## Setup Instructions

1. **Clone and setup virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

3. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```

4. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- **Admin Login:** Use Django admin at `/admin/`
- **Credentials:** admin / admin123 (for sample setup)

### Products

#### Public Endpoints
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `GET /api/products/categories/` - List categories

#### Admin Endpoints (Authentication Required)
- `GET /api/products/admin/` - List all products (admin view)
- `POST /api/products/admin/` - Create new product
- `GET /api/products/admin/{id}/` - Get product details (admin)
- `PUT /api/products/admin/{id}/` - Update product
- `DELETE /api/products/admin/{id}/` - Delete product
- `POST /api/products/admin/{id}/images/` - Upload product images

### Orders

#### Public Endpoints
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{id}/` - Get order details/status

#### Admin Endpoints (Authentication Required)
- `GET /api/orders/admin/` - List all orders
- `GET /api/orders/admin/{id}/` - Get order details
- `PATCH /api/orders/admin/{id}/status/` - Update order status
- `POST /api/orders/admin/{id}/delivery/` - Create/update delivery info

### Documentation
- `GET /api/docs/` - Swagger UI documentation
- `GET /api/redoc/` - ReDoc documentation
- `GET /api/schema/` - OpenAPI schema

## API Usage Examples

### Create an Order
```bash
curl -X POST http://localhost:8000/api/orders/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Chioma Okonkwo",
    "phone_number": "+2348098765432",
    "address": "25 Surulere, Lagos State, Nigeria",
    "items": [
      {"product_id": 8, "quantity": 1},
      {"product_id": 9, "quantity": 2}
    ]
  }'
```

### Get Products
```bash
curl http://localhost:8000/api/products/
```

### Update Order Status (Admin)
```bash
curl -X PATCH http://localhost:8000/api/orders/admin/1/status/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{"status": "on_delivery"}'
```

## Models

### Product
- `name`: Product name
- `description`: Product description
- `price`: Product price in Nigerian Naira (₦)
- `in_stock`: Availability status
- `category`: Product category (optional)
- `brand`: Product brand name
- `how_to_use`: Usage instructions
- `estimated_delivery_days`: Delivery time in Nigeria
- `tags`: Comma-separated tags for search
- `featured`: Featured product flag
- `images`: Multiple product images
- `created_at`, `updated_at`: Timestamps

### Order
- `customer_name`: Customer's name
- `phone_number`: Customer's phone
- `address`: Delivery address
- `total_price`: Total order amount in Nigerian Naira
- `status`: Order status (pending/on_delivery/delivered)
- `items`: Order items with quantities
- `created_at`, `updated_at`, `delivered_at`: Timestamps

### Order Status Flow
1. **pending** - Order created, awaiting processing
2. **on_delivery** - Order is being delivered
3. **delivered** - Order has been delivered

## Nigerian Market Features

- **Currency**: All prices in Nigerian Naira (₦)
- **Sample Products**: Nigerian-focused products including:
  - Electronics (Samsung phones, HP laptops)
  - Traditional fashion (Ankara fabric, Buba & Iro sets)
  - Nigerian food items (Jollof seasoning, Palm oil)
  - Home appliances (Gas cookers)
  - Beauty products (Shea butter)
- **Delivery**: Estimated delivery days for Nigerian locations
- **Categories**: Tailored for Nigerian market needs

## Email Notifications

The system sends email notifications for:
- Order confirmation when order is created
- Status updates when order status changes

Currently configured to use console backend for development. For production, update email settings in `settings.py`.

## Frontend Integration

This API is designed to work with Next.js frontend. Key features:
- CORS enabled for localhost:3000
- RESTful API design
- Comprehensive error handling
- Pagination support
- Filtering and search capabilities
- Nigerian Naira currency formatting

## Development Notes

- SQLite database for development
- Media files stored locally
- Console email backend for development
- Debug mode enabled
- Sample Nigerian market data included

## Production Considerations

Before deploying to production:
1. Update `SECRET_KEY` and set `DEBUG = False`
2. Configure proper database (PostgreSQL recommended)
3. Set up email backend (SMTP)
4. Configure static/media file serving
5. Set up proper authentication/authorization
6. Add input validation and rate limiting
7. Set up logging and monitoring
8. Configure Nigerian payment gateways if needed
