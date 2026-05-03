import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "../components/ProductCard.jsx";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";
import SEO from "../components/SEO";
import { FunnelIcon, XMarkIcon, MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";

const PRICE_RANGES = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under ₹500', value: 'under500' },
    { label: '₹500 – ₹1,000', value: '500to1000' },
    { label: '₹1,000 – ₹5,000', value: '1000to5000' },
    { label: 'Over ₹5,000', value: 'over5000' },
];

const SORT_OPTIONS = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Top Rated', value: 'rating' },
    { label: 'Name: A–Z', value: 'name' },
];

export default function ProductList() {
    const dispatch = useDispatch();
    const { products, categories, isLoading } = useSelector(s => s.products);
    const [searchParams] = useSearchParams();

    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedSections, setExpandedSections] = useState({ category: true, price: true, rating: true });
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        priceRange: 'all',
        sortBy: 'newest',
        search: searchParams.get('search') || '',
        minRating: 0,
        inStock: false,
    });

    // Force refresh on mount to get latest products
    useEffect(() => { 
        dispatch(fetchProducts(true)); // Force refresh with cache bypass
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchProducts(true)); // Force refresh
    };

    const toggleSection = (key) => setExpandedSections(p => ({ ...p, [key]: !p[key] }));

    const filteredProducts = (Array.isArray(products) ? products : [])
        .filter(p => {
            if (filters.category && p.category?.name !== filters.category) return false;
            if (filters.inStock && p.stock === 0) return false;
            if (filters.minRating && (p.average_rating || 0) < filters.minRating) return false;
            if (filters.search && !p.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
            const price = parseFloat(p.price);
            if (filters.priceRange === 'under500' && price >= 500) return false;
            if (filters.priceRange === '500to1000' && (price < 500 || price > 1000)) return false;
            if (filters.priceRange === '1000to5000' && (price < 1000 || price > 5000)) return false;
            if (filters.priceRange === 'over5000' && price <= 5000) return false;
            return true;
        })
        .sort((a, b) => {
            if (filters.sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
            if (filters.sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
            if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
            if (filters.sortBy === 'rating') return (b.average_rating || 0) - (a.average_rating || 0);
            return new Date(b.created_at) - new Date(a.created_at);
        });

    const PER_PAGE = 12;
    const totalPages = Math.ceil(filteredProducts.length / PER_PAGE);
    const currentProducts = filteredProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);
    const hasFilters = filters.category || filters.priceRange !== 'all' || filters.search || filters.minRating || filters.inStock;

    useEffect(() => { setCurrentPage(1); }, [filters]);

    const clearFilters = () => setFilters({ category: '', priceRange: 'all', sortBy: 'newest', search: '', minRating: 0, inStock: false });
    const goToPage = (p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); };

    const SidebarSection = ({ title, sectionKey, children }) => (
        <div className="filter-section last:border-0 last:mb-0 last:pb-0">
            <button onClick={() => toggleSection(sectionKey)} className="w-full flex items-center justify-between text-sm font-bold text-gray-800 mb-3 group">
                <span>{title}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expandedSections[sectionKey] ? 'rotate-180' : ''}`} />
            </button>
            {expandedSections[sectionKey] && <div className="animate-fade-in">{children}</div>}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO title="Shop All Products — Zymerce" description="Browse our complete collection of eco-friendly products." />

            {/* Page Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {filters.category ? filters.category : 'All Products'} 🌿
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">{filteredProducts.length} eco-friendly items found</p>
                        </div>

                        {/* Top bar controls */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {/* Refresh Button */}
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Refresh products"
                            >
                                <svg 
                                    className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                            
                            {/* Search */}
                            <div className="relative flex-1 min-w-[200px] sm:min-w-0">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={filters.search}
                                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none text-sm transition-all"
                                />
                            </div>

                            {/* Sort */}
                            <div className="relative">
                                <select
                                    value={filters.sortBy}
                                    onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
                                    className="appearance-none pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 outline-none cursor-pointer"
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                                <ChevronDownIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Mobile filter toggle */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200'}`}
                            >
                                <AdjustmentsHorizontalIcon className="w-4 h-4" />
                                Filters {hasFilters && '•'}
                            </button>

                            {hasFilters && (
                                <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-medium">
                                    <XMarkIcon className="w-4 h-4" /> Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* ── Sidebar ── */}
                    <aside className={`w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <FunnelIcon className="w-4 h-4 text-primary" /> Filters
                                </h2>
                                {hasFilters && <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">Clear all</button>}
                            </div>

                            {/* Category */}
                            <SidebarSection title="Category" sectionKey="category">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="radio" name="cat" value="" checked={!filters.category}
                                            onChange={() => setFilters(f => ({ ...f, category: '' }))}
                                            className="accent-primary" />
                                        <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">All Categories</span>
                                    </label>
                                    {(categories || []).map(cat => (
                                        <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center gap-2">
                                                <input type="radio" name="cat" value={cat.name} checked={filters.category === cat.name}
                                                    onChange={() => setFilters(f => ({ ...f, category: cat.name }))}
                                                    className="accent-primary" />
                                                <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{cat.name}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.product_count}</span>
                                        </label>
                                    ))}
                                </div>
                            </SidebarSection>

                            {/* Price Range */}
                            <SidebarSection title="Price Range" sectionKey="price">
                                <div className="space-y-2">
                                    {PRICE_RANGES.map(r => (
                                        <label key={r.value} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" name="price" value={r.value} checked={filters.priceRange === r.value}
                                                onChange={() => setFilters(f => ({ ...f, priceRange: r.value }))}
                                                className="accent-primary" />
                                            <span className="text-sm text-gray-600 group-hover:text-primary transition-colors">{r.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </SidebarSection>

                            {/* Rating */}
                            <SidebarSection title="Min Rating" sectionKey="rating">
                                <div className="space-y-2">
                                    {[0, 3, 4, 4.5].map(r => (
                                        <label key={r} className="flex items-center gap-2 cursor-pointer group">
                                            <input type="radio" name="rating" value={r} checked={filters.minRating === r}
                                                onChange={() => setFilters(f => ({ ...f, minRating: r }))}
                                                className="accent-primary" />
                                            <span className="text-sm text-gray-600 group-hover:text-primary">
                                                {r === 0 ? 'Any Rating' : `${r}★ & above`}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </SidebarSection>

                            {/* In Stock toggle */}
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-sm font-bold text-gray-800">In Stock Only</span>
                                <button
                                    onClick={() => setFilters(f => ({ ...f, inStock: !f.inStock }))}
                                    className={`w-11 h-6 rounded-full transition-all duration-300 relative ${filters.inStock ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${filters.inStock ? 'left-5' : 'left-0.5'}`} />
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ── Product Grid ── */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)}
                            </div>
                        ) : currentProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {currentProducts.map(p => <ProductCard key={p.id} product={p} />)}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-12">
                                        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                                            className="p-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                                        </button>
                                        {[...Array(totalPages)].map((_, i) => {
                                            const page = i + 1;
                                            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                                return (
                                                    <button key={page} onClick={() => goToPage(page)}
                                                        className={`w-10 h-10 rounded-2xl font-semibold text-sm transition-all ${currentPage === page ? 'text-white shadow-md' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}
                                                        style={currentPage === page ? { background: 'linear-gradient(135deg, #0f5132, #10b981)' } : {}}>
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="text-gray-400">…</span>;
                                            }
                                            return null;
                                        })}
                                        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                                            className="p-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                                            <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="text-7xl mb-6">🌿</div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                                <p className="text-gray-500 mb-8 max-w-sm">Try adjusting your filters or search terms to find what you're looking for.</p>
                                <button onClick={clearFilters} className="btn-primary">Clear All Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
