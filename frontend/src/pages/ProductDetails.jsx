import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import SEO from '../components/SEO';
import { 
    HeartIcon, 
    ShoppingCartIcon, 
    StarIcon,
    MinusIcon,
    PlusIcon,
    TruckIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

function ProductDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    
    const { product, isLoading, recentlyViewed } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);
    const { items: wishlistItems } = useSelector((state) => state.wishlist);
    
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);

    const isInWishlist = wishlistItems.some(item => item.product.id === parseInt(id));

    // Mock color variants (you can extend this in backend later)
    const colorVariants = [
        { name: 'Rose Gold', color: '#E8B4B8' },
        { name: 'Space Gray', color: '#4A4A4A' },
        { name: 'Silver', color: '#C0C0C0' },
        { name: 'Sky Blue', color: '#87CEEB' },
    ];

    useEffect(() => {
        dispatch(fetchProduct(id));
        fetchReviews();
    }, [dispatch, id]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${BASEURL}/api/products/${id}/reviews/`);
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            await dispatch(addToCart(product.id)).unwrap();
            toast.success(`Added ${quantity} item(s) to cart!`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const handleWishlistToggle = async () => {
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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to submit a review');
            return;
        }
        
        try {
            const response = await fetch(`${BASEURL}/api/reviews/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    product_id: id,
                    rating: newReview.rating,
                    comment: newReview.comment,
                }),
            });

            if (response.ok) {
                toast.success('Review submitted successfully!');
                setNewReview({ rating: 5, comment: '' });
                setShowReviewForm(false);
                fetchReviews();
                dispatch(fetchProduct(id));
            } else {
                toast.error('Failed to submit review');
            }
        } catch (error) {
            toast.error('Error submitting review');
        }
    };

    const renderStars = (rating, interactive = false, onRate = null) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => interactive && onRate && onRate(star)}
                        disabled={!interactive}
                        className={interactive ? 'cursor-pointer' : 'cursor-default'}
                    >
                        {star <= rating ? (
                            <StarSolidIcon className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <StarIcon className="w-5 h-5 text-gray-300" />
                        )}
                    </button>
                ))}
            </div>
        );
    };

    if (isLoading || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO 
                title={`${product.name} - Zymerce`}
                description={product.description || `Buy ${product.name} at the best price. ${product.category?.name} available at Zymerce.`}
                keywords={`${product.name}, ${product.category?.name}, buy online, Zymerce`}
                ogType="product"
                ogImage={product.image || undefined}
            />
            
            <div className="max-w-7xl mx-auto px-6">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
                    <Link to="/" className="hover:text-primary">Home</Link>
                    <span>/</span>
                    <Link to="/" className="hover:text-primary">{product.category?.name}</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                {/* Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden aspect-square">
                            <img
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {/* Thumbnail Gallery - Mock for now */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((_, idx) => (
                                <div key={idx} className="bg-white rounded-lg overflow-hidden aspect-square border-2 border-transparent hover:border-primary cursor-pointer transition-all">
                                    <img
                                        src={product.image || '/placeholder.png'}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                            <p className="text-gray-600">{product.description}</p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                {renderStars(Math.round(product.average_rating || 0))}
                                <span className="text-lg font-semibold">
                                    {(product.average_rating || 0).toFixed(1)}
                                </span>
                            </div>
                            <span className="text-gray-600">
                                ({product.review_count || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4">
                            <span className="text-5xl font-bold text-primary">
                                ₹{product.price}
                            </span>
                            <span className="text-gray-500 text-lg">or ₹8,333/month</span>
                        </div>

                        <p className="text-sm text-gray-600">
                            Suggested payments with 6 months special financing
                        </p>

                        {/* Color Selection */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3">Choose a Color</h3>
                            <div className="flex gap-3">
                                {colorVariants.map((variant, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(idx)}
                                        className={`w-12 h-12 rounded-full border-4 transition-all ${
                                            selectedColor === idx
                                                ? 'border-primary scale-110'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        style={{ backgroundColor: variant.color }}
                                        title={variant.name}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 font-semibold">
                                        Only {product.stock} Items Left!
                                    </span>
                                    <span className="text-gray-600">Don't miss it</span>
                                </div>
                            ) : (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border-2 border-gray-300 rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 hover:bg-gray-100 transition-colors"
                                >
                                    <MinusIcon className="w-5 h-5" />
                                </button>
                                <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="p-3 hover:bg-gray-100 transition-colors"
                                    disabled={quantity >= product.stock}
                                >
                                    <PlusIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ShoppingCartIcon className="w-6 h-6" />
                                {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                            </button>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 btn-secondary flex items-center justify-center gap-2 py-4 text-lg"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className="p-4 border-2 border-gray-300 rounded-lg hover:border-primary transition-colors"
                            >
                                {isInWishlist ? (
                                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                                ) : (
                                    <HeartIcon className="w-6 h-6" />
                                )}
                            </button>
                        </div>

                        {/* Delivery Info */}
                        <div className="space-y-3 pt-6 border-t">
                            <div className="flex items-center gap-3 text-gray-700">
                                <TruckIcon className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-semibold">Free Delivery</p>
                                    <p className="text-sm text-gray-600">Enter your Postal code for Delivery Availability</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <ShieldCheckIcon className="w-6 h-6 text-primary" />
                                <div>
                                    <p className="font-semibold">Return Delivery</p>
                                    <p className="text-sm text-gray-600">Free 30 Days Delivery Returns. Details</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">Customer Reviews</h2>
                        {user && (
                            <button
                                onClick={() => setShowReviewForm(!showReviewForm)}
                                className="btn-primary"
                            >
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <form onSubmit={handleSubmitReview} className="bg-gray-50 rounded-xl p-6 mb-8">
                            <h3 className="text-xl font-semibold mb-4">Write Your Review</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                {renderStars(newReview.rating, true, (rating) => setNewReview({ ...newReview, rating }))}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Comment</label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    rows="4"
                                    required
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <div className="flex gap-3">
                                <button type="submit" className="btn-primary">
                                    Submit Review
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b pb-6 last:border-b-0">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="font-semibold text-lg">{review.username}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>
                                    <p className="text-gray-700">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No reviews yet. Be the first to review this product!
                            </p>
                        )}
                    </div>
                </div>

                {/* Recently Viewed */}
                {recentlyViewed.length > 1 && (
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Recently Viewed</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {recentlyViewed.slice(0, 4).filter(p => p.id !== product.id).map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden"
                                >
                                    <div className="aspect-square bg-gray-100">
                                        <img
                                            src={item.image || '/placeholder.png'}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {item.name}
                                        </h3>
                                        <p className="text-xl font-bold text-primary">₹{item.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductDetails;
