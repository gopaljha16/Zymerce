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
    TrophyIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

function CategoriesPage() {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const categoryIcons = {
        'Electronics': ComputerDesktopIcon,
        'Fashion': ShoppingBagIcon,
        'Home': HomeIcon,
        'Beauty': SparklesIcon,
        'Sports': TrophyIcon,
        'Accessories': ShoppingBagIcon,
    };

    const categoryGradients = [
        { from: 'from-blue-500', to: 'to-cyan-500', bg: 'bg-blue-500' },
        { from: 'from-purple-500', to: 'to-pink-500', bg: 'bg-purple-500' },
        { from: 'from-orange-500', to: 'to-red-500', bg: 'bg-orange-500' },
        { from: 'from-green-500', to: 'to-emerald-500', bg: 'bg-green-500' },
        { from: 'from-yellow-500', to: 'to-orange-500', bg: 'bg-yellow-500' },
        { from: 'from-pink-500', to: 'to-rose-500', bg: 'bg-pink-500' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Shop by Categories - Zymerce"
                description="Browse all product categories at Zymerce. Find electronics, fashion, home goods, beauty products and more."
                keywords="categories, shop by category, product categories, Zymerce"
            />

            {/* Hero Section - Premium Design */}
            <div className="relative bg-black text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-6 sm:mb-8">
                            <ShoppingBagIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Explore Collections</span>
                        </div>
                        
                        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black mb-4 sm:mb-6 tracking-tight">
                            Shop by
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Category
                            </span>
                        </h1>
                        
                        <p className="text-base sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto font-light">
                            Discover curated collections across all your favorite categories
                        </p>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {categories.map((category, index) => {
                        const Icon = categoryIcons[category.name] || ShoppingBagIcon;
                        const gradient = categoryGradients[index % categoryGradients.length];
                        
                        return (
                            <Link
                                key={category.id}
                                to={`/?category=${category.name}`}
                                className="group"
                            >
                                <div className="relative h-full">
                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                                    
                                    {/* Card */}
                                    <div className="relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:border-gray-300 transition-all duration-300 hover:shadow-2xl h-full">
                                        {/* Icon Section */}
                                        <div className={`bg-gradient-to-br ${gradient.from} ${gradient.to} p-8 sm:p-10 lg:p-12 relative overflow-hidden`}>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                                            <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                                        </div>
                                        
                                        {/* Content */}
                                        <div className="p-6 sm:p-8">
                                            <h2 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-gray-900 transition-colors">
                                                {category.name}
                                            </h2>
                                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                                                {category.product_count} Products
                                            </p>
                                            <div className="flex items-center text-gray-900 font-semibold group-hover:gap-3 transition-all">
                                                <span className="text-sm sm:text-base">Explore Collection</span>
                                                <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Benefits Section */}
                <div className="mt-16 sm:mt-24 lg:mt-32">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                        Why Shop by Category?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: '🎯',
                                title: 'Easy Navigation',
                                description: 'Find exactly what you need with organized categories'
                            },
                            {
                                icon: '⚡',
                                title: 'Quick Discovery',
                                description: 'Discover new products in your favorite categories'
                            },
                            {
                                icon: '💎',
                                title: 'Curated Selection',
                                description: 'Hand-picked quality products in every category'
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="group">
                                <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-200">
                                    <div className="text-5xl sm:text-6xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{benefit.title}</h3>
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                        {benefit.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoriesPage;
