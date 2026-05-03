from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from store.models import Category, Product
from decimal import Decimal

class Command(BaseCommand):
    help = 'Seeds the database with initial data for production'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')

        # Create admin user
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@zymerce.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('✓ Admin user created'))

        # Create categories
        categories_data = [
            {'name': 'Electronics', 'description': 'Electronic devices and gadgets'},
            {'name': 'Home & Kitchen', 'description': 'Home and kitchen essentials'},
            {'name': 'Fashion', 'description': 'Clothing and accessories'},
            {'name': 'Beauty & Personal Care', 'description': 'Beauty and personal care products'},
            {'name': 'Sports & Outdoors', 'description': 'Sports and outdoor equipment'},
            {'name': 'Books & Stationery', 'description': 'Books and stationery items'},
            {'name': 'Toys & Games', 'description': 'Toys and games for all ages'},
            {'name': 'Health & Wellness', 'description': 'Health and wellness products'},
        ]

        for cat_data in categories_data:
            Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )

        self.stdout.write(self.style.SUCCESS(f'✓ {Category.objects.count()} categories created'))

        # Create sample products
        electronics = Category.objects.get(name='Electronics')
        home = Category.objects.get(name='Home & Kitchen')
        
        sample_products = [
            {
                'name': 'Eco-Friendly Bamboo Wireless Charger',
                'description': 'Sustainable bamboo wireless charging pad for all Qi-enabled devices',
                'price': Decimal('1299.00'),
                'category': electronics,
                'stock': 50,
            },
            {
                'name': 'Reusable Silicone Food Storage Bags',
                'description': 'Set of 6 eco-friendly silicone bags to replace plastic bags',
                'price': Decimal('899.00'),
                'category': home,
                'stock': 100,
            },
            {
                'name': 'Solar-Powered LED Garden Lights',
                'description': 'Set of 8 solar-powered outdoor lights for garden decoration',
                'price': Decimal('1599.00'),
                'category': home,
                'stock': 75,
            },
            {
                'name': 'Organic Cotton Tote Bag',
                'description': 'Durable organic cotton shopping bag with eco-friendly print',
                'price': Decimal('399.00'),
                'category': Category.objects.get(name='Fashion'),
                'stock': 200,
            },
        ]

        for product_data in sample_products:
            Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )

        self.stdout.write(self.style.SUCCESS(f'✓ {Product.objects.count()} products in database'))
        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
