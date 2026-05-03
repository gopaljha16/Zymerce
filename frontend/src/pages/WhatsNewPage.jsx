import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { SparklesIcon, BoltIcon, StarIcon } from '@heroicons/react/24/solid';

/* ── Leaf SVG ── */
const Leaf = ({ className = '', style = {} }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" fill="#86efac" fillOpacity="0.35" />
    </svg>
);

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
                title="What's New - Latest Eco Products | Zymerce"
                description="Discover the latest sustainable products and trending eco-friendly items. Be the first to shop new arrivals!"
                keywords="new arrivals, latest eco products, sustainable, new items, Zymerce"
            />

            {/* Hero Section - Eco Theme */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 40%, #faf5ff 100%)' }}
            >
                {/* ── scattered leaves ── */}
                <Leaf className="absolute w-10 h-10 opacity-80 animate-float"  style={{ top: '10%',  left: '10%', animationDelay: '0s',   transform: 'rotate(20deg)'  }} />
                <Leaf className="absolute w-8  h-8  opacity-60 animate-float"  style={{ top: '22%', right: '12%', animationDelay: '1.2s', transform: 'rotate(-30deg)' }} />
                <Leaf className="absolute w-12 h-12 opacity-70 animate-float"  style={{ bottom: '20%', left: '15%', animationDelay: '2.5s', transform: 'rotate(45deg)'  }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-300 bg-white/80">
                            <SparklesIcon className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700 tracking-widest uppercase">New Arrivals</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        <span className="block">What's</span>
                        <span className="block" style={{
                            background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            NEW
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg text-center mb-10 max-w-2xl mx-auto">
                        Discover the latest sustainable products. Be the <span className="text-purple-600 font-semibold">first</span> to shop eco-friendly arrivals!
                    </p>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            { value: newProducts.length + '+', label: 'New Items' },
                            { value: '100%', label: 'Eco-Friendly' },
                            { value: '50+', label: 'Categories' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white rounded-2xl border-2 border-purple-200 p-6 text-center shadow-lg hover:border-purple-400 transition-all">
                                <div className="text-3xl font-black mb-2" style={{ color: '#1a3a2a' }}>{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Now Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Section Header */}
                <div className="mb-12">
                    <div className="section-badge mb-2" style={{ background: 'rgba(251,146,60,0.08)', borderColor: 'rgba(251,146,60,0.3)', color: '#9a3412' }}>
                        <BoltIcon className="w-4 h-4" /> Trending
                    </div>
                    <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        Hot Right Now
                    </h2>
                    <p className="text-gray-600 mt-2">What everyone's loving</p>
                </div>
                
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-gray-100 rounded-3xl h-96 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {trendingProducts.map(product => (
                            <div key={product.id} className="group relative">
                                {/* Trending Badge */}
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
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
            <div className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="mb-12">
                        <div className="section-badge mb-2" style={{ background: 'rgba(34,197,94,0.08)', borderColor: 'rgba(34,197,94,0.3)', color: '#166534' }}>
                            <StarIcon className="w-4 h-4" /> Just Arrived
                        </div>
                        <h2 className="text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            Fresh Eco Finds
                        </h2>
                        <p className="text-gray-600 mt-2">Brand new sustainable products</p>
                    </div>
                    
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(16)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {newProducts.map(product => (
                                <div key={product.id} className="group relative">
                                    {/* New Badge */}
                                    <div className="absolute top-3 left-3 z-20">
                                        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg flex items-center gap-1.5">
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

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-4xl font-black text-center mb-12" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                    Why Shop New Arrivals?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: '🌿',
                            title: 'Latest Eco Trends',
                            description: 'Stay ahead with the newest sustainable products and green innovations'
                        },
                        {
                            icon: '⭐',
                            title: 'Premium Quality',
                            description: 'All new products are certified eco-friendly and ethically sourced'
                        },
                        {
                            icon: '🌱',
                            title: 'Be First',
                            description: 'Get exclusive early access to sustainable new arrivals'
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

export default WhatsNewPage;
