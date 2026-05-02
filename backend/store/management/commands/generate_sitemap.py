from django.core.management.base import BaseCommand
from django.conf import settings
from store.models import Product, Category
from datetime import datetime
import os


class Command(BaseCommand):
    help = 'Generate sitemap.xml for SEO'

    def handle(self, *args, **kwargs):
        base_url = 'https://zymerce.com'  # Change to your production URL
        
        sitemap_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
        sitemap_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        # Homepage
        sitemap_content += self.create_url_entry(base_url, '1.0', 'daily')
        
        # Static pages
        static_pages = ['/login', '/signup', '/cart', '/wishlist']
        for page in static_pages:
            sitemap_content += self.create_url_entry(f'{base_url}{page}', '0.8', 'weekly')
        
        # Categories
        categories = Category.objects.all()
        for category in categories:
            url = f'{base_url}/?category={category.name}'
            sitemap_content += self.create_url_entry(url, '0.7', 'weekly')
        
        # Products
        products = Product.objects.filter(is_available=True)
        for product in products:
            url = f'{base_url}/product/{product.id}'
            lastmod = product.updated_at.strftime('%Y-%m-%d') if hasattr(product, 'updated_at') else None
            sitemap_content += self.create_url_entry(url, '0.9', 'daily', lastmod)
        
        sitemap_content += '</urlset>'
        
        # Save sitemap
        sitemap_path = os.path.join(settings.BASE_DIR, 'sitemap.xml')
        with open(sitemap_path, 'w', encoding='utf-8') as f:
            f.write(sitemap_content)
        
        self.stdout.write(self.style.SUCCESS(f'Successfully generated sitemap at {sitemap_path}'))
    
    def create_url_entry(self, loc, priority, changefreq, lastmod=None):
        entry = '  <url>\n'
        entry += f'    <loc>{loc}</loc>\n'
        if lastmod:
            entry += f'    <lastmod>{lastmod}</lastmod>\n'
        entry += f'    <changefreq>{changefreq}</changefreq>\n'
        entry += f'    <priority>{priority}</priority>\n'
        entry += '  </url>\n'
        return entry
