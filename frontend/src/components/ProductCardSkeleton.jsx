function ProductCardSkeleton() {
    return (
        <div className="product-card group animate-pulse">
            {/* Image Skeleton */}
            <div className="relative overflow-hidden bg-gray-200 aspect-square">
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
            </div>

            {/* Product Info Skeleton */}
            <div className="p-4 space-y-3">
                {/* Category */}
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>

                {/* Product Name */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>

                {/* Price */}
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
