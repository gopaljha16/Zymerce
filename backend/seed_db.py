import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category, Product
from django.contrib.auth.models import User

def seed():
    # Create Categories
    electronics, _ = Category.objects.get_or_create(name='Electronics', slug='electronics')
    headphones, _ = Category.objects.get_or_create(name='Headphones', slug='headphones')
    furniture, _ = Category.objects.get_or_create(name='Furniture', slug='furniture')
    beauty, _ = Category.objects.get_or_create(name='Beauty', slug='beauty')
    
    # Create Products with stock
    products = [
        {
            'name': 'Wireless Earbuds, iPX8',
            'price': 89.00,
            'category': headphones,
            'description': 'Organic Cotton, fairtrade certified',
            'stock': 125,
            'is_available': True,
        },
        {
            'name': 'AirPods Max',
            'price': 549.00,
            'category': headphones,
            'description': 'A perfect balance of exhilarating high-fidelity audio and the effortless magic of AirPods.',
            'stock': 121,
            'is_available': True,
        },
        {
            'name': 'Bose BT Earphones',
            'price': 289.00,
            'category': headphones,
            'description': 'Noise-cancelling wireless earphones with premium sound quality.',
            'stock': 107,
            'is_available': True,
        },
        {
            'name': 'VIVEFOX Headphones',
            'price': 39.00,
            'category': headphones,
            'description': 'Wired Stereo Headset with High-Fidelity Audio.',
            'stock': 8,
            'is_available': True,
        },
        {
            'name': 'Borosil Body Butter',
            'price': 25.00,
            'category': beauty,
            'description': 'Nourishing body butter for soft and smooth skin.',
            'stock': 50,
            'is_available': True,
        },
        {
            'name': 'Electric Iron',
            'price': 45.00,
            'category': electronics,
            'description': 'Powerful steam iron for wrinkle-free clothes.',
            'stock': 30,
            'is_available': True,
        },
        {
            'name': 'Wooden Table',
            'price': 199.00,
            'category': furniture,
            'description': 'Elegant wooden table for your living room.',
            'stock': 15,
            'is_available': True,
        },
        {
            'name': 'LED Bulb Pack',
            'price': 12.00,
            'category': electronics,
            'description': 'Energy-efficient LED bulbs, pack of 4.',
            'stock': 200,
            'is_available': True,
        },
    ]
    
    for p_data in products:
        Product.objects.get_or_create(
            name=p_data['name'],
            defaults={
                'price': p_data['price'],
                'category': p_data['category'],
                'description': p_data['description'],
                'stock': p_data['stock'],
                'is_available': p_data['is_available'],
            }
        )
    
    print("Database seeded successfully!")
    print(f"Created {Product.objects.count()} products")
    print(f"Created {Category.objects.count()} categories")

if __name__ == '__main__':
    seed()
