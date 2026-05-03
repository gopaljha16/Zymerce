import { memo } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, ShoppingCartIcon, StarIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
    const dispatch = useDispatch();
    const { user } = useSelector(s => s.auth);
    const { items: wishlistItems } = useSelector(s => s.wishlist);
    const isInWishlist = wishlistItems.some(item => item.product.id === product.id);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user) { toast.error('Please login to add items to cart'); return; }
        try {
            await dispatch(addToCart(product.id)).unwrap();
            toast.success('Added to cart! 🛒');
        } catch { toast.error('Failed to add to cart'); }
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        if (!user) { toast.error('Please login to save items'); return; }
        try {
            if (isInWishlist) {
                await dispatch(removeFromWishlist(product.id)).unwrap();
                toast.success('Removed from wishlist');
            } else {
                await dispatch(addToWishlist(product.id)).unwrap();
                toast.success('Saved to wishlist! ❤️');
            }
        } catch { toast.error('Failed to update wishlist'); }
    };

    const rating = product.average_rating || 0;
    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 5;

    return (
        <Link to={`/product/${product.id}`} className="product-card group block">
            {/* Image */}
            <div className="relative overflow-hidden bg-gray-50 aspect-square">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop'}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {isOutOfStock && <span className="badge-error">Out of Stock</span>}
                    {isLowStock && <span className="badge-warning">Only {product.stock} left!</span>}
                    {!isOutOfStock && !isLowStock && product.category?.name && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-primary">
                            🌿 Eco
                        </span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg z-10"
                >
                    {isInWishlist
                        ? <HeartSolidIcon className="w-4 h-4 text-red-500" />
                        : <HeartIcon className="w-4 h-4 text-gray-500 hover:text-red-400" />
                    }
                </button>

                {/* Quick view + Add to Cart — slide up on hover */}
                <div className="absolute inset-x-3 bottom-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 btn-ripple flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-sm font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{ background: isOutOfStock ? '#9ca3af' : 'linear-gradient(135deg, #0f5132, #10b981)' }}
                    >
                        <ShoppingCartIcon className="w-4 h-4" />
                        {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        onClick={e => e.stopPropagation()}
                        className="w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Info */}
            <div className="p-4">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
                    {product.category?.name || 'Eco Product'}
                </p>
                <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.review_count || 0})</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-primary">₹{product.price}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">🌱 +1 tree</span>
                </div>
            </div>
        </Link>
    );
}

export default memo(ProductCard);
