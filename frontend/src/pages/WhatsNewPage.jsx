import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { SparklesIcon, RocketLaunchIcon, BoltIcon } from '@heroicons/react/24/solid';

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
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title="What's New - Latest Products | Zymerce"
                description="Discover the latest products and trending items at Zymerce. Be the first to shop new arrivals!"
                keywords="new arrivals, latest products, trending, new items, Zymerce"
            />

            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                        <SparklesIcon className="w-5 h-5" />
                        <span className="font-semibold">NEW ARRIVALS</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        What's New
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
                        Discover the latest products and trending items. Be the first to shop!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-20 relative z-10">
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                        <div className="text-4xl font-bold text-primary mb-2">{newProducts.length}+</div>
                        <div className="text-gray-600">New Products</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                        <div className="text-4xl font-bold text-primary mb-2">50+</div>
                        <div className="text-gray-600">Categories</div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-6 text-center">
                        <div className="text-4xl font-bold text-primary mb-2">100%</div>
                        <div className="text-gray-600">Authentic</div>
                    </div>
                </div>

                {/* Trending Now */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <BoltIcon className="w-8 h-8 text-yellow-500" />
                        <h2 className="text-3xl font-bold text-gray-900">Trending Now</h2>
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                            🔥 Hot
                        </span>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {trendingProducts.map(product => (
                                <div key={product.id} className="relative">
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                        ⚡ Trending
                                    </div>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Just Arrived */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <RocketLaunchIcon className="w-8 h-8 text-blue-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Just Arrived</h2>
                        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                            New
                        </span>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {newProducts.map(product => (
                                <div key={product.id} className="relative">
                                    <div className="absolute top-2 left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                        ✨ New
                                    </div>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Why Shop New Arrivals */}
                <div className="mt-16 bg-gradient-to-br from-primary to-primary-dark text-white rounded-3xl p-12">
                    <h2 className="text-3xl font-bold mb-8 text-center">Why Shop New Arrivals?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-5xl mb-4">🎯</div>
                            <h3 className="text-xl font-semibold mb-2">Latest Trends</h3>
                            <p className="text-white/80">
                                Stay ahead with the newest products and latest trends
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">⭐</div>
                            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
                            <p className="text-white/80">
                                All new products are carefully selected for quality
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-5xl mb-4">🚀</div>
                            <h3 className="text-xl font-semibold mb-2">Be First</h3>
                            <p className="text-white/80">
                                Get exclusive access to new arrivals before anyone else
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhatsNewPage;
