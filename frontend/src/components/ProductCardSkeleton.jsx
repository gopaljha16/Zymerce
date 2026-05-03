export default function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
            {/* Image */}
            <div className="aspect-square skeleton" />
            {/* Content */}
            <div className="p-4 space-y-3">
                <div className="h-2.5 skeleton rounded-full w-16" />
                <div className="space-y-2">
                    <div className="h-3.5 skeleton rounded-full w-full" />
                    <div className="h-3.5 skeleton rounded-full w-3/4" />
                </div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-3.5 h-3.5 skeleton rounded-full" />)}
                </div>
                <div className="flex items-center justify-between">
                    <div className="h-6 skeleton rounded-full w-20" />
                    <div className="h-5 skeleton rounded-full w-16" />
                </div>
            </div>
        </div>
    );
}
