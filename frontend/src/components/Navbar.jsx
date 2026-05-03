import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NAV_LINKS = [
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
    { to: '/deals', label: '🔥 Deals' },
    { to: '/whats-new', label: "What's New" },
    { to: '/delivery', label: 'Delivery' },
];

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { items: cartItems } = useSelector(s => s.cart);
    const { items: wishlistItems } = useSelector(s => s.wishlist);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const cartCount = cartItems?.length || 0;
    const wishlistCount = wishlistItems?.length || 0;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setShowMobileMenu(false);
        setShowUserMenu(false);
    }, [location]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/');
        setShowUserMenu(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setShowSearch(false);
        }
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled
                ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-primary/5 py-3'
                : 'bg-white/80 backdrop-blur-xl border-b border-primary/5 py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-6">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
    
                            <div>
                                <span className="text-xl font-black text-primary tracking-tight">Zymerce</span>
                                <div className="text-[9px] text-emerald-600 font-semibold tracking-widest uppercase -mt-0.5">Eco Living</div>
                            </div>
                        </Link>

                        {/* Desktop Nav Links */}
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${isActive(link.to)
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-600 hover:text-primary hover:bg-primary/6'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xs">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search eco products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all duration-300 text-sm text-gray-700"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                    <MagnifyingGlassIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1">
                            {/* Mobile search toggle */}
                            <button onClick={() => setShowSearch(!showSearch)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-600" />
                            </button>

                            {/* Wishlist */}
                            <Link to="/wishlist" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <HeartIcon className="w-5 h-5 text-gray-600" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-scale-in">{wishlistCount}</span>
                                )}
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                                <ShoppingCartIcon className="w-5 h-5 text-gray-600" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-scale-in">{cartCount}</span>
                                )}
                            </Link>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${showUserMenu ? 'bg-primary/8' : 'hover:bg-gray-100'}`}
                                >
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }}>
                                        {user ? user.username?.[0]?.toUpperCase() : <UserIcon className="w-4 h-4" />}
                                    </div>
                                    <span className="hidden md:block text-sm font-medium text-gray-700 max-w-20 truncate">
                                        {user ? user.username : 'Account'}
                                    </span>
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div className="fixed inset-0 z-[105]" onClick={() => setShowUserMenu(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-100 py-2 z-[110] animate-scale-in">
                                            {user ? (
                                                <>
                                                    <div className="px-4 py-3 border-b border-gray-50">
                                                        <p className="font-semibold text-gray-900 text-sm">{user.username}</p>
                                                        <p className="text-xs text-gray-500">{user.email}</p>
                                                    </div>
                                                    {[
                                                        { to: '/dashboard', label: '📦 My Orders' },
                                                        { to: '/profile', label: '👤 Profile' },
                                                        { to: '/wishlist', label: '❤️ Wishlist' },
                                                    ].map(item => (
                                                        <Link key={item.to} to={item.to} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setShowUserMenu(false)}>
                                                            {item.label}
                                                        </Link>
                                                    ))}
                                                    {user.is_staff && (
                                                        <Link to="/admin" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setShowUserMenu(false)}>
                                                            ⚙️ Admin Dashboard
                                                        </Link>
                                                    )}
                                                    <div className="border-t border-gray-100 mt-1">
                                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                                            🚪 Logout
                                                        </button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/login" className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors" onClick={() => setShowUserMenu(false)}>
                                                        🔐 Login
                                                    </Link>
                                                    <Link to="/signup" className="block mx-3 my-2 px-4 py-2.5 text-sm font-semibold text-center text-white rounded-xl transition-all" style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }} onClick={() => setShowUserMenu(false)}>
                                                        ✨ Sign Up Free
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Mobile menu toggle */}
                            <button onClick={() => setShowMobileMenu(true)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors ml-1">
                                <Bars3Icon className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {showSearch && (
                        <form onSubmit={handleSearch} className="lg:hidden mt-3 animate-fade-in">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search eco-friendly products..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    autoFocus
                                    className="w-full pl-4 pr-10 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors">
                                    <MagnifyingGlassIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {showMobileMenu && (
                <>
                    <div className="mobile-menu-overlay" onClick={() => setShowMobileMenu(false)} />
                    <div className="mobile-menu-panel">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }}>
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3l14 9-14 9V3z" /></svg>
                                </div>
                                <span className="font-black text-primary text-lg">Zymerce</span>
                            </div>
                            <button onClick={() => setShowMobileMenu(false)} className="p-2 rounded-xl hover:bg-gray-100">
                                <XMarkIcon className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="p-4 space-y-1">
                            {NAV_LINKS.map(link => (
                                <Link key={link.to} to={link.to} className={`flex items-center px-4 py-3 rounded-2xl font-medium text-sm transition-all ${isActive(link.to) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'}`}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="px-4 pt-2 border-t border-gray-100 mt-2 space-y-2">
                            {!user ? (
                                <>
                                    <Link to="/login" className="block w-full text-center px-4 py-3 rounded-2xl border-2 border-primary text-primary font-semibold text-sm">Login</Link>
                                    <Link to="/signup" className="block w-full text-center px-4 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #0f5132, #10b981)' }}>Sign Up Free</Link>
                                </>
                            ) : (
                                <button onClick={handleLogout} className="block w-full text-center px-4 py-3 rounded-2xl text-red-500 border border-red-200 font-semibold text-sm">Logout</button>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
