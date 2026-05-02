import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';
import toast from 'react-hot-toast';

function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const cartItemCount = cartItems?.length || 0;
    const wishlistItemCount = wishlistItems?.length || 0;

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/');
        setShowUserMenu(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/?search=${searchQuery}`);
        }
    };

    return (
        <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-primary-dark text-sm">
                <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <span>📞 +1234567890</span>
                        <span>Get 50% Off On Selected Items</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Eng 🌐</span>
                        <span>Location 📍</span>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-white p-2 rounded-lg">
                            <ShoppingCartIcon className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-2xl font-bold">Shopcart</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="hover:text-secondary transition-colors font-medium">
                            Categories
                        </Link>
                        <Link to="/" className="hover:text-secondary transition-colors font-medium">
                            Deals
                        </Link>
                        <Link to="/" className="hover:text-secondary transition-colors font-medium">
                            What's New
                        </Link>
                        <Link to="/" className="hover:text-secondary transition-colors font-medium">
                            Delivery
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search Product"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 pr-10 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                            >
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                    </form>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-4">
                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 hover:text-secondary transition-colors"
                            >
                                <UserIcon className="w-6 h-6" />
                                <span className="hidden md:inline">
                                    {user ? user.username : 'Account'}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 text-gray-900">
                                    {user ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                My Orders
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 hover:bg-gray-100"
                                                onClick={() => setShowUserMenu(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Link
                            to="/wishlist"
                            className="relative hover:text-secondary transition-colors"
                        >
                            <HeartIcon className="w-6 h-6" />
                            {wishlistItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {wishlistItemCount}
                                </span>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative hover:text-secondary transition-colors"
                        >
                            <ShoppingCartIcon className="w-6 h-6" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
