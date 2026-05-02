import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { TrashIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function WishlistPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const dispatch = useDispatch();
    const { items, isLoading } = useSelector((state) => state.wishlist);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, user]);

    const handleRemove = async (productId) => {
        try {
            await dispatch(removeFromWishlist(productId)).unwrap();
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove from wishlist');
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await dispatch(addToCart(productId)).unwrap();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Please login to view your wishlist
                    </h2>
                    <Link to="/login" className="btn-primary">
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    My Wishlist
                    <span className="text-lg font-normal text-gray-500 ml-4">
                        ({items.length} items)
                    </span>
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">💝</div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Start adding products you love!
                        </p>
                        <Link to="/" className="btn-primary">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <Link to={`/product/${item.product.id}`}>
                                    <div className="relative aspect-square bg-gray-100">
                                        <img
                                            src={
                                                item.product.image
                                                    ? `${BASEURL}${item.product.image}`
                                                    : '/placeholder.png'
                                            }
                                            alt={item.product.name}
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </Link>

                                <div className="p-4">
                                    <Link to={`/product/${item.product.id}`}>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors">
                                            {item.product.name}
                                        </h3>
                                    </Link>

                                    <p className="text-2xl font-bold text-primary mb-4">
                                        ₹{item.product.price}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(item.product.id)}
                                            className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                                        >
                                            <ShoppingCartIcon className="w-4 h-4" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(item.product.id)}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default WishlistPage;
