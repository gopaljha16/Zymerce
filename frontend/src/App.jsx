import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';
import { fetchCategories } from './store/slices/productSlice';
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WishlistPage from "./pages/WishlistPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import PrivateRouter from './components/PrivateRouter';

function App() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        // Fetch categories on app load
        dispatch(fetchCategories());
        
        // Fetch user-specific data if logged in
        if (user) {
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch, user]);

    return (
        <Router>
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<ProductList />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route element={<PrivateRouter />}>
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/dashboard" element={<UserDashboard />} />
                            <Route path="/admin" element={<AdminDashboard />} />
                        </Route>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>
                
                {/* AI Chatbot - Available on all pages */}
                <AIChatbot />
                
                <footer className="py-10 text-center text-slate-400 text-sm font-medium bg-slate-900">
                    <div className="max-w-7xl mx-auto px-6">
                        <p>© 2026 Zymerce. All rights reserved.</p>
                    </div>
                </footer>
            </div>
        </Router>
    );
}

export default App;