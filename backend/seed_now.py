#!/usr/bin/env python
"""
Quick seed script for production database
Run this in Render Shell: python seed_now.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from store.models import Category, Product
from decimal import Decimal

def main():
    print("=" * 50)
    print("🌱 Starting database seeding...")
    print("=" * 50)

    try:
        # Create admin user
        admin_created = False
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@zymerce.com', 'admin123')
            admin_created = True
            print('✅ Admin user created (username: admin, password: admin123)')
        else:
            print('✅ Admin user already exists')

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

        categories_created = 0
        for cat_data in categories_data:
            obj, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'description': cat_data['description']}
            )
            if created:
                categories_created += 1

        print(f'✅ Categories: {Category.objects.count()} total ({categories_created} new)')

        # Get categories
        electronics = Category.objects.get(name='Electronics')
        home = Category.objects.get(name='Home & Kitchen')
        fashion = Category.objects.get(name='Fashion')
        beauty = Category.objects.get(name='Beauty & Personal Care')
        books = Category.objects.get(name='Books & Stationery')
        sports = Category.objects.get(name='Sports & Outdoors')
        health = Category.objects.get(name='Health & Wellness')
        toys = Category.objects.get(name='Toys & Games')

        # Create sample products with high-quality images
        sample_products = [
            {
                'name': 'Eco-Friendly Bamboo Wireless Charger',
                'description': 'Sustainable bamboo wireless charging pad for all Qi-enabled devices. Fast charging with eco-friendly materials.',
                'price': Decimal('1299.00'),
                'category': electronics,
                'stock': 50,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Reusable Silicone Food Storage Bags',
                'description': 'Set of 6 eco-friendly silicone bags to replace single-use plastic bags. Microwave and dishwasher safe.',
                'price': Decimal('899.00'),
                'category': home,
                'stock': 100,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Solar-Powered LED Garden Lights',
                'description': 'Set of 8 solar-powered outdoor lights for garden decoration. Automatic on/off with dusk sensor.',
                'price': Decimal('1599.00'),
                'category': home,
                'stock': 75,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Organic Cotton Tote Bag',
                'description': 'Durable organic cotton shopping bag with eco-friendly print. Perfect for groceries and daily use.',
                'price': Decimal('399.00'),
                'category': fashion,
                'stock': 200,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Bamboo Toothbrush Set',
                'description': 'Pack of 4 biodegradable bamboo toothbrushes with soft bristles. Plastic-free packaging.',
                'price': Decimal('299.00'),
                'category': beauty,
                'stock': 150,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Stainless Steel Water Bottle',
                'description': 'Insulated stainless steel water bottle keeps drinks cold for 24h or hot for 12h. BPA-free.',
                'price': Decimal('799.00'),
                'category': home,
                'stock': 80,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Recycled Paper Notebook Set',
                'description': 'Set of 3 notebooks made from 100% recycled paper. Perfect for journaling and note-taking.',
                'price': Decimal('499.00'),
                'category': books,
                'stock': 120,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Natural Jute Yoga Mat',
                'description': 'Eco-friendly yoga mat made from natural jute fiber. Non-slip surface with excellent grip.',
                'price': Decimal('1899.00'),
                'category': sports,
                'stock': 45,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Organic Herbal Tea Collection',
                'description': 'Premium collection of 12 organic herbal teas. Sustainably sourced and packaged in biodegradable bags.',
                'price': Decimal('699.00'),
                'category': health,
                'stock': 90,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop&q=80',
            },
            {
                'name': 'Wooden Toy Building Blocks',
                'description': 'Set of 50 natural wooden building blocks. Non-toxic finish, perfect for creative play.',
                'price': Decimal('1299.00'),
                'category': toys,
                'stock': 60,
                'is_available': True,
                'image': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop&q=80',
            },
        ]

        products_created = 0
        for product_data in sample_products:
            obj, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            if created:
                products_created += 1
                print(f'  ✓ Created: {product_data["name"]}')

        print(f'✅ Products: {Product.objects.count()} total ({products_created} new)')
        
        print("=" * 50)
        print("🎉 Database seeding completed successfully!")
        print("=" * 50)
        
        # Final summary
        print("\n📊 FINAL DATABASE STATUS:")
        print(f"   Users: {User.objects.count()}")
        print(f"   Categories: {Category.objects.count()}")
        print(f"   Products: {Product.objects.count()}")
        
        return 0
        
    except Exception as e:
        print(f"\n❌ ERROR during seeding: {str(e)}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == '__main__':
    exit_code = main()
    sys.exit(exit_code)