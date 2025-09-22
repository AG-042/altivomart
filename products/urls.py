from django.urls import path
from . import views

app_name = 'products'

urlpatterns = [
    # Public APIs
    path('', views.ProductListView.as_view(), name='product-list'),
    path('<int:pk>/', views.ProductDetailView.as_view(), name='product-detail'),
    
    # Admin APIs
    path('admin/', views.AdminProductListCreateView.as_view(), name='admin-product-list'),
    path('admin/<int:pk>/', views.AdminProductDetailView.as_view(), name='admin-product-detail'),
    path('admin/<int:product_id>/images/', views.upload_product_images, name='upload-product-images'),
    
    # Categories
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list'),
]
