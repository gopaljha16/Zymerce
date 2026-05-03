from django.apps import AppConfig


class StoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'store'

    def ready(self):
        # Import signals or startup code here
        from django.db import connection
        from django.db.migrations.executor import MigrationExecutor
        
        # Check if migrations are complete
        executor = MigrationExecutor(connection)
        plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
        
        # Only seed if migrations are complete (no pending migrations)
        if not plan:
            self.seed_initial_data()
    
    def seed_initial_data(self):
        """Seed database with initial data if empty"""
        from store.models import Category, Product
        from django.contrib.auth.models import User
        from decimal import Decimal
        
        # Only seed if database is empty
        if Product.objects.exists():
            return
        
        print("=" * 60)
        print("AUTO-SEEDING DATABASE ON STARTUP")
        print("=" * 60)
        
        try:
            # Create admin user
            if not User.objects.filter(username='admin').exists():
                User.objects.create_superuser('admin', 'admin@zymerce.com', 'admin123')
                print('ADMIN USER CREATED')
            
            # Create categories
            categories = [
                ('Electronics', 'Electronic devices and gadgets'),
                ('Home & Kitchen', 'Home and kitchen essentials'),
                ('Fashion', 'Clothing and accessories'),
                ('Beauty & Personal Care', 'Beauty and personal care products'),
                ('Sports & Outdoors', 'Sports and outdoor equipment'),
                ('Books & Stationery', 'Books and stationery items'),
                ('Toys & Games', 'Toys and games for all ages'),
                ('Health & Wellness', 'Health and wellness products'),
            ]
            
            for name, desc in categories:
                Category.objects.get_or_create(name=name, defaults={'description': desc})
            
            print(f'CATEGORIES: {Category.objects.count()}')
            
            # Get categories
            electronics = Category.objects.get(name='Electronics')
            home = Category.objects.get(name='Home & Kitchen')
            fashion = Category.objects.get(name='Fashion')
            beauty = Category.objects.get(name='Beauty & Personal Care')
            books = Category.objects.get(name='Books & Stationery')
            sports = Category.objects.get(name='Sports & Outdoors')
            health = Category.objects.get(name='Health & Wellness')
            toys = Category.objects.get(name='Toys & Games')
            
            # Create products
            products = [
                ('Eco-Friendly Bamboo Wireless Charger', 'Sustainable bamboo wireless charging pad for all Qi-enabled devices.', '1299.00', electronics, 50, 'https://images.unsplash.com/photo-1591290619762-c588f7e8e86f?w=800&h=800&fit=crop&q=80'),
                ('Reusable Silicone Food Storage Bags', 'Set of 6 eco-friendly silicone bags to replace single-use plastic bags.', '899.00', home, 100, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=800&h=800&fit=crop&q=80'),
                ('Solar-Powered LED Garden Lights', 'Set of 8 solar-powered outdoor lights for garden decoration.', '1599.00', home, 75, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop&q=80'),
                ('Organic Cotton Tote Bag', 'Durable organic cotton shopping bag with eco-friendly print.', '399.00', fashion, 200, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop&q=80'),
                ('Bamboo Toothbrush Set', 'Pack of 4 biodegradable bamboo toothbrushes with soft bristles.', '299.00', beauty, 150, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&h=800&fit=crop&q=80'),
                ('Stainless Steel Water Bottle', 'Insulated stainless steel water bottle keeps drinks cold for 24h.', '799.00', home, 80, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop&q=80'),
                ('Recycled Paper Notebook Set', 'Set of 3 notebooks made from 100% recycled paper.', '499.00', books, 120, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&h=800&fit=crop&q=80'),
                ('Natural Jute Yoga Mat', 'Eco-friendly yoga mat made from natural jute fiber.', '1899.00', sports, 45, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=800&fit=crop&q=80'),
                ('Organic Herbal Tea Collection', 'Premium collection of 12 organic herbal teas.', '699.00', health, 90, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=800&fit=crop&q=80'),
                ('Wooden Toy Building Blocks', 'Set of 50 natural wooden building blocks.', '1299.00', toys, 60, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&h=800&fit=crop&q=80'),
            ]
            
            created_count = 0
            for name, desc, price, cat, stock, img in products:
                obj, created = Product.objects.get_or_create(
                    name=name,
                    defaults={
                        'description': desc,
                        'price': Decimal(price),
                        'category': cat,
                        'stock': stock,
                        'is_available': True,
                        'image': img
                    }
                )
                if created:
                    created_count += 1
            
            print(f'PRODUCTS CREATED: {created_count}')
            print(f'TOTAL PRODUCTS: {Product.objects.count()}')
            print("AUTO-SEEDING COMPLETED")
            print("=" * 60)
            
        except Exception as e:
            print(f"AUTO-SEED ERROR: {str(e)}")

