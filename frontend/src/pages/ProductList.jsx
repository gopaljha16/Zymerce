import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard.jsx";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

function ProductList() {
    const dispatch = useDispatch();
    const { products, categories, isLoading } = useSelector((state) => state.products);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        priceRange: 'all',
        sortBy: 'newest',
        search: '',
    });

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Filter and sort products
    const filteredProducts = products
        .filter((product) => {
            // Category filter
            if (filters.category && product.category?.name !== filters.category) {
                return false;
            }

            // Price range filter
            if (filters.priceRange !== 'all') {
                const price = parseFloat(product.price);
                switch (filters.priceRange) {
                    case 'under50':
                        if (price >= 50) return false;
                        break;
                    case '50to100':
                        if (price < 50 || price > 100) return false;
                        break;
                    case '100to500':
                        if (price < 100 || price > 500) return false;
                        break;
                    case 'over500':
                        if (price <= 500) return false;
                        break;
                }
            }

            // Search filter
            if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }

            return true;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-low':
                    return parseFloat(a.price) - parseFloat(b.price);
                case 'price-high':
                    return parseFloat(b.price) - parseFloat(a.price);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return (b.average_rating || 0) - (a.average_rating || 0);
                default: // newest
                    return new Date(b.created_at) - new Date(a.created_at);
            }
        });

    const clearFilters = () => {
        setFilters({
            category: '',
            priceRange: 'all',
            sortBy: 'newest',
            search: '',
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[500px] flex items-center justify-center overflow-hidden bg-primary mx-4 mt-6 rounded-[2.5rem] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light/30 to-primary-dark/30 mix-blend-overlay z-10"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                
                <div className="relative z-20 text-center px-6 animate-fade-in">
                    <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight">
                        ZYMERCE
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Grab Upto 50% Off On Selected Headphone
                    </p>
                    <button className="btn-secondary text-lg px-10 py-4 bg-white text-primary hover:bg-secondary hover:text-white">
                        Buy Now
                    </button>
                </div>
            </div>

            {/* Filters and Products Section */}
            <div className="max-w-7xl mx-auto px-6 pt-12">
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden btn-primary flex items-center gap-2"
                        >
                            <FunnelIcon className="w-5 h-5" />
                            Filters
                        </button>

                        {/* Search */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        />

                        {/* Category Filter */}
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>

                        {/* Price Range */}
                        <select
                            value={filters.priceRange}
                            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        >
                            <option value="all">All Prices</option>
                            <option value="under50">Under $50</option>
                            <option value="50to100">$50 - $100</option>
                            <option value="100to500">$100 - $500</option>
                            <option value="over500">Over $500</option>
                        </select>

                        {/* Sort By */}
                        <select
                            value={filters.sortBy}
                            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                            <option value="rating">Highest Rated</option>
                        </select>

                        {/* Clear Filters */}
                        {(filters.category || filters.priceRange !== 'all' || filters.search) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Header */}
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-slate-900 mb-2">
                            {filters.category || 'All Products'}
                        </h2>
                        <div className="h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                    </div>
                    <p className="text-slate-500 font-medium">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'Item' : 'Items'} found
                    </p>
                </div>

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            No products found
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Try adjusting your filters or search terms
                        </p>
                        <button onClick={clearFilters} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductList;
