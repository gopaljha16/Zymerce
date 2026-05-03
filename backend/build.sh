#!/usr/bin/env bash
# Don't exit on error for seeding - we want to continue even if it fails
set -o errexit

echo "========================================="
echo "🚀 Starting Zymerce Backend Build"
echo "========================================="

echo ""
echo "📦 Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "📁 Collecting static files..."
python manage.py collectstatic --no-input

echo ""
echo "🗄️  Running database migrations..."
python manage.py migrate

echo ""
echo "🌱 Seeding database with initial data..."

# Temporarily disable exit on error for seeding
set +e

# Run seed_now.py directly - it's more reliable
python seed_now.py

# Check if seeding was successful
SEED_EXIT_CODE=$?

# Re-enable exit on error
set -e

if [ $SEED_EXIT_CODE -eq 0 ]; then
    echo "✅ Database seeding completed!"
else
    echo "⚠️  Seeding had issues (exit code: $SEED_EXIT_CODE)"
    echo "Continuing with build..."
fi

echo ""
echo "📊 Checking database status..."
python manage.py shell -c "
from store.models import Product, Category
from django.contrib.auth import get_user_model
User = get_user_model()
print('========================================')
print('DATABASE STATUS:')
print(f'Categories: {Category.objects.count()}')
print(f'Products: {Product.objects.count()}')
print(f'Users: {User.objects.count()}')
print(f'Admin Users: {User.objects.filter(is_staff=True).count()}')
print('========================================')
if Product.objects.count() == 0:
    print('⚠️  WARNING: No products in database!')
    print('Run manually: python seed_now.py')
else:
    print('✅ Products loaded successfully!')
    # Show first 3 products
    from store.models import Product
    for p in Product.objects.all()[:3]:
        print(f'  - {p.name} (₹{p.price})')
"

echo ""
echo "========================================="
echo "✅ Build completed!"
echo "========================================="
