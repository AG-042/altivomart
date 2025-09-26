# Run this migration to add database indexes for better performance

from django.db import migrations

class Migration(migrations.Migration):
    dependencies = [
        ('products', '0002_product_brand_product_estimated_delivery_days_and_more'),
        ('orders', '0004_order_customer_email'),
    ]

    operations = [
        # Add indexes for common query patterns
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_product_category_stock ON products_product(category_id, in_stock);",
            reverse_sql="DROP INDEX IF EXISTS idx_product_category_stock;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_order_status_created ON orders_order(status, created_at);",
            reverse_sql="DROP INDEX IF EXISTS idx_order_status_created;"
        ),
        migrations.RunSQL(
            "CREATE INDEX IF NOT EXISTS idx_delivery_status ON orders_deliveryinfo(delivery_status);",
            reverse_sql="DROP INDEX IF EXISTS idx_delivery_status;"
        ),
    ]
