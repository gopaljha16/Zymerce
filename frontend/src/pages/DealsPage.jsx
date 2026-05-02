import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { FireIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/solid';

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

    // Get deals (products with price < 5000 for demo)
    const dealProducts = Array.isArray(products) 
        ? products.filter(p => parseFloat(p.price) < 5000).slice(0, 12)
        : [];

    const flashDeals = Array.isArray(products)
        ? products.filter(p => parseFloat(p.price) < 2000).slice(0, 8)
        : [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title="Hot Deals & Offers - Zymerce"
                description="Grab amazing deals and discounts on electronics, fashion, and more. Limited time offers!"
                keywords="deals, offers, discounts, sale, Zymerce"
            />

            {/* Hero Section with Countdown */}
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
                            <FireIcon className="w-5 h-5" />
                            <span className="font-semibold">HOT DEALS</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            Today's Best Deals
                        </h1>
                        <p className="text-xl text-white/90">
                            Up to 70% off on selected items
                        </p>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex justify-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px] text-center">
                            <div className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                            <div className="text-sm text-white/80">Hours</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px] text-center">
                            <div className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                            <div className="text-sm text-white/80">Minutes</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[100px] text-center">
                            <div className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                            <div className="text-sm text-white/80">Seconds</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Flash Deals */}
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <ClockIcon className="w-8 h-8 text-red-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            Limited Time
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
                            {flashDeals.map(product => (
                                <div key={product.id} className="relative">
                                    <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                        🔥 HOT
                                    </div>
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Best Deals */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <SparklesIcon className="w-8 h-8 text-yellow-600" />
                        <h2 className="text-3xl font-bold text-gray-900">Best Deals</h2>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {dealProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Deal Benefits */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6">
                        <div className="text-4xl mb-3">💰</div>
                        <h3 className="text-xl font-bold mb-2">Save Big</h3>
                        <p className="text-white/90">Get up to 70% off on selected products</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6">
                        <div className="text-4xl mb-3">🚚</div>
                        <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                        <p className="text-white/90">Free delivery on all deal items</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6">
                        <div className="text-4xl mb-3">⚡</div>
                        <h3 className="text-xl font-bold mb-2">Limited Stock</h3>
                        <p className="text-white/90">Hurry! Deals end soon</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DealsPage;
