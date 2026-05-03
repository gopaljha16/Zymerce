#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

echo "SEEDING DATABASE NOW..."
python seed_now.py || echo "Seeding failed but continuing"

echo "DATABASE STATUS:"
python manage.py shell -c "from store.models import Product; print(f'Products: {Product.objects.count()}')"
