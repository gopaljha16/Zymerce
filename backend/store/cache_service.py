from django.core.cache import cache
from django.conf import settings
from functools import wraps
import hashlib
import json

class CacheService:
    """Service for caching frequently accessed data"""
    
    # Cache timeouts (in seconds)
    PRODUCT_LIST_TIMEOUT = 300  # 5 minutes
    PRODUCT_DETAIL_TIMEOUT = 600  # 10 minutes
    CATEGORY_LIST_TIMEOUT = 3600  # 1 hour
    DASHBOARD_STATS_TIMEOUT = 60  # 1 minute
    
    @staticmethod
    def is_redis_cache():
        """Check if Redis cache is being used"""
        backend = settings.CACHES['default']['BACKEND']
        return 'redis' in backend.lower()
    
    @staticmethod
    def get_cache_key(prefix, *args, **kwargs):
        """Generate a unique cache key"""
        key_data = f"{prefix}:{args}:{sorted(kwargs.items())}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    @staticmethod
    def cache_product_list(queryset, filters=None):
        """Cache product list"""
        cache_key = CacheService.get_cache_key('products', filters=filters)
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        # If not cached, cache it
        cache.set(cache_key, queryset, CacheService.PRODUCT_LIST_TIMEOUT)
        return queryset
    
    @staticmethod
    def cache_product_detail(product_id, data):
        """Cache product detail"""
        cache_key = f'product_detail_{product_id}'
        cache.set(cache_key, data, CacheService.PRODUCT_DETAIL_TIMEOUT)
    
    @staticmethod
    def get_cached_product(product_id):
        """Get cached product detail"""
        cache_key = f'product_detail_{product_id}'
        return cache.get(cache_key)
    
    @staticmethod
    def invalidate_product_cache(product_id=None):
        """Invalidate product cache"""
        if product_id:
            cache_key = f'product_detail_{product_id}'
            cache.delete(cache_key)
        
        # If using Redis, we can delete by pattern
        if CacheService.is_redis_cache():
            try:
                # django-redis specific pattern deletion
                from django_redis import get_redis_connection
                redis_conn = get_redis_connection("default")
                # Delete all keys matching the pattern
                keys = redis_conn.keys('*products*')
                if keys:
                    redis_conn.delete(*keys)
            except (ImportError, AttributeError, Exception) as e:
                # Fallback if pattern deletion fails
                print(f"Cache pattern deletion failed: {e}")
                pass
    
    @staticmethod
    def cache_categories():
        """Cache category list"""
        cache_key = 'categories_list'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        from .models import Category
        categories = list(Category.objects.all().values())
        cache.set(cache_key, categories, CacheService.CATEGORY_LIST_TIMEOUT)
        return categories
    
    @staticmethod
    def cache_dashboard_stats(stats_data):
        """Cache dashboard statistics"""
        cache_key = 'admin_dashboard_stats'
        cache.set(cache_key, stats_data, CacheService.DASHBOARD_STATS_TIMEOUT)
    
    @staticmethod
    def get_cached_dashboard_stats():
        """Get cached dashboard stats"""
        return cache.get('admin_dashboard_stats')
    
    @staticmethod
    def clear_all_cache():
        """Clear all cache (useful for admin operations)"""
        cache.clear()


def cache_response(timeout=300, key_prefix='view'):
    """
    Decorator to cache view responses
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            # Generate cache key
            cache_key = CacheService.get_cache_key(
                key_prefix,
                request.path,
                request.GET.dict(),
                *args,
                **kwargs
            )
            
            # Try to get from cache
            cached_response = cache.get(cache_key)
            if cached_response:
                return cached_response
            
            # If not cached, execute view
            response = func(request, *args, **kwargs)
            
            # Cache the response
            cache.set(cache_key, response, timeout)
            
            return response
        return wrapper
    return decorator


# Singleton instance
cache_service = CacheService()

