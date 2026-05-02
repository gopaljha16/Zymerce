import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../store/slices/productSlice';
import SEO from '../components/SEO';
import { 
    ComputerDesktopIcon, 
    DevicePhoneMobileIcon,
    HomeIcon,
    SparklesIcon,
    ShoppingBagIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

function CategoriesPage() {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Icon mapping for categories
    const categoryIcons = {
        'Electronics': ComputerDesktopIcon,
        'Fashion': ShoppingBagIcon,
        'Home': HomeIcon,
        'Beauty': SparklesIcon,
        'Sports': TrophyIcon,
        'Accessories': ShoppingBagIcon,
    };

    const categoryColors = [
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-pink-500 to-pink-600',
        'from-green-500 to-green-600',
        'from-yellow-500 to-yellow-600',
        'from-red-500 to-red-600',
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title="Shop by Categories - Zymerce"
                description="Browse all product categories at Zymerce. Find electronics, fashion, home goods, beauty products and more."
                keywords="categories, shop by category, product categories, Zymerce"
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Shop by Category
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Explore our wide range of products organized by categories
                    </p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-6 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => {
                        const Icon = categoryIcons[category.name] || ShoppingBagIcon;
                        const colorClass = categoryColors[index % categoryColors.length];
                        
                        return (
                            <Link
                                key={category.id}
                                to={`/?category=${category.name}`}
                                className="group"
                            >
                                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                    <div className={`bg-gradient-to-br ${colorClass} p-8 text-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                        <Icon className="w-16 h-16 mb-4 relative z-10" />
                                        <h2 className="text-3xl font-bold relative z-10">{category.name}</h2>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4">
                                            {category.product_count} Products Available
                                        </p>
                                        <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                                            <span>Browse {category.name}</span>
                                            <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Popular Categories Section */}
                <div className="mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Why Shop by Category?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-xl p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Easy Navigation</h3>
                            <p className="text-gray-600">
                                Find exactly what you're looking for with organized categories
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⚡</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Quick Discovery</h3>
                            <p className="text-gray-600">
                                Discover new products in your favorite categories
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">💎</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Curated Selection</h3>
                            <p className="text-gray-600">
                                Each category features hand-picked quality products
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;
