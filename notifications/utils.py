from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_order_confirmation(order):
    """Send order confirmation email to customer"""
    subject = f'Order Confirmation - Order #{order.id}'
    
    html_message = render_to_string('emails/order_confirmation.html', {
        'order': order,
        'items': order.items.all(),
    })
    plain_message = strip_tags(html_message)
    
    # Always log to console for dev visibility
    print(f"=== ORDER CONFIRMATION EMAIL ===")
    print(f"To: {getattr(order, 'customer_email', '') or order.customer_name}")
    print(f"Subject: {subject}")
    print(f"Message: {plain_message}")
    print("================================")
    
    # Attempt actual email sending when a recipient email exists
    recipient = getattr(order, 'customer_email', None)
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@altivomart.com')
    if recipient:
        try:
            send_mail(
                subject,
                plain_message,
                from_email,
                [recipient],
                html_message=html_message,
                fail_silently=True,
            )
        except Exception as exc:
            # Keep silent in production-style code; for dev we log
            print(f"[Email send failed] {exc}")


def send_status_update(order, old_status):
    """Send order status update email to customer"""
    subject = f'Order Update - Order #{order.id}'
    
    html_message = render_to_string('emails/status_update.html', {
        'order': order,
        'old_status': old_status,
        'new_status': order.status,
    })
    plain_message = strip_tags(html_message)
    
    # Log to console
    print(f"=== ORDER STATUS UPDATE EMAIL ===")
    print(f"To: {getattr(order, 'customer_email', '') or order.customer_name}")
    print(f"Subject: {subject}")
    print(f"Status changed from {old_status} to {order.status}")
    print(f"Message: {plain_message}")
    print("==================================")
    
    recipient = getattr(order, 'customer_email', None)
    from_email = getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@altivomart.com')
    if recipient:
        try:
            send_mail(
                subject,
                plain_message,
                from_email,
                [recipient],
                html_message=html_message,
                fail_silently=True,
            )
        except Exception as exc:
            print(f"[Email send failed] {exc}")
