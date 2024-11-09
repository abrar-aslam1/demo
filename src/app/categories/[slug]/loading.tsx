export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-8" />
        
        <div className="mb-12">
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-48 bg-gray-200 rounded mb-4" />
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 