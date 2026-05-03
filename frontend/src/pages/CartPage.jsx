import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { TrashIcon, ShoppingBagIcon, ArrowRightIcon, TagIcon } from "@heroicons/react/24/outline";

export default function CartPage() {
    const dispatch = useDispatch();
    const { items: cartItems } = useSelector(s => s.cart);
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    // Use Redux cart items
    const total = cartItems.reduce((sum, item) => {
        const price = parseFloat(item.product?.price || item.product_price || 0);
        return sum + price * (item.quantity || 1);
    }, 0);
    const discount = couponApplied ? Math.round(total * 0.1) : 0;
    const finalTotal = total - discount;

    const applyCoupon = (e) => {
        e.preventDefault();
        if (coupon.toLowerCase() === 'eco10') { setCouponApplied(true); } else { alert('Invalid coupon code'); }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO title="Shopping Cart — Zymerce" description="Review your cart and checkout." />

            {/* Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <ShoppingBagIcon className="w-8 h-8 text-primary" />
                        Your Cart
                        {cartItems.length > 0 && <span className="text-lg font-semibold text-gray-400">({cartItems.length} items)</span>}
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-28 h-28 rounded-full bg-emerald-50 flex items-center justify-center mb-8">
                            <ShoppingBagIcon className="w-14 h-14 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8 max-w-sm">Discover our eco-friendly collection and start filling your cart with sustainable goodies! 🌿</p>
                        <Link to="/products" className="btn-primary px-8 py-4 text-base">
                            Browse Products <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item, idx) => {
                                const price = parseFloat(item.product?.price || item.product_price || 0);
                                const imageUrl = item.product?.image
                                    ? (item.product.image.startsWith('http') ? item.product.image : `${BASEURL}${item.product.image}`)
                                    : item.product_image ? `${BASEURL}${item.product_image}` : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop';

                                return (
                                    <div key={item.id || idx} className="bg-white rounded-3xl border border-gray-100 p-5 flex gap-5 hover:shadow-md transition-shadow duration-300">
                                        {/* Image */}
                                        <div className="w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50">
                                            <img src={imageUrl} alt={item.product?.name || item.product_name} className="w-full h-full object-cover" />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">🌿 Eco Certified</span>
                                            <h3 className="font-bold text-gray-900 mt-0.5 line-clamp-2 text-sm">
                                                {item.product?.name || item.product_name}
                                            </h3>
                                            <p className="text-lg font-black text-primary mt-1">₹{price.toLocaleString()}</p>
                                        </div>

                                        {/* Quantity & Remove */}
                                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                            <p className="text-sm font-bold text-gray-900">₹{(price * (item.quantity || 1)).toLocaleString()}</p>
                                            <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1">
                                                <button className="w-8 h-8 rounded-xl hover:bg-white hover:shadow text-gray-600 font-bold transition-all text-sm flex items-center justify-center">−</button>
                                                <span className="w-8 text-center font-bold text-gray-900 text-sm">{item.quantity || 1}</span>
                                                <button className="w-8 h-8 rounded-xl hover:bg-white hover:shadow text-gray-600 font-bold transition-all text-sm flex items-center justify-center">+</button>
                                            </div>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors p-1">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Coupon */}
                            <div className="bg-white rounded-3xl border border-gray-100 p-5">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                    <TagIcon className="w-4 h-4 text-primary" /> Coupon Code
                                </h3>
                                {couponApplied ? (
                                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                                        <span className="text-emerald-700 font-semibold text-sm">✅ ECO10 applied — 10% off!</span>
                                        <button onClick={() => setCouponApplied(false)} className="ml-auto text-xs text-red-500 hover:underline">Remove</button>
                                    </div>
                                ) : (
                                    <form onSubmit={applyCoupon} className="flex gap-3">
                                        <input
                                            value={coupon}
                                            onChange={e => setCoupon(e.target.value)}
                                            placeholder="Enter code (try: ECO10)"
                                            className="flex-1 input-field py-2.5 text-sm"
                                        />
                                        <button type="submit" className="px-5 py-2.5 bg-primary text-white rounded-2xl font-semibold text-sm hover:bg-primary-dark transition-all">Apply</button>
                                    </form>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-24">
                                <h2 className="font-black text-gray-900 text-lg mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal ({cartItems.length} items)</span>
                                        <span className="font-medium">₹{total.toLocaleString()}</span>
                                    </div>
                                    {couponApplied && (
                                        <div className="flex justify-between text-sm text-emerald-600">
                                            <span>Coupon Discount (10%)</span>
                                            <span className="font-semibold">−₹{discount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm text-emerald-600">
                                        <span>Delivery</span>
                                        <span className="font-semibold">FREE 🌿</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                                        <span className="font-black text-gray-900">Total</span>
                                        <span className="font-black text-primary text-xl">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="bg-emerald-50 rounded-2xl p-3 mb-5 text-xs text-emerald-700 flex items-center gap-2">
                                    🌱 Your order will plant {cartItems.length} tree{cartItems.length > 1 ? 's' : ''}!
                                </div>

                                <Link to="/checkout" className="btn-primary w-full py-4 text-base font-bold shadow-lg shadow-primary/20">
                                    Proceed to Checkout <ArrowRightIcon className="w-5 h-5" />
                                </Link>
                                <Link to="/products" className="block text-center text-sm text-gray-500 hover:text-primary mt-4 transition-colors">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}