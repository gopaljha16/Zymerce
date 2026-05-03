import SEO from '../components/SEO';
import { 
    TruckIcon, 
    ClockIcon, 
    MapPinIcon, 
    ShieldCheckIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

/* ── Leaf SVG ── */
const Leaf = ({ className = '', style = {} }) => (
    <svg className={className} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M4 36C4 36 8 14 28 8C28 8 32 26 12 34C12 34 20 22 24 18" fill="#86efac" fillOpacity="0.35" />
    </svg>
);

function DeliveryPage() {
    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Delivery Information - Zymerce"
                description="Learn about our eco-friendly delivery options, carbon-neutral shipping, and sustainable packaging."
                keywords="delivery, eco shipping, carbon neutral, sustainable delivery, Zymerce"
            />

            {/* Hero Section - Eco Theme */}
            <section
                className="relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #f0fdf4 100%)' }}
            >
                {/* ── scattered leaves ── */}
                <Leaf className="absolute w-10 h-10 opacity-80 animate-float"  style={{ top: '12%',  left: '12%', animationDelay: '0s',   transform: 'rotate(20deg)'  }} />
                <Leaf className="absolute w-8  h-8  opacity-60 animate-float"  style={{ top: '25%', right: '15%', animationDelay: '1.2s', transform: 'rotate(-30deg)' }} />
                <Leaf className="absolute w-12 h-12 opacity-70 animate-float"  style={{ bottom: '18%', left: '18%', animationDelay: '2.5s', transform: 'rotate(45deg)'  }} />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-300 bg-white/80">
                            <TruckIcon className="w-4 h-4 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700 tracking-widest uppercase">Carbon Neutral Shipping</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-center mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        <span className="block">Eco-Friendly</span>
                        <span className="block" style={{
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            DELIVERY
                        </span>
                    </h1>

                    <p className="text-gray-600 text-lg text-center mb-10 max-w-2xl mx-auto">
                        Fast, reliable, and <span className="text-emerald-600 font-semibold">100% carbon-neutral</span> shipping on all orders
                    </p>

                    {/* Key Features Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: '🌿', label: 'Free Shipping', value: 'All Orders' },
                            { icon: '⚡', label: 'Fast Delivery', value: '3-5 Days' },
                            { icon: '♻️', label: 'Eco Packaging', value: '100% Recycled' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl border-2 border-emerald-200 p-6 text-center shadow-lg hover:border-emerald-400 transition-all">
                                <div className="text-4xl mb-3">{feature.icon}</div>
                                <div className="text-xl font-black mb-1" style={{ color: '#1a3a2a' }}>{feature.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">{feature.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Options Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Section Header */}
                <div className="mb-12 text-center">
                    <h2 className="text-4xl font-black mb-4" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        Delivery Options
                    </h2>
                    <p className="text-gray-600 font-medium">
                        Choose the sustainable delivery method that works best for you
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Standard Delivery */}
                    <div className="group">
                        <div className="bg-white border-2 border-emerald-200 rounded-3xl p-8 hover:shadow-xl hover:border-emerald-400 transition-all">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                                    🚚
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-black" style={{ color: '#1a3a2a' }}>Standard Delivery</h3>
                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            FREE
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-6 font-medium">
                                        Carbon-neutral delivery within 3-5 business days
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Track your order online',
                                            'Recycled packaging materials',
                                            'Available nationwide'
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckCircleIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Express Delivery */}
                    <div className="group">
                        <div className="bg-white border-2 border-blue-200 rounded-3xl p-8 hover:shadow-xl hover:border-blue-400 transition-all">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">
                                    ⚡
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-black" style={{ color: '#1a3a2a' }}>Express Delivery</h3>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            Coming Soon
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-6 font-medium">
                                        Next-day eco-friendly delivery for urgent orders
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Delivery within 24 hours',
                                            'Priority green handling',
                                            'Real-time tracking'
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3">
                                                <CheckCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-gray-50 py-12 sm:py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                        How It Works
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {[
                            { step: '1', title: 'Place Order', description: 'Complete your purchase online', color: 'from-purple-500 to-pink-500' },
                            { step: '2', title: 'Processing', description: 'We prepare your order', color: 'from-blue-500 to-cyan-500' },
                            { step: '3', title: 'Shipping', description: 'Your order is on the way', color: 'from-orange-500 to-red-500' },
                            { step: '4', title: 'Delivered', description: 'Enjoy your purchase!', color: 'from-green-500 to-emerald-500' }
                        ].map((item, index) => (
                            <div key={index} className="text-center group">
                                <div className="relative inline-block mb-4 sm:mb-6">
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity`}></div>
                                    <div className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center`}>
                                        <span className="text-2xl sm:text-3xl font-black text-white">{item.step}</span>
                                    </div>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Coverage Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Delivery Coverage */}
                    <div className="group">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-emerald-200 transition-all hover:shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center text-2xl">
                                    🌍
                                </div>
                                <h3 className="text-3xl font-black" style={{ color: '#1a3a2a' }}>We Deliver To</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'All major cities in India',
                                    'Tier 2 and Tier 3 cities',
                                    'Rural areas (selected locations)',
                                    'PO Box addresses'
                                ].map((location, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <MapPinIcon className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">{location}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Delivery Times */}
                    <div className="group">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 hover:border-emerald-200 transition-all hover:shadow-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-2xl">
                                    ⏱️
                                </div>
                                <h3 className="text-3xl font-black" style={{ color: '#1a3a2a' }}>Delivery Times</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { location: 'Metro Cities', time: '2-3 days', color: 'text-emerald-600' },
                                    { location: 'Other Cities', time: '3-5 days', color: 'text-blue-600' },
                                    { location: 'Remote Areas', time: '5-7 days', color: 'text-orange-600' }
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <span className="font-semibold text-gray-900">{item.location}</span>
                                        <span className={`font-black ${item.color}`}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-black text-center mb-16" style={{ fontFamily: "'Playfair Display', serif", color: '#1a3a2a' }}>
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-6">
                        {[
                            {
                                question: 'How can I track my order?',
                                answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier\'s website.'
                            },
                            {
                                question: 'Is your packaging really eco-friendly?',
                                answer: 'Yes! We use 100% recycled and biodegradable packaging materials. All our boxes, padding, and tape are made from sustainable sources and can be recycled or composted.'
                            },
                            {
                                question: 'What if I\'m not home during delivery?',
                                answer: 'Our delivery partner will attempt delivery up to 3 times. If you\'re unavailable, you can reschedule the delivery or pick up from the nearest collection point.'
                            },
                            {
                                question: 'Is there a minimum order for free shipping?',
                                answer: 'No! We offer free carbon-neutral shipping on all orders, regardless of the order value. Enjoy shopping without worrying about delivery charges.'
                            }
                        ].map((faq, index) => (
                            <details key={index} className="group bg-white rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                                <summary className="font-bold text-lg cursor-pointer list-none p-8 flex items-center justify-between">
                                    <span className="pr-4">{faq.question}</span>
                                    <span className="text-emerald-600 group-open:rotate-180 transition-transform flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-8 pb-8 pt-0">
                                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryPage;
