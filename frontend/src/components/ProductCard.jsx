import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    
    const isInWishlist = wishlistItems.some(item => item.product.id === product.id);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            await dispatch(addToCart(product.id)).unwrap();
            toast.success('Added to cart!');
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }
        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product.id)).unwrap();
                toast.success('Removed from wishlist');
            } else {
                await dispatch(addToWishlist(product.id)).unwrap();
                toast.success('Added to wishlist!');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        className={`w-4 h-4 ${
                            index < Math.floor(rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card group">
            {/* Image Container */}
            <div className="relative overflow-hidden bg-gray-100 aspect-square">
                <img
                    src={product.image ? `${BASEURL}${product.image}` : '/placeholder.png'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 z-10"
                >
                    {isInWishlist ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                        <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    )}
                </button>

                {/* Stock Badge */}
                {product.stock === 0 && (
                    <div className="absolute top-3 left-3 badge-error">
                        Out of Stock
                    </div>
                )}
                {product.stock > 0 && product.stock < 10 && (
                    <div className="absolute top-3 left-3 badge-warning">
                        Only {product.stock} left!
                    </div>
                )}

                {/* Add to Cart Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.category?.name}
                </p>

                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                    {renderStars(product.average_rating || 0)}
                    <span className="text-sm text-gray-600">
                        ({product.review_count || 0})
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-primary">
                            ₹{product.price}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
