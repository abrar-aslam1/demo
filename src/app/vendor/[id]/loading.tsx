export default function VendorLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative h-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div>
          <div className="h-10 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
          <div className="space-y-2 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded w-full mb-4 animate-pulse" />
        </div>
      </div>
    </div>
  )
} 