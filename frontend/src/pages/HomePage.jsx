import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import SEO from '../components/SEO';
import { ArrowRightIcon, SparklesIcon, StarIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/* ── Leaf SVG ── */
const Leaf = ({ className = '', style = {} }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" fill="#86efac" fillOpacity="0.35" />
    </svg>
);

const STATS = [
    { num: '50K+', label: 'Happy Customers', icon: '🌿' },
    { num: '2K+',  label: 'Eco Products',    icon: '🌱' },
    { num: '100%', label: 'Carbon Neutral',  icon: '♻️' },
    { num: '12,847', label: 'Trees Planted', icon: '🌳' },
];

const FEATURES = [
    { icon: TruckIcon,       title: 'Free Shipping',    sub: 'On orders above ₹999' },
    { icon: ShieldCheckIcon, title: 'Secure Payments',  sub: '100% safe & secure'   },
    { icon: ArrowPathIcon,   title: 'Easy Returns',     sub: 'Hassle-free returns'  },
    {
        icon: ({ className }) => (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636A9 9 0 1 1 5.636 18.364M12 8v4l3 3" />
            </svg>
        ),
        title: 'Support 24/7',
        sub: 'We\'re here to help',
    },
];

const CATEGORIES = [
    { emoji: '🌿', label: 'Organic',    name: 'Organic',    color: 'from-green-400 to-emerald-500' },
    { emoji: '♻️', label: 'Recycled',   name: 'Recycled',   color: 'from-teal-400 to-cyan-500'    },
    { emoji: '🌱', label: 'Natural',    name: 'Natural',    color: 'from-lime-400 to-green-500'   },
    { emoji: '💧', label: 'Zero Waste', name: 'Zero Waste', color: 'from-blue-400 to-cyan-500'    },
    { emoji: '🌻', label: 'Sustainable',name: 'Sustainable',color: 'from-amber-400 to-yellow-500' },
    { emoji: '🍃', label: 'Vegan',      name: 'Vegan',      color: 'from-emerald-400 to-teal-500' },
];

const TESTIMONIALS = [
    { name: 'Priya Sharma', role: 'Environmental Activist', text: 'Zymerce changed how I shop. Every product is genuinely eco-friendly and the quality is outstanding!', rating: 5, avatar: '👩‍🌿', rotate: '-rotate-1' },
    { name: 'Arjun Mehta',  role: 'Sustainable Chef',       text: 'Finally a store where I can trust the sustainability claims. The zero-waste packaging is phenomenal.', rating: 5, avatar: '👨‍🍳', rotate: 'rotate-1'  },
    { name: 'Kavya Nair',   role: 'Yoga Instructor',        text: 'Beautiful products, fast delivery, and I love that every purchase plants a tree. 10/10 recommend!', rating: 5, avatar: '🧘‍♀️', rotate: '-rotate-2' },
];

/* ─── Floating product price card ─── */
function PriceTag({ icon, name, price, style = {} }) {
    return (
        <div
            className="absolute flex items-center gap-2 bg-white rounded-2xl shadow-xl px-3 py-2 border border-gray-100 z-30"
            style={{ backdropFilter: 'blur(10px)', minWidth: 136, ...style }}
        >
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
            <div>
                <p className="text-[10px] font-semibold text-gray-500 leading-none">{name}</p>
                <p className="text-sm font-black text-gray-900 leading-tight">₹{price}</p>
            </div>
        </div>
    );
}

export default function HomePage() {
    const dispatch = useDispatch();
    const { products, categories, isLoading } = useSelector(s => s.products);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    useEffect(() => {
        // Force refresh to get latest products
        dispatch(fetchProducts(true));
        if (!categories?.length) dispatch(fetchCategories());
    }, [dispatch]);

    const featuredProducts  = useMemo(() => Array.isArray(products) ? products.slice(0, 8) : [], [products]);
    const trendingProducts  = useMemo(() => Array.isArray(products) ? products.slice(0, 4) : [], [products]);

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Zymerce — Good for You, Good for Earth"
                description="Shop 2000+ certified eco-friendly products. Sustainable living made beautiful."
                keywords="eco-friendly, sustainable, organic, zero waste, green living"
            />

            {/* ════════════════════════════════════════
                HERO — matches reference image exactly
            ════════════════════════════════════════ */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f7f9f4 0%, #eef5ea 40%, #f5f8ef 100%)' }}
            >
                {/* ── scattered leaves ── */}
                <Leaf className="absolute w-10 h-10 opacity-80 animate-float"  style={{ top: '8%',  left: '38%', animationDelay: '0s',   transform: 'rotate(20deg)'  }} />
                <Leaf className="absolute w-8  h-8  opacity-60 animate-float"  style={{ top: '18%', left: '55%', animationDelay: '1.2s', transform: 'rotate(-30deg)' }} />
                <Leaf className="absolute w-12 h-12 opacity-70 animate-float"  style={{ top: '60%', left: '48%', animationDelay: '2.5s', transform: 'rotate(45deg)'  }} />
                <Leaf className="absolute w-7  h-7  opacity-50 animate-float"  style={{ top: '30%', right:'6%',  animationDelay: '0.8s', transform: 'rotate(-15deg)' }} />
                <Leaf className="absolute w-9  h-9  opacity-65 animate-float"  style={{ bottom:'18%', left:'32%', animationDelay:'1.8s', transform:'rotate(60deg)'   }} />
                <Leaf className="absolute w-6  h-6  opacity-40 animate-float"  style={{ bottom:'30%', right:'18%',animationDelay:'3s',   transform:'rotate(-45deg)'  }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px] py-16 lg:py-20">

                        {/* ── LEFT CONTENT ── */}
                        <div className="relative z-10 py-4 lg:py-0 flex flex-col justify-center">
                            {/* Eco badge */}
                            <div className="inline-flex items-center gap-1.5 mb-6 animate-fade-in">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-300 bg-white/80">
                                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">100% Eco Certified</span>
                                </div>
                            </div>

                            {/* Heading */}
                            <h1 className="text-5xl sm:text-6xl lg:text-[56px] xl:text-[64px] font-black leading-[1.1] mb-5 animate-fade-in animation-delay-100"
                                style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                                Good for You,<br />
                                Good for{' '}
                                <span style={{
                                    background: 'linear-gradient(135deg, #4caf50, #2d8a40)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>
                                    Earth.
                                </span>
                            </h1>

                            {/* Subtitle */}
                            <p className="text-gray-600 text-[15px] leading-relaxed mb-7 max-w-md animate-fade-in animation-delay-200">
                                Thoughtfully crafted eco-friendly products that make a difference. Shop sustainable, live responsible.
                            </p>

                            {/* CTA buttons */}
                            <div className="flex flex-wrap items-center gap-4 mb-10 animate-fade-in animation-delay-300">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                                    style={{ background: '#1a3d28' }}
                                >
                                    Explore Products
                                    <ArrowRightIcon className="w-4 h-4" />
                                </Link>
                                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-gray-700 bg-white border border-gray-200 hover:border-primary transition-all hover:scale-105 shadow-sm">
                                    <span className="w-7 h-7 rounded-full border-2 border-gray-700 flex items-center justify-center text-xs">▶</span>
                                    Watch Story
                                </button>
                            </div>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-5 lg:gap-6 animate-fade-in animation-delay-400">
                                {STATS.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <span className="text-base">{s.icon}</span>
                                        <div>
                                            <p className="text-base font-black leading-none" style={{ color: '#1a3a2a' }}>{s.num}</p>
                                            <p className="text-[10px] text-gray-500 leading-none mt-1">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT: product scene ── */}
                        <div className="relative flex items-center justify-center h-[500px] lg:h-[560px] animate-fade-in-right animation-delay-200">
                            {/* Large circular green blob */}
                            <div
                                className="absolute"
                                style={{
                                    width: 420,
                                    height: 420,
                                    borderRadius: '50%',
                                    background: 'radial-gradient(circle, #c8e6c9 0%, #a5d6a7 60%, #81c784 100%)',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-45%, -50%)',
                                    opacity: 0.5,
                                }}
                            />

                            {/* Main eco product photo */}
                            <img
                                src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=95"
                                alt="Eco Products — Bamboo & Sustainable Items"
                                className="relative z-10 w-80 h-80 sm:w-[360px] sm:h-[360px] lg:w-[420px] lg:h-[420px] object-cover rounded-3xl shadow-2xl"
                                style={{ objectPosition: 'center', transform: 'translateX(-8%)' }}
                            />

                            {/* "Sustainable Living" label on image */}
                            <div
                                className="absolute z-20 font-black text-white text-base lg:text-lg leading-tight px-4 py-2.5 rounded-2xl"
                                style={{
                                    top: '36%',
                                    left: '18%',
                                    background: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255,255,255,0.4)',
                                    color: '#1a3a2a',
                                    fontFamily: "'Playfair Display', serif",
                                }}
                            >
                                Sustainable<br />Living
                            </div>

                            {/* Floating price tags */}
                            <PriceTag icon="🛍️" name="Eco Tote Bag"         price="899" style={{ top: '8%',  right: '8%',  animation: 'float 6s ease-in-out infinite',        animationDelay: '0.5s' }} />
                            <PriceTag icon="🪥"  name="Bamboo Toothbrush"   price="199" style={{ top: '44%', left: '0%',  animation: 'float 7s ease-in-out infinite reverse', animationDelay: '1.5s' }} />
                            <PriceTag icon="🍶"  name="Recycled Bottle"     price="699" style={{ bottom:'12%', right: '6%', animation: 'float 6.5s ease-in-out infinite',      animationDelay: '2.5s' }} />

                            {/* Zymerce circular badge (bottom-left mirror of reference) */}
                            <div
                                className="absolute z-20 w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center animate-spin-slow"
                                style={{ bottom: '8%', left: '4%', background: 'white', boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}
                            >
                                <svg viewBox="0 0 80 80" className="w-14 h-14">
                                    <path id="circle-text" d="M 40,40 m -28,0 a 28,28 0 1,1 56,0 a 28,28 0 1,1 -56,0" fill="none" />
                                    <text className="text-[7px]" fill="#1a3a2a" fontSize="7.5" fontWeight="700" letterSpacing="2.5">
                                        <textPath href="#circle-text">ZYMERCE • ECO LIVING • </textPath>
                                    </text>
                                    <text x="40" y="44" textAnchor="middle" fill="#1a3a2a" fontSize="9" fontWeight="900">🌿</text>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── BOTTOM FEATURE BAR ── */}
                <div className="border-t border-gray-200/60" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)' }}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4">
                            {/* Feature items */}
                            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                                {FEATURES.map((f, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#e8f5e9' }}>
                                            <f.icon className="w-4 h-4 text-emerald-700" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 leading-none">{f.title}</p>
                                            <p className="text-[10px] text-gray-500 mt-0.5">{f.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════
                CATEGORIES SECTION
            ════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="section-badge mx-auto">
                            <SparklesIcon className="w-4 h-4" /> Shop by Category
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black mt-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            Curated Collections
                        </h2>
                        <p className="text-gray-500 mt-3 text-base max-w-md mx-auto">
                            From organic skincare to zero-waste kitchen — find everything to live sustainably.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {(categories.length ? categories : CATEGORIES).slice(0, 6).map((cat, i) => {
                            const eco = CATEGORIES[i] || CATEGORIES[0];
                            return (
                                <Link key={i} to={`/products?category=${cat.name || eco.name}`} className="group">
                                    <div className="bg-white rounded-3xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-emerald-200">
                                        <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${eco.color} flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                                            {eco.emoji}
                                        </div>
                                        <h3 className="font-bold text-gray-800 text-xs group-hover:text-primary transition-colors">{cat.name || eco.label}</h3>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{cat.product_count || '20+'} items</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════════════════════
                FEATURED PRODUCTS
            ════════════════════════ */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <div className="section-badge">🌿 Featured</div>
                            <h2 className="text-4xl font-black mt-1" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>Best Sellers</h2>
                            <p className="text-gray-500 mt-1 text-sm">Handpicked eco-friendly products loved by thousands</p>
                        </div>
                        <Link to="/products" className="hidden sm:flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-3 transition-all">
                            View All <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </section>

            {/* ════════════════════
                TRENDING
            ════════════════════ */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <div className="section-badge" style={{ background: 'rgba(245,158,11,0.08)', borderColor: 'rgba(245,158,11,0.3)', color: '#92400e' }}>
                                🔥 Trending
                            </div>
                            <h2 className="text-4xl font-black mt-1" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>Hot This Week</h2>
                        </div>
                        <Link to="/whats-new" className="hidden sm:flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-3 transition-all">
                            What's New <ArrowRightIcon className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingProducts.map(p => (
                                <div key={p.id} className="relative">
                                    <span className="absolute top-3 left-3 z-20 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white"
                                        style={{ background: 'linear-gradient(135deg,#f59e0b,#ef4444)' }}>
                                        🔥 Hot
                                    </span>
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ════════════════════
                TESTIMONIALS
            ════════════════════ */}
            <section className="py-24" style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#fff 50%,#f0fdf4 100%)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <div className="section-badge mx-auto">❤️ Customer Love</div>
                        <h2 className="text-4xl font-black mt-2" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            What Our Community Says
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className={`testimonial-card p-7 ${t.rotate}`}>
                                <div className="flex mb-4">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <StarIcon key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-xl">{t.avatar}</div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
