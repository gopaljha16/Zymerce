import SEO from '../components/SEO';
import { 
    TruckIcon, 
    ClockIcon, 
    MapPinIcon, 
    ShieldCheckIcon,
    CurrencyDollarIcon,
    GlobeAltIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

function DeliveryPage() {
    return (
        <div className="min-h-screen bg-white">
            <SEO 
                title="Delivery Information - Zymerce"
                description="Learn about our delivery options, shipping times, and policies. Free shipping on all orders!"
                keywords="delivery, shipping, free shipping, delivery time, Zymerce"
            />

            {/* Hero Section - Premium Design */}
            <div className="relative bg-black text-white overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
                    {/* Badge */}
                    <div className="flex justify-center mb-6 sm:mb-8">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 px-4 sm:px-6 py-2 sm:py-3 rounded-full">
                            <TruckIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase">Fast & Free</span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-center mb-4 sm:mb-6 tracking-tight">
                        <span className="block">DELIVERY</span>
                        <span className="block bg-gradient-to-r from-green-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                            INFORMATION
                        </span>
                    </h1>

                    <p className="text-base sm:text-xl lg:text-2xl text-center text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto font-light">
                        Fast, reliable, and <span className="text-green-400 font-semibold">free shipping</span> on all orders
                    </p>

                    {/* Key Features Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
                        {[
                            { icon: CurrencyDollarIcon, label: 'Free Shipping', value: 'All Orders' },
                            { icon: ClockIcon, label: 'Fast Delivery', value: '3-5 Days' },
                            { icon: ShieldCheckIcon, label: 'Secure', value: '100% Safe' }
                        ].map((feature, index) => (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 text-center">
                                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 text-green-400" />
                                    <div className="text-lg sm:text-xl font-black mb-1">{feature.value}</div>
                                    <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium">{feature.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Delivery Options Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                {/* Section Header */}
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-4 tracking-tight">
                        Delivery Options
                    </h2>
                    <p className="text-center text-gray-600 text-sm sm:text-base font-medium">
                        Choose the delivery method that works best for you
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    {/* Standard Delivery */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white border-2 border-green-500 rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all">
                            <div className="flex items-start gap-4 sm:gap-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <TruckIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                        <h3 className="text-xl sm:text-2xl font-black">Standard Delivery</h3>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            FREE
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-medium">
                                        Delivery within 3-5 business days
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Track your order online',
                                            'Signature on delivery',
                                            'Available nationwide'
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-sm sm:text-base">
                                                <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Express Delivery */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white border-2 border-blue-500 rounded-3xl p-6 sm:p-8 hover:shadow-2xl transition-all">
                            <div className="flex items-start gap-4 sm:gap-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                                    <ClockIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                                        <h3 className="text-xl sm:text-2xl font-black">Express Delivery</h3>
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                            Coming Soon
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 font-medium">
                                        Next-day delivery for urgent orders
                                    </p>
                                    <ul className="space-y-3">
                                        {[
                                            'Delivery within 24 hours',
                                            'Priority handling',
                                            'Real-time tracking'
                                        ].map((feature, index) => (
                                            <li key={index} className="flex items-center gap-3 text-sm sm:text-base">
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
                    {/* Delivery Coverage */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-all hover:shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                    <GlobeAltIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black">We Deliver To</h3>
                            </div>
                            <ul className="space-y-4">
                                {[
                                    'All major cities in India',
                                    'Tier 2 and Tier 3 cities',
                                    'Rural areas (selected locations)',
                                    'PO Box addresses'
                                ].map((location, index) => (
                                    <li key={index} className="flex items-center gap-3 text-sm sm:text-base">
                                        <MapPinIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">{location}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Delivery Times */}
                    <div className="group relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 hover:border-gray-300 transition-all hover:shadow-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                                    <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black">Delivery Times</h3>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { location: 'Metro Cities', time: '2-3 days', color: 'text-green-600' },
                                    { location: 'Other Cities', time: '3-5 days', color: 'text-blue-600' },
                                    { location: 'Remote Areas', time: '5-7 days', color: 'text-orange-600' }
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <span className="font-semibold text-sm sm:text-base text-gray-900">{item.location}</span>
                                        <span className={`font-black text-sm sm:text-base ${item.color}`}>{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-12 sm:py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4 sm:space-y-6">
                        {[
                            {
                                question: 'How can I track my order?',
                                answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier\'s website.'
                            },
                            {
                                question: 'Do you deliver on weekends?',
                                answer: 'Yes, we deliver on all days including weekends and public holidays. However, delivery times may vary during peak seasons.'
                            },
                            {
                                question: 'What if I\'m not home during delivery?',
                                answer: 'Our delivery partner will attempt delivery up to 3 times. If you\'re unavailable, you can reschedule the delivery or pick up from the nearest collection point.'
                            },
                            {
                                question: 'Is there a minimum order for free shipping?',
                                answer: 'No! We offer free shipping on all orders, regardless of the order value. Enjoy shopping without worrying about delivery charges.'
                            }
                        ].map((faq, index) => (
                            <details key={index} className="group bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                                <summary className="font-bold text-base sm:text-lg cursor-pointer list-none p-6 sm:p-8 flex items-center justify-between">
                                    <span className="pr-4">{faq.question}</span>
                                    <span className="text-green-600 group-open:rotate-180 transition-transform flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </div>
            {/* FAQ Section */}
            <div className="bg-gray-50 py-12 sm:py-16 lg:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-8 sm:mb-12 lg:mb-16 tracking-tight">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4 sm:space-y-6">
                        {[
                            {
                                question: 'How can I track my order?',
                                answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier\'s website.'
                            },
                            {
                                question: 'Do you deliver on weekends?',
                                answer: 'Yes, we deliver on all days including weekends and public holidays. However, delivery times may vary during peak seasons.'
                            },
                            {
                                question: 'What if I\'m not home during delivery?',
                                answer: 'Our delivery partner will attempt delivery up to 3 times. If you\'re unavailable, you can reschedule the delivery or pick up from the nearest collection point.'
                            },
                            {
                                question: 'Is there a minimum order for free shipping?',
                                answer: 'No! We offer free shipping on all orders, regardless of the order value. Enjoy shopping without worrying about delivery charges.'
                            }
                        ].map((faq, index) => (
                            <details key={index} className="group bg-white rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all overflow-hidden">
                                <summary className="font-bold text-base sm:text-lg cursor-pointer list-none p-6 sm:p-8 flex items-center justify-between">
                                    <span className="pr-4">{faq.question}</span>
                                    <span className="text-green-600 group-open:rotate-180 transition-transform flex-shrink-0">
                                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0">
                                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{faq.answer}</p>
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
