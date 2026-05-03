#!/usr/bin/env bash
# exit on error
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
python manage.py seed_production || echo "⚠️  Seed command failed, trying alternative method..."

# If management command fails, run seed_now.py directly
if [ $? -ne 0 ]; then
    echo "🔄 Running alternative seed script..."
    python seed_now.py
fi

echo ""
echo "✅ Checking database status..."
python manage.py shell -c "
from store.models import Product, Category, User
print(f'Categories: {Category.objects.count()}')
print(f'Products: {Product.objects.count()}')
print(f'Users: {User.objects.count()}')
"

echo ""
echo "========================================="
echo "✅ Build completed successfully!"
echo "========================================="
