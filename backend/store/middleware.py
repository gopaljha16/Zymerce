from django.core.cache import cache
from django.http import JsonResponse
import time

class RateLimitMiddleware:
    """
    Rate limiting middleware to prevent abuse
    """
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit = 100  # requests per minute
        self.time_window = 60  # seconds

    def __call__(self, request):
        # Skip rate limiting for static files and admin
        if request.path.startswith('/static/') or request.path.startswith('/admin/'):
            return self.get_response(request)

        # Get client IP
        ip = self.get_client_ip(request)
        cache_key = f'rate_limit_{ip}'
        
        # Get current request count
        request_count = cache.get(cache_key, 0)
        
        if request_count >= self.rate_limit:
            return JsonResponse({
                'error': 'Rate limit exceeded. Please try again later.'
            }, status=429)
        
        # Increment request count
        cache.set(cache_key, request_count + 1, self.time_window)
        
        response = self.get_response(request)
        return response

    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecurityHeadersMiddleware:
    """
    Add security headers to all responses
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Security headers
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response['Permissions-Policy'] = 'geolocation=(), microphone=(), camera=()'
        
        return response


class RequestTimingMiddleware:
    """
    Log request timing for performance monitoring
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        
        # Log slow requests (> 1 second)
        if duration > 1.0:
            print(f"Slow request: {request.method} {request.path} took {duration:.2f}s")
        
        # Add timing header
        response['X-Request-Duration'] = f"{duration:.3f}s"
        
        return response
