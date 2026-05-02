import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { FireIcon, BoltIcon, SparklesIcon, TagIcon } from '@heroicons/react/24/solid';

function DealsPage() {
    const dispatch = useDispatch();
    const { products, isLoading } = useSelector((state) => state.products);
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 59,
        seconds: 59
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return { hours: 23, minutes: 59, seconds: 59 };
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get deals
    const dealProducts = Array.isArray(products) 
        ? products.filter(p => parseFloat(p.price) < 5000).slice(0, 12)
        : [];

    const flashDeals = Array.isArray(products)
        ? products.filter(p => parseFloat(p.price) < 2000).slice(0, 8)
        : [];

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Hot Deals & Offers - Zymerce"
                description="Grab amazing deals and discounts on electronics, fashion, and more. Limited time offers!"
                keywords="deals, offers, discounts, sale, Zymerce"
            />

            {/* Hero Section - Premium Design */}
            <div className="relative bg-black text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                            <FireIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Limited Time Offer</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-center mb-4 sm:mb-6 tracking-tight">
                        <span className="block">MEGA</span>
                        <span className="block bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                            DEALS
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl lg:text-2xl text-center text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto font-light">
                        Save up to <span className="text-red-400 font-bold">70%</span> on premium products. Hurry, limited stock available!
                    </p>

                    {/* Countdown Timer - Redesigned */}
                    <div className="flex justify-center gap-3 sm:gap-6">
                        {[
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.minutes, label: 'Minutes' },
                            { value: timeLeft.seconds, label: 'Seconds' }
                        ].map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 lg:p-8 min-w-[80px] sm:min-w-[120px] lg:min-w-[140px]">
                                    <div className="text-3xl sm:text-5xl lg:text-6xl font-black text-center mb-1 sm:mb-2 tabular-nums">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs sm:text-sm text-center text-gray-400 uppercase tracking-wider font-medium">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Flash Deals Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                                <BoltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Flash Deals</h2>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Grab them before they're gone</p>
                    </div>
                    <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-red-200">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">Live Now</span>
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
                        {flashDeals.map(product => (
                            <div key={product.id} className="group relative">
                                {/* Hot Badge */}
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
                                        <FireIcon className="w-3.5 h-3.5" />
                                        Hot Deal
                                    </div>
                                </div>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Best Deals Section */}
            <div className="bg-gray-50 py-12 sm:py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <TagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Best Deals</h2>
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 font-medium">Handpicked offers just for you</p>
                        </div>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                            {dealProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Benefits Section - Premium Cards */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {[
                        {
                            icon: '💰',
                            title: 'Save Big',
                            description: 'Up to 70% off on premium products',
                            gradient: 'from-blue-500 to-cyan-500'
                        },
                        {
                            icon: '🚚',
                            title: 'Free Shipping',
                            description: 'Free delivery on all deal items',
                            gradient: 'from-green-500 to-emerald-500'
                        },
                        {
                            icon: '⚡',
                            title: 'Limited Time',
                            description: 'Exclusive deals that won\'t last long',
                            gradient: 'from-purple-500 to-pink-500'
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

export default DealsPage;
