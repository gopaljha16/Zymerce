import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { SparklesIcon, RocketLaunchIcon, BoltIcon, StarIcon } from '@heroicons/react/24/solid';

function WhatsNewPage() {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Get newest products (sorted by created_at)
    const newProducts = Array.isArray(products)
        ? [...products].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 16)
        : [];

    const trendingProducts = Array.isArray(products)
        ? products.slice(0, 8)
        : [];

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="What's New - Latest Products | Zymerce"
                description="Discover the latest products and trending items at Zymerce. Be the first to shop new arrivals!"
                keywords="new arrivals, latest products, trending, new items, Zymerce"
            />

            {/* Hero Section - Premium Design */}
            <div className="relative bg-black text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">New Arrivals</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-center mb-4 sm:mb-6 tracking-tight">
                        <span className="block">WHAT'S</span>
                        <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            NEW
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl lg:text-2xl text-center text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto font-light">
                        Discover the latest products and trending items. Be the <span className="text-purple-400 font-semibold">first</span> to shop!
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto">
                        {[
                            { value: newProducts.length + '+', label: 'New Items' },
                            { value: '50+', label: 'Categories' },
                            { value: '100%', label: 'Authentic' }
                        ].map((stat, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center">
                                    <div className="text-2xl sm:text-4xl font-black mb-1 sm:mb-2">{stat.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Trending Now Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Trending Now</h2>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">What everyone's talking about</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-yellow-200">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">🔥 Hot</span>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {trendingProducts.map(product => (
                            <div key={product.id} className="group relative">
                                {/* Trending Badge */}
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                                        <BoltIcon className="w-3.5 h-3.5" />
                                        Trending
                                    </div>
                                </div>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Just Arrived Section */}
            <div className="bg-gray-50 py-12 sm:py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <RocketLaunchIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Just Arrived</h2>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 font-medium">Fresh from the warehouse</p>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-200">
                            <StarIcon className="w-4 h-4" />
                            <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">New</span>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {newProducts.map(product => (
                                <div key={product.id} className="group relative">
                                    {/* New Badge */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                                            <SparklesIcon className="w-3.5 h-3.5" />
                                            New
                                        </div>
                                    </div>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Benefits Section - Premium Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                    Why Shop New Arrivals?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {[
                        {
                            icon: '🎯',
                            title: 'Latest Trends',
                            description: 'Stay ahead with the newest products and latest trends',
                            gradient: 'from-purple-500 to-pink-500'
                        },
                        {
                            icon: '⭐',
                            title: 'Premium Quality',
                            description: 'All new products are carefully selected for quality',
                            gradient: 'from-blue-500 to-cyan-500'
                        },
                        {
                            icon: '🚀',
                            title: 'Be First',
                            description: 'Get exclusive access to new arrivals before anyone else',
                            gradient: 'from-orange-500 to-red-500'
                        }
                    ].map((benefit, index) => (
                        <div key={index} className="group relative">
                            <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                            <div className="relative bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-all hover:shadow-2xl">
                                <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">{benefit.icon}</div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{benefit.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WhatsNewPage;
