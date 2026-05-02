import SEO from '../components/SEO';
import { 
    TruckIcon, 
    ClockIcon, 
    MapPinIcon, 
    ShieldCheckIcon,
    CurrencyDollarIcon,
    GlobeAltIcon
} from '@heroicons/react/24/outline';

function DeliveryPage() {
    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title="Delivery Information - Zymerce"
                description="Learn about our delivery options, shipping times, and policies. Free shipping on all orders!"
                keywords="delivery, shipping, free shipping, delivery time, Zymerce"
            />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <TruckIcon className="w-20 h-20 mx-auto mb-6" />
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Delivery Information
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Fast, reliable, and free shipping on all orders
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Key Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 -mt-20">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
                        <p className="text-gray-600">On all orders, no minimum purchase required</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ClockIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                        <p className="text-gray-600">3-5 business days standard delivery</p>
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Secure Packaging</h3>
                        <p className="text-gray-600">Your items arrive safe and sound</p>
                    </div>
                </div>

                {/* Delivery Options */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Delivery Options</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-green-500">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TruckIcon className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold">Standard Delivery</h3>
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                                            FREE
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                        Delivery within 3-5 business days
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            Track your order online
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            Signature on delivery
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-600">✓</span>
                                            Available nationwide
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6 border-2 border-blue-500">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ClockIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold">Express Delivery</h3>
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
                                            Coming Soon
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-3">
                                        Next-day delivery for urgent orders
                                    </p>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-600">✓</span>
                                            Delivery within 24 hours
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-600">✓</span>
                                            Priority handling
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-blue-600">✓</span>
                                            Real-time tracking
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery Process */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                1
                            </div>
                            <h3 className="font-semibold mb-2">Place Order</h3>
                            <p className="text-sm text-gray-600">
                                Complete your purchase online
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                2
                            </div>
                            <h3 className="font-semibold mb-2">Processing</h3>
                            <p className="text-sm text-gray-600">
                                We prepare your order
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                3
                            </div>
                            <h3 className="font-semibold mb-2">Shipping</h3>
                            <p className="text-sm text-gray-600">
                                Your order is on the way
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                4
                            </div>
                            <h3 className="font-semibold mb-2">Delivered</h3>
                            <p className="text-sm text-gray-600">
                                Enjoy your purchase!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Coverage Map */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <div className="flex items-center gap-3 mb-6">
                        <GlobeAltIcon className="w-8 h-8 text-primary" />
                        <h2 className="text-3xl font-bold text-gray-900">Delivery Coverage</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">We Deliver To:</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3">
                                    <MapPinIcon className="w-5 h-5 text-green-600" />
                                    <span>All major cities in India</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPinIcon className="w-5 h-5 text-green-600" />
                                    <span>Tier 2 and Tier 3 cities</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPinIcon className="w-5 h-5 text-green-600" />
                                    <span>Rural areas (selected locations)</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <MapPinIcon className="w-5 h-5 text-green-600" />
                                    <span>PO Box addresses</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Delivery Times:</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Metro Cities</span>
                                    <span className="text-primary font-semibold">2-3 days</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Other Cities</span>
                                    <span className="text-primary font-semibold">3-5 days</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium">Remote Areas</span>
                                    <span className="text-primary font-semibold">5-7 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="bg-white rounded-xl shadow-md p-6 group">
                            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                                <span>How can I track my order?</span>
                                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-600">
                                Once your order is shipped, you'll receive a tracking number via email and SMS. You can use this number to track your order on our website or the courier's website.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl shadow-md p-6 group">
                            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                                <span>Do you deliver on weekends?</span>
                                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-600">
                                Yes, we deliver on all days including weekends and public holidays. However, delivery times may vary during peak seasons.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl shadow-md p-6 group">
                            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                                <span>What if I'm not home during delivery?</span>
                                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-600">
                                Our delivery partner will attempt delivery up to 3 times. If you're unavailable, you can reschedule the delivery or pick up from the nearest collection point.
                            </p>
                        </details>

                        <details className="bg-white rounded-xl shadow-md p-6 group">
                            <summary className="font-semibold text-lg cursor-pointer list-none flex items-center justify-between">
                                <span>Is there a minimum order for free shipping?</span>
                                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <p className="mt-4 text-gray-600">
                                No! We offer free shipping on all orders, regardless of the order value. Enjoy shopping without worrying about delivery charges.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeliveryPage;
