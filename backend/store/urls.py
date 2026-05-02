from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
  # Auth
  path('register/', views.register_view),
  path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
  path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
  path('user/', views.get_user),
  
  # Products
  path('products/', views.get_products),
  path('products/<int:pk>/', views.get_product),
  path('categories/', views.get_categories),
  
  # Cart
  path('cart/', views.get_cart),
  path('cart/add/', views.add_to_cart),
  path('cart/remove/', views.remove_from_cart),
  path('cart/update/', views.update_cart_quantity),
  
  # Orders
  path('orders/create/', views.create_order),
  
  # Wishlist
  path('wishlist/', views.get_wishlist),
  path('wishlist/add/', views.add_to_wishlist),
  path('wishlist/remove/', views.remove_from_wishlist),
  
  # Reviews
  path('products/<int:product_id>/reviews/', views.get_product_reviews),
  path('reviews/create/', views.create_review),
  path('reviews/<int:review_id>/delete/', views.delete_review),
]