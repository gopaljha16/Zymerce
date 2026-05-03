import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { FireIcon, BoltIcon, TagIcon } from '@heroicons/react/24/solid';

/* ── Leaf SVG ── */
const Leaf = ({ className = '', style = {} }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" fill="#86efac" fillOpacity="0.35" />
    </svg>
);

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
                title="Eco Deals & Offers - Zymerce"
                description="Amazing deals on sustainable products. Save on eco-friendly items. Limited time offers!"
                keywords="eco deals, sustainable offers, green discounts, sale, Zymerce"
            />

            {/* Hero Section - Eco Theme */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #fff5f0 0%, #ffe8e0 40%, #fff0e8 100%)' }}
            >
                {/* ── scattered leaves ── */}
                <Leaf className="absolute w-10 h-10 opacity-80 animate-float"  style={{ top: '10%',  left: '12%', animationDelay: '0s',   transform: 'rotate(20deg)'  }} />
                <Leaf className="absolute w-8  h-8  opacity-60 animate-float"  style={{ top: '20%', right: '15%', animationDelay: '1.2s', transform: 'rotate(-30deg)' }} />
                <Leaf className="absolute w-12 h-12 opacity-70 animate-float"  style={{ bottom: '18%', left: '18%', animationDelay: '2.5s', transform: 'rotate(45deg)'  }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-300 bg-white/80">
                            <FireIcon className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-bold text-orange-700 tracking-widest uppercase">Limited Time Offer</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        <span className="block">Eco</span>
                        <span className="block" style={{
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            DEALS
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg text-center mb-10 max-w-2xl mx-auto">
                        Save big on sustainable products. Up to <span className="text-orange-600 font-bold">50%</span> off eco-friendly items!
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex justify-center gap-4">
                        {[
                            { value: timeLeft.hours, label: 'Hours' },
                            { value: timeLeft.minutes, label: 'Minutes' },
                            { value: timeLeft.seconds, label: 'Seconds' }
                        ].map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 min-w-[100px] shadow-lg group-hover:border-orange-400 transition-all">
                                    <div className="text-4xl font-black text-center mb-2 tabular-nums" style={{ color: '#1a3a2a' }}>
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-xs text-center text-gray-500 uppercase tracking-wider font-bold">
                                        {item.label}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Flash Deals Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <div className="section-badge mb-2">
                            <BoltIcon className="w-4 h-4" /> Flash Deals
                        </div>
                        <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            Grab Them Fast
                        </h2>
                        <p className="text-gray-600 mt-2">Limited stock on eco-friendly favorites</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full border border-orange-200">
                        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-bold uppercase tracking-wide">Live Now</span>
                    </div>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {flashDeals.map(product => (
                            <div key={product.id} className="group relative">
                                {/* Hot Badge */}
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
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
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-12">
                        <div className="section-badge mb-2" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)', color: '#166534' }}>
                            <TagIcon className="w-4 h-4" /> Best Deals
                        </div>
                        <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            Sustainable Savings
                        </h2>
                        <p className="text-gray-600 mt-2">Handpicked eco-friendly offers</p>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dealProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '🌿',
                            title: 'Eco Savings',
                            description: 'Save money while saving the planet with sustainable deals'
                        },
                        {
                            icon: '🚚',
                            title: 'Free Shipping',
                            description: 'Free carbon-neutral delivery on all deal items'
                        },
                        {
                            icon: '♻️',
                            title: 'Green Guarantee',
                            description: '100% certified eco-friendly products on sale'
                        }
                    ].map((benefit, index) => (
                        <div key={index} className="group">
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-emerald-200 transition-all hover:shadow-xl">
                                <div className="text-6xl mb-6">{benefit.icon}</div>
                                <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a3a2a' }}>{benefit.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DealsPage;
