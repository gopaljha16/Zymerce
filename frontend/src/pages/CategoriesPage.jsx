import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCategories } from '../store/slices/productSlice';
import SEO from '../components/SEO';
import { 
    SparklesIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

/* ── Leaf SVG ── */
const Leaf = ({ className = '', style = {} }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" fill="#86efac" fillOpacity="0.35" />
    </svg>
);

function CategoriesPage() {
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const CATEGORIES = [
        { emoji: '🌿', label: 'Organic',    name: 'Organic',    color: 'from-green-400 to-emerald-500' },
        { emoji: '♻️', label: 'Recycled',   name: 'Recycled',   color: 'from-teal-400 to-cyan-500'    },
        { emoji: '🌱', label: 'Natural',    name: 'Natural',    color: 'from-lime-400 to-green-500'   },
        { emoji: '💧', label: 'Zero Waste', name: 'Zero Waste', color: 'from-blue-400 to-cyan-500'    },
        { emoji: '🌻', label: 'Sustainable',name: 'Sustainable',color: 'from-amber-400 to-yellow-500' },
        { emoji: '🍃', label: 'Vegan',      name: 'Vegan',      color: 'from-emerald-400 to-teal-500' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Shop by Categories - Zymerce"
                description="Browse eco-friendly product categories. Organic, sustainable, zero-waste and more."
                keywords="categories, eco categories, organic, sustainable, zero waste, Zymerce"
            />

            {/* Hero Section - Eco Theme */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f7f9f4 0%, #eef5ea 40%, #f5f8ef 100%)' }}
            >
                {/* ── scattered leaves ── */}
                <Leaf className="absolute w-10 h-10 opacity-80 animate-float"  style={{ top: '12%',  left: '15%', animationDelay: '0s',   transform: 'rotate(20deg)'  }} />
                <Leaf className="absolute w-8  h-8  opacity-60 animate-float"  style={{ top: '25%', right: '18%', animationDelay: '1.2s', transform: 'rotate(-30deg)' }} />
                <Leaf className="absolute w-12 h-12 opacity-70 animate-float"  style={{ bottom: '15%', left: '20%', animationDelay: '2.5s', transform: 'rotate(45deg)'  }} />
                <Leaf className="absolute w-7  h-7  opacity-50 animate-float"  style={{ top: '35%', right:'10%',  animationDelay: '0.8s', transform: 'rotate(-15deg)' }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300 bg-white/80 mb-6">
                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">Eco Collections</span>
                        </div>
                        
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                            Shop by
                            <span className="block" style={{
                                background: 'linear-gradient(135deg, #4caf50, #2d8a40)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                Category
                            </span>
                        </h1>
                        
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Discover curated eco-friendly collections across all sustainable categories
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {(categories.length ? categories : CATEGORIES).map((category, index) => {
                        const eco = CATEGORIES[index % CATEGORIES.length];
                        
                        return (
                            <Link
                                key={category.id || index}
                                to={`/products?category=${category.name || eco.name}`}
                                className="group"
                            >
                                <div className="bg-white rounded-3xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 hover:border-emerald-200">
                                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${eco.color} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                                        {eco.emoji}
                                    </div>
                                    <h3 className="font-bold text-gray-800 text-sm group-hover:text-primary transition-colors">{category.name || eco.label}</h3>
                                    <p className="text-xs text-gray-400 mt-1">{category.product_count || '20+'} items</p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Benefits Section */}
                <div className="mt-24">
                    <h2 className="text-4xl font-black text-center mb-12" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        Why Shop by Category?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🌿',
                                title: 'Eco-Organized',
                                description: 'Find sustainable products organized by eco-friendly categories'
                            },
                            {
                                icon: '🌱',
                                title: 'Certified Green',
                                description: 'Every category features 100% verified eco-friendly products'
                            },
                            {
                                icon: '♻️',
                                title: 'Curated Selection',
                                description: 'Hand-picked sustainable items in every collection'
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">
                                        {benefit.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a3a2a' }}>{benefit.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">
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
