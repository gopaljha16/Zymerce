import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ShoppingBagIcon, 
    ClockIcon,
    TruckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';
import { authFetch } from '../utils/auth';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

function UserDashboard() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await authFetch(`${BASEURL}/api/user/orders/`);
            const data = await response.json();
            setOrders(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <ClockIcon className="w-5 h-5 text-yellow-500" />;
            case 'processing':
                return <ShoppingBagIcon className="w-5 h-5 text-blue-500" />;
            case 'shipped':
                return <TruckIcon className="w-5 h-5 text-purple-500" />;
            case 'delivered':
                return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
            case 'cancelled':
                return <XCircleIcon className="w-5 h-5 text-red-500" />;
            default:
                return <ClockIcon className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <SEO 
                title="My Orders - Zymerce"
                description="Track and manage your orders at Zymerce."
                keywords="orders, order history, track order, Zymerce"
            />
            
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your orders</p>
                </div>

                {/* Orders List */}
                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                                {/* Order Header */}
                                <div className="bg-gray-50 px-6 py-4 border-b">
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Order ID</p>
                                                <p className="font-semibold text-gray-900">#{order.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Date</p>
                                                <p className="font-semibold text-gray-900">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="font-semibold text-primary">₹{order.total_amount}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product_image ? (
                                                        <img
                                                            src={item.product_image}
                                                            alt={item.product_name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ShoppingBagIcon className="w-8 h-8" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">₹{item.price}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Total: ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Actions */}
                                    <div className="mt-6 flex gap-3">
                                        {order.status === 'delivered' && (
                                            <button className="btn-primary">
                                                Leave a Review
                                            </button>
                                        )}
                                        {order.status === 'pending' && (
                                            <button className="btn-secondary text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                                                Cancel Order
                                            </button>
                                        )}
                                        {(order.status === 'shipped' || order.status === 'processing') && (
                                            <button className="btn-secondary">
                                                Track Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            No orders yet
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Start shopping to see your orders here!
                        </p>
                        <Link to="/" className="btn-primary">
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
