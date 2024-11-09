export default function RegisterLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="h-10 bg-gray-200 rounded w-3/4 mb-8 animate-pulse" />
        
        <div className="space-y-6">
          {/* Basic Information Section */}
          <section className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
            
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
            
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          {/* Location Section */}
          <section className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
            
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 