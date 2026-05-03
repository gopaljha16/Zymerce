import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ChartBarIcon, 
    ShoppingBagIcon, 
    UserGroupIcon, 
    CurrencyDollarIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    CubeIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { authFetch } from '../utils/auth';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

function AdminDashboard() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchDashboardStats();
        
        // Auto-refresh every 30 seconds if enabled
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchDashboardStats(true); // Silent refresh
            }, 30000);
        }
        
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [user, navigate, autoRefresh]);

    const fetchDashboardStats = async (silent = false) => {
        try {
            if (!silent) setIsLoading(true);
            
            const response = await authFetch(`${BASEURL}/api/admin/dashboard/`);
            if (response.status === 403) {
                toast.error('Access denied. Admin privileges required.');
                navigate('/');
                return;
            }
            const data = await response.json();
            setStats(data);
            
            if (!silent) {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            if (!silent) {
                toast.error('Failed to load dashboard');
                setIsLoading(false);
            }
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        setIsUpdating(true);
        try {
            const response = await authFetch(`${BASEURL}/api/admin/orders/${orderId}/status/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                toast.success(`Order #${orderId} status updated to ${newStatus}!`);
                // Immediately refresh dashboard data
                await fetchDashboardStats(true);
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Failed to update order status');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error('Error updating order status');
        } finally {
            setIsUpdating(false);
        }
    };

    const COLORS = ['#0f5132', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Failed to load dashboard
                    </h2>
                    <button onClick={fetchDashboardStats} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <SEO 
                title="Admin Dashboard - Zymerce"
                description="Manage your store, orders, and analytics."
                keywords="admin, dashboard, analytics, store management, Zymerce"
            />
            
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Product Management Link */}
                        <Link
                            to="/admin/products"
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <CubeIcon className="w-5 h-5" />
                            Manage Products
                        </Link>
                        
                        {/* Auto-refresh toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoRefresh}
                                onChange={(e) => setAutoRefresh(e.target.checked)}
                                className="w-4 h-4 rounded accent-primary"
                            />
                            <span className="text-sm text-gray-600">Auto-refresh (30s)</span>
                        </label>
                        
                        {/* Manual refresh button */}
                        <button
                            onClick={() => fetchDashboardStats()}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900">₹{stats.total_revenue}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Orders</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <ChartBarIcon className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Products</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_products}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-amber-100 rounded-lg">
                                <UserGroupIcon className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">Total Customers</h3>
                        <p className="text-3xl font-bold text-gray-900">{stats.total_customers}</p>
                    </div>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Sales Chart */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Sales Overview (Last 7 Days)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.daily_sales}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="total" stroke="#0f5132" strokeWidth={2} name="Revenue" />
                                <Line type="monotone" dataKey="count" stroke="#f59e0b" strokeWidth={2} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.status_distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ status, count }) => `${status}: ${count}`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {stats.status_distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Top Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats.top_products}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="product__name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total_sold" fill="#0f5132" name="Units Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Recent Orders and Low Stock */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ClockIcon className="w-6 h-6" />
                            Recent Orders
                        </h3>
                        <div className="space-y-4">
                            {stats.recent_orders.map((order) => (
                                <div key={order.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold">Order #{order.id}</p>
                                            <p className="text-sm text-gray-600">{order.user}</p>
                                        </div>
                                        <p className="font-bold text-primary">₹{order.total_amount}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            disabled={isUpdating}
                                            className="text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Low Stock Alert */}
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
                            Low Stock Alert
                        </h3>
                        <div className="space-y-4">
                            {stats.low_stock_products.length > 0 ? (
                                stats.low_stock_products.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                                        <div>
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-gray-600">₹{product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-amber-600 font-semibold">
                                                {product.stock} left
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-8">
                                    All products are well stocked! 🎉
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
