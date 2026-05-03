import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import { fetchCategories } from './store/slices/productSlice';
import HomePage from "./pages/HomePage";
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CategoriesPage from "./pages/CategoriesPage";
import DealsPage from "./pages/DealsPage";
import WhatsNewPage from "./pages/WhatsNewPage";
import DeliveryPage from "./pages/DeliveryPage";
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProductManagement from "./pages/ProductManagement";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import PrivateRouter from './components/PrivateRouter';

const FOOTER_LINKS = {
    Shop: [
        { label: 'All Products', to: '/products' },
        { label: 'Categories', to: '/categories' },
        { label: 'Deals & Offers', to: '/deals' },
        { label: "What's New", to: '/whats-new' },
        { label: 'Wishlist', to: '/wishlist' },
    ],
    Support: [
        { label: 'Delivery Info', to: '/delivery' },
        { label: 'Returns & Refunds', to: '#' },
        { label: 'Track Order', to: '#' },
        { label: 'FAQs', to: '#' },
        { label: 'Contact Us', to: '#' },
    ],
    Company: [
        { label: 'About Us', to: '#' },
        { label: 'Sustainability', to: '#' },
        { label: 'Careers', to: '#' },
        { label: 'Privacy Policy', to: '#' },
        { label: 'Terms of Service', to: '#' },
    ],
};

function App() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchCategories());
        if (user) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, user]);

    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow pt-20">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/deals" element={<DealsPage />} />
                        <Route path="/whats-new" element={<WhatsNewPage />} />
                        <Route path="/delivery" element={<DeliveryPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route element={<PrivateRouter />}>
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/dashboard" element={<UserDashboard />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/admin/products" element={<ProductManagement />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>

                <AIChatbot />

                {/* ── PREMIUM ECO FOOTER ── */}
                <footer className="text-white" style={{ background: 'linear-gradient(180deg, #0a3622 0%, #061f14 100%)' }}>
                    {/* Top CTA bar */}
                    <div className="border-b border-white/8" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-xl font-black mb-1">🌱 Every Purchase Plants a Tree</h3>
                                    <p className="text-emerald-300 text-sm">Join 50,000+ eco-conscious shoppers making a difference</p>
                                </div>
                                <div className="flex gap-4 text-sm">
                                    {['12,847 Trees Planted', '50K+ Happy Customers', '100% Carbon Neutral'].map((s, i) => (
                                        <div key={i} className="text-center px-4 py-2 rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                            <span className="text-emerald-300 font-semibold">{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main footer content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                            {/* Brand */}
                            <div className="lg:col-span-2">
                                <Link to="/" className="flex items-center gap-2.5 mb-5">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" /></svg>
                                    </div>
                                    <div>
                                        <span className="text-xl font-black text-white">Zymerce</span>
                                        <div className="text-[9px] text-emerald-400 font-semibold tracking-widest uppercase -mt-0.5">Eco Living</div>
                                    </div>
                                </Link>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
                                    Your premium destination for eco-friendly products. We believe sustainable living should be beautiful, accessible, and joyful.
                                </p>
                                {/* Social icons */}
                                <div className="flex gap-3">
                                    {[
                                        { icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', label: 'Facebook' },
                                        { icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z', label: 'Twitter' },
                                        { icon: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z', label: 'Instagram' },
                                    ].map(social => (
                                        <a key={social.label} href="#" aria-label={social.label}
                                            className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-0.5"
                                            style={{ background: 'rgba(255,255,255,0.08)' }}>
                                            <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={social.icon} />
                                            </svg>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Link columns */}
                            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                                <div key={section}>
                                    <h4 className="font-bold text-white text-sm mb-5 tracking-wide">{section}</h4>
                                    <ul className="space-y-3">
                                        {links.map(link => (
                                            <li key={link.label}>
                                                <Link to={link.to} className="text-gray-400 hover:text-emerald-400 transition-colors text-sm link-underline">
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Bottom bar */}
                        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-gray-500 text-sm">© 2026 Zymerce. All rights reserved. Made with 🌿 for the planet.</p>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-600 text-xs">Secure payments:</span>
                                {['Visa', 'Mastercard', 'UPI', 'PayPal'].map(m => (
                                    <span key={m} className="text-xs text-gray-400 bg-white/8 px-3 py-1 rounded-lg font-medium">{m}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;