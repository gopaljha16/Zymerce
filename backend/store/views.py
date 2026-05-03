from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, WishlistSerializer, ReviewSerializer, ProductListSerializer
from rest_framework import status
from .models import Product, Category, Cart, CartItem, Order, OrderItem, Wishlist, Review
from .serializers import ProductSerializer, CategorySerializer, CartSerializer, CartItemSerializer
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import TruncDate
from datetime import datetime, timedelta
from .ai_service import ai_service
from .cache_service import cache_service, cache_response
from django.views.decorators.cache import cache_page

class ProductPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
def get_products(request):
    # Order by created_at descending (newest first) or by id descending
    products = Product.objects.select_related('category').prefetch_related('reviews').all().order_by('-id')
    
    # Apply pagination
    paginator = ProductPagination()
    paginated_products = paginator.paginate_queryset(products, request)
    
    serializer = ProductListSerializer(paginated_products, many=True, context={'request': request})
    
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def get_product(request, pk):
    try:
        product = Product.objects.select_related('category').prefetch_related('reviews__user').get(id=pk)
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
            'product_image': request.build_absolute_uri(item.product.image.url) if item.product.image and hasattr(item.product.image, 'url') else (request.build_absolute_uri(item.product.image) if item.product.image else None),
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
    # Check cache first
    cached_stats = cache_service.get_cached_dashboard_stats()
    if cached_stats:
        return Response(cached_stats)
    
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
    
    stats_data = {
        'total_revenue': str(total_revenue),
        'total_orders': total_orders,
        'total_products': total_products,
        'total_customers': total_customers,
        'recent_orders': recent_orders_data,
        'daily_sales': list(daily_sales),
        'top_products': list(top_products),
        'status_distribution': list(status_distribution),
        'low_stock_products': low_stock_data,
    }
    
    # Cache the stats
    cache_service.cache_dashboard_stats(stats_data)
    
    return Response(stats_data)

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


# AI Chatbot Views
@api_view(['POST'])
@permission_classes([AllowAny])
def chatbot(request):
    """AI-powered chatbot for customer support with streaming support"""
    from django.http import StreamingHttpResponse
    import json
    
    message = request.data.get('message', '')
    stream = request.data.get('stream', False)
    
    if not message:
        return Response({'error': 'Message is required'}, status=400)
    
    # Get user context if authenticated
    context = None
    if request.user.is_authenticated:
        context = f"User: {request.user.username}"
        # Add recent orders info
        recent_orders = Order.objects.filter(user=request.user).order_by('-created_at')[:3]
        if recent_orders.exists():
            context += f"\nRecent orders: {', '.join([f'#{o.id} ({o.status})' for o in recent_orders])}"
    
    if stream:
        # Streaming response
        def generate():
            for chunk in ai_service.get_chatbot_response(message, context, stream=True):
                yield f"data: {json.dumps(chunk)}\n\n"
        
        response = StreamingHttpResponse(generate(), content_type='text/event-stream')
        response['Cache-Control'] = 'no-cache'
        response['X-Accel-Buffering'] = 'no'
        return response
    else:
        # Regular response
        result = ai_service.get_chatbot_response(message, context, stream=False)
        return Response(result)

@api_view(['GET'])
def product_recommendations(request):
    """Get AI-powered product recommendations"""
    product_id = request.query_params.get('product_id')
    user_id = request.query_params.get('user_id')
    limit = int(request.query_params.get('limit', 4))
    
    recommendations = ai_service.get_product_recommendations(
        product_id=product_id,
        user_id=user_id,
        limit=limit
    )
    
    serializer = ProductSerializer(recommendations, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def smart_search(request):
    """AI-powered smart search"""
    query = request.query_params.get('q', '')
    
    if not query:
        return Response({'error': 'Search query is required'}, status=400)
    
    products = ai_service.smart_search(query)
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def generate_product_description(request):
    """Generate AI product description"""
    product_name = request.data.get('name')
    category = request.data.get('category')
    
    if not product_name or not category:
        return Response({'error': 'Product name and category are required'}, status=400)
    
    description = ai_service.generate_product_description(product_name, category)
    return Response({'description': description})

# Product Management Views (Admin)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    """Create a new product"""
    try:
        # Log incoming data for debugging
        print("POST Data:", request.POST)
        print("FILES:", request.FILES)
        
        name = request.data.get('name') or request.POST.get('name')
        description = request.data.get('description') or request.POST.get('description')
        price = request.data.get('price') or request.POST.get('price')
        category_id = request.data.get('category') or request.POST.get('category')
        stock = request.data.get('stock') or request.POST.get('stock')
        image = request.FILES.get('image')
        
        # Validate required fields
        if not all([name, description, price, category_id, stock]):
            missing = []
            if not name: missing.append('name')
            if not description: missing.append('description')
            if not price: missing.append('price')
            if not category_id: missing.append('category')
            if not stock: missing.append('stock')
            return Response({'error': f'Missing required fields: {", ".join(missing)}'}, status=400)
        
        # Get category
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({'error': 'Category not found'}, status=404)
        
        # Create product
        product = Product.objects.create(
            name=name,
            description=description,
            price=price,
            category=category,
            stock=stock,
            image=image if image else None
        )
        
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print(f"Error creating product: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def manage_product(request, product_id):
    """Update or delete a product"""
    try:
        product = Product.objects.get(id=product_id)
        
        if request.method == 'PUT':
            # Update fields
            product.name = request.data.get('name', product.name)
            product.description = request.data.get('description', product.description)
            product.price = request.data.get('price', product.price)
            product.stock = request.data.get('stock', product.stock)
            
            # Update category if provided
            category_id = request.data.get('category')
            if category_id:
                try:
                    category = Category.objects.get(id=category_id)
                    product.category = category
                except Category.DoesNotExist:
                    return Response({'error': 'Category not found'}, status=404)
            
            # Update image if provided
            image = request.FILES.get('image')
            if image:
                product.image = image
            
            product.save()
            
            serializer = ProductSerializer(product, context={'request': request})
            return Response(serializer.data)
        
        elif request.method == 'DELETE':
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)
            
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def analyze_reviews(request, product_id):
    """Analyze product reviews with AI"""
    analysis = ai_service.analyze_product_reviews(product_id)
    return Response({'analysis': analysis})

# Payment Gateway Views (Razorpay)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_razorpay_order(request):
    """Create Razorpay order for payment"""
    import razorpay
    import os
    
    razorpay_key = os.getenv('RAZORPAY_KEY_ID')
    razorpay_secret = os.getenv('RAZORPAY_KEY_SECRET')
    
    if not razorpay_key or razorpay_key == 'your_razorpay_key_id':
        return Response({
            'error': 'Payment gateway not configured. Please add Razorpay credentials.'
        }, status=400)
    
    try:
        client = razorpay.Client(auth=(razorpay_key, razorpay_secret))
        
        amount = request.data.get('amount')  # Amount in rupees
        currency = request.data.get('currency', 'INR')
        
        # Create Razorpay order
        razorpay_order = client.order.create({
            'amount': int(float(amount) * 100),  # Convert to paise
            'currency': currency,
            'payment_capture': 1
        })
        
        return Response({
            'order_id': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': razorpay_key
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_razorpay_payment(request):
    """Verify Razorpay payment signature"""
    import razorpay
    import os
    
    razorpay_secret = os.getenv('RAZORPAY_KEY_SECRET')
    
    try:
        client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID'), razorpay_secret))
        
        payment_id = request.data.get('razorpay_payment_id')
        order_id = request.data.get('razorpay_order_id')
        signature = request.data.get('razorpay_signature')
        
        # Verify signature
        params_dict = {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': signature
        }
        
        client.utility.verify_payment_signature(params_dict)
        
        return Response({
            'status': 'success',
            'message': 'Payment verified successfully'
        })
    except razorpay.errors.SignatureVerificationError:
        return Response({
            'status': 'failed',
            'message': 'Payment verification failed'
        }, status=400)
    except Exception as e:
        return Response({'error': str(e)}, status=500)
