from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    # Public APIs
    path('create/', views.OrderCreateView.as_view(), name='order-create'),
    path('<int:id>/', views.OrderDetailView.as_view(), name='order-detail'),
    path('<int:order_id>/track/', views.track_delivery, name='track-delivery'),
    
    # Admin APIs
    path('admin/', views.AdminOrderListView.as_view(), name='admin-order-list'),
    path('admin/<int:pk>/', views.AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/<int:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('admin/<int:order_id>/delivery/', views.manage_delivery_info, name='manage-delivery-info'),
    path('admin/<int:order_id>/delivery-status/', views.update_delivery_status, name='update-delivery-status'),
]
