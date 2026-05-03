import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline';
import { authFetch } from '../utils/auth';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';

function ProductManagement() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newProductId, setNewProductId] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        if (!user || !user.is_staff) {
            toast.error('Access denied. Admin privileges required.');
            navigate('/');
            return;
        }
        fetchProducts();
        fetchCategories();
    }, [user, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await authFetch(`${BASEURL}/api/products/`);
            const data = await response.json();
            // Sort by ID descending (newest first)
            const sortedProducts = (data.results || data).sort((a, b) => b.id - a.id);
            setProducts(sortedProducts);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await authFetch(`${BASEURL}/api/categories/`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: categories[0]?.id || '',
            stock: '',
            image: null
        });
        setImagePreview(null);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category?.id || '',
            stock: product.stock,
            image: null
        });
        setImagePreview(product.image ? `${BASEURL}${product.image}` : null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category: '',
            stock: '',
            image: null
        });
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('stock', formData.stock);
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            const url = editingProduct 
                ? `${BASEURL}/api/admin/products/${editingProduct.id}/`
                : `${BASEURL}/api/admin/products/`;
            
            const method = editingProduct ? 'PUT' : 'POST';

            // Use fetch directly for FormData to avoid Content-Type header issues
            const token = localStorage.getItem('access_token');
            const response = await fetch(url, {
                method: method,
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Don't set Content-Type - browser will set it with boundary for FormData
                }
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
                
                // Set the new product ID for highlighting
                if (!editingProduct && data.id) {
                    setNewProductId(data.id);
                    // Remove highlight after 3 seconds
                    setTimeout(() => setNewProductId(null), 3000);
                }
                
                closeModal();
                fetchProducts();
            } else {
                // Try to parse error response
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    toast.error(errorData.error || errorData.detail || 'Failed to save product');
                } else {
                    const errorText = await response.text();
                    console.error('Server error:', errorText);
                    toast.error('Server error. Please check console for details.');
                }
            }
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error('Error saving product: ' + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) {
            return;
        }

        try {
            const response = await authFetch(`${BASEURL}/api/admin/products/${productId}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Product deleted successfully!');
                fetchProducts();
            } else {
                toast.error('Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Error deleting product');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-20">
            <SEO 
                title="Product Management - Zymerce Admin"
                description="Manage products, add new items, and update inventory."
                keywords="admin, products, inventory, management"
            />
            
            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Management</h1>
                        <p className="text-gray-600">
                            Add, edit, and manage your eco-friendly products
                            <span className="ml-2 text-sm font-semibold text-primary">
                                ({products.length} total products)
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-lg hover:shadow-xl"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add New Product
                    </button>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {currentProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
                                newProductId === product.id ? 'ring-4 ring-emerald-400 animate-pulse' : ''
                            }`}
                        >
                            <div className="relative h-48 bg-gray-100">
                                {newProductId === product.id && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce">
                                            NEW ✨
                                        </span>
                                    </div>
                                )}
                                {product.image ? (
                                    <img
                                        src={product.image.startsWith('http') ? product.image : `${BASEURL}${product.image}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <PhotoIcon className="w-16 h-16 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-lg font-bold text-primary">₹{product.price}</span>
                                    <span className="text-sm text-gray-600">Stock: {product.stock}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(product)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {products.length > productsPerPage && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Previous
                        </button>
                        
                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first page, last page, current page, and pages around current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => paginate(pageNumber)}
                                            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                                                currentPage === pageNumber
                                                    ? 'bg-primary text-white shadow-lg'
                                                    : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                ) {
                                    return <span key={pageNumber} className="px-2 text-gray-400">...</span>;
                                }
                                return null;
                            })}
                        </div>
                        
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                        <p className="text-gray-600 mb-6">Start by adding your first eco-friendly product!</p>
                        <button
                            onClick={openAddModal}
                            className="btn-primary"
                        >
                            Add Your First Product
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal - Redesigned */}
            {showModal && (
                <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[200] p-4">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-scale-in">
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                        {editingProduct ? (
                                            <>
                                                <span className="text-2xl">✏️</span>
                                                Edit Product
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-2xl">🌿</span>
                                                Add New Product
                                            </>
                                        )}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {editingProduct ? 'Update your product information' : 'Fill in the details to create a new eco-friendly product'}
                                    </p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    type="button"
                                    className="p-3 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 duration-300 flex-shrink-0"
                                    title="Close"
                                >
                                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Form Content - Scrollable */}
                        <div className="overflow-y-auto max-h-[calc(95vh-180px)] px-8 py-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Product Name - First Field */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-2">
                                            <span>📦</span>
                                            Product Name
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-base"
                                        placeholder="e.g., Bamboo Toothbrush Set"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-2">
                                            <span>📝</span>
                                            Description
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows="4"
                                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 resize-none text-base"
                                        placeholder="Describe your eco-friendly product, its benefits, and sustainable features..."
                                    />
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                        <span>💡</span>
                                        Tip: Highlight eco-friendly materials and sustainability benefits
                                    </p>
                                </div>

                                {/* Price and Stock - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            <span className="flex items-center gap-2">
                                                <span>💰</span>
                                                Price (₹)
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold text-lg">₹</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 text-base"
                                                placeholder="999.00"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-bold text-gray-800 mb-2">
                                            <span className="flex items-center gap-2">
                                                <span>📊</span>
                                                Stock Quantity
                                                <span className="text-red-500">*</span>
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 text-base"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-2">
                                            <span>🏷️</span>
                                            Category
                                            <span className="text-red-500">*</span>
                                        </span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 bg-white cursor-pointer text-base"
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">
                                        <span className="flex items-center gap-2">
                                            <span>🖼️</span>
                                            Product Image
                                            <span className="text-gray-500 text-xs font-normal ml-1">(Optional)</span>
                                        </span>
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-emerald-400 transition-all bg-gray-50">
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-full h-72 object-cover rounded-xl"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImagePreview(null);
                                                        setFormData(prev => ({ ...prev, image: null }));
                                                    }}
                                                    className="absolute top-3 right-3 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                >
                                                    <XMarkIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="flex flex-col items-center cursor-pointer">
                                                <div className="w-24 h-24 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                                                    <PhotoIcon className="w-12 h-12 text-emerald-600" />
                                                </div>
                                                <span className="text-base font-semibold text-gray-700 mb-1">Click to upload product image</span>
                                                <span className="text-sm text-gray-500">PNG, JPG, WEBP (Max 10MB)</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer with Buttons */}
                        <div className="px-8 py-5 border-t border-gray-200 bg-gray-50">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-white transition-all font-bold text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3.5 text-white rounded-xl transition-all font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                                    style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            {editingProduct ? (
                                                <>
                                                    <span>✅</span>
                                                    Update Product
                                                </>
                                            ) : (
                                                <>
                                                    <span>🌿</span>
                                                    Add Product
                                                </>
                                            )}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManagement;
