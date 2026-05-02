from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, WishlistSerializer, ReviewSerializer
from rest_framework import status
from .models import Product, Category, Cart, CartItem, Order, OrderItem, Wishlist, Review
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta

@api_view(['GET'])
def get_products(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)

@api_view(['GET'])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    product = Product.objects.get(id=product_id)
    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        item.quantity += 1
        item.save()
    return Response({'message': 'Product added to cart', "cart": CartSerializer(cart).data})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_quantity(request):
    item_id = request.data.get('item_id')
    quantity = request.data.get('quantity')
   
    if not item_id or quantity is None:
        return Response({'error': 'Item ID and quantity are required'}, status=400)
    
    try:
        item = CartItem.objects.get(id=item_id)
        if int(quantity) < 1:
            item.delete()
            return Response({'error': 'Quantity must be at least 1'}, status=400)
        
        item.quantity = quantity
        item.save()
        serializer = CartItemSerializer(item)
        return Response(serializer.data)
    except CartItem.DoesNotExist:
        return Response({'error': 'Cart item not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request):
    item_id = request.data.get('item_id')
    CartItem.objects.filter(id=item_id).delete()
    return Response({'message': 'Item removed from cart'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        name = data.get('name')
        address = data.get('address')
        phone = data.get('phone')
        payment_method = data.get('payment_method', 'COD')

        # Validate Phone Number
        if not phone.isdigit() or len(phone) < 10:
            return Response({'error': 'Invalid phone number'}, status=400)
        
        # Get user's cart
        cart, created = Cart.objects.get_or_create(user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=400)
        
        total = sum([item.product.price * item.quantity for item in cart.items.all()])

        order = Order.objects.create(user=request.user, total_amount=total)

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
        # Clear the cart
        cart.items.all().delete()
        return Response({'message': 'Order created successfully', 'order_id': order.id})
    except Exception as e:
        return Response({'error': str(e)}, status=500)

# Wishlist Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):
    wishlist = Wishlist.objects.filter(user=request.user)
    serializer = WishlistSerializer(wishlist, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):
    product_id = request.data.get('product_id')
    try:
        product = Product.objects.get(id=product_id)
        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if created:
            serializer = WishlistSerializer(wishlist_item, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'message': 'Product already in wishlist'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request):
    product_id = request.data.get('product_id')
    try:
        Wishlist.objects.filter(user=request.user, product_id=product_id).delete()
        return Response({'message': 'Product removed from wishlist'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Review Views
@api_view(['GET'])
def get_product_reviews(request, product_id):
    reviews = Review.objects.filter(product_id=product_id)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_review(request):
    product_id = request.data.get('product_id')
    rating = request.data.get('rating')
    comment = request.data.get('comment')
    
    try:
        product = Product.objects.get(id=product_id)
        review, created = Review.objects.update_or_create(
            user=request.user,
            product=product,
            defaults={'rating': rating, 'comment': comment}
        )
        serializer = ReviewSerializer(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id, user=request.user)
        review.delete()
        return Response({'message': 'Review deleted successfully'}, status=status.HTTP_200_OK)
    except Review.DoesNotExist:
        return Response({'error': 'Review not found'}, status=status.HTTP_404_NOT_FOUND)

# User Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    orders_data = []
    
    for order in orders:
        items = OrderItem.objects.filter(order=order)
        items_data = [{
            'product_name': item.product.name,
            'product_image': request.build_absolute_uri(item.product.image.url) if item.product.image else None,
            'quantity': item.quantity,
            'price': str(item.price),
        } for item in items]
        
        orders_data.append({
            'id': order.id,
            'status': order.status,
            'total_amount': str(order.total_amount),
            'created_at': order.created_at,
            'updated_at': order.updated_at,
            'items': items_data,
        })
    
    return Response(orders_data)
  
@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully", "user": UserSerializer(user).data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Admin Dashboard Views
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard_stats(request):
    # Total stats
    total_revenue = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    total_orders = Order.objects.count()
    total_products = Product.objects.count()
    total_customers = User.objects.filter(is_staff=False).count()
    
    # Recent orders
    recent_orders = Order.objects.order_by('-created_at')[:5]
    recent_orders_data = [{
        'id': order.id,
        'user': order.user.username if order.user else 'Guest',
        'total_amount': str(order.total_amount),
        'status': order.status,
        'created_at': order.created_at,
    } for order in recent_orders]
    
    # Sales by day (last 7 days)
    seven_days_ago = datetime.now() - timedelta(days=7)
    daily_sales = Order.objects.filter(created_at__gte=seven_days_ago).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        total=Sum('total_amount'),
        count=Count('id')
    ).order_by('date')
    
    # Top selling products
    top_products = OrderItem.objects.values('product__name').annotate(
        total_sold=Sum('quantity'),
        revenue=Sum('price')
    ).order_by('-total_sold')[:5]
    
    # Order status distribution
    status_distribution = Order.objects.values('status').annotate(count=Count('id'))
    
    # Low stock products
    low_stock = Product.objects.filter(stock__lt=10, stock__gt=0).order_by('stock')[:5]
    low_stock_data = [{
        'id': p.id,
        'name': p.name,
        'stock': p.stock,
        'price': str(p.price),
    } for p in low_stock]
    
    return Response({
        'total_revenue': str(total_revenue),
        'total_orders': total_orders,
        'total_products': total_products,
        'total_customers': total_customers,
        'recent_orders': recent_orders_data,
        'daily_sales': list(daily_sales),
        'top_products': list(top_products),
        'status_distribution': list(status_distribution),
        'low_stock_products': low_stock_data,
    })

@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        new_status = request.data.get('status')
        
        if new_status in dict(Order.STATUS_CHOICES):
            order.status = new_status
            order.save()
            return Response({'message': 'Order status updated successfully'})
        else:
            return Response({'error': 'Invalid status'}, status=400)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=404)