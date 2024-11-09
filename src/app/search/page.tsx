'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { VendorGrid } from '@/components/VendorGrid'
import { SearchBar } from '@/components/SearchBar'
import { Pagination } from '@/components/Pagination'
import { Vendor } from '@/types'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get('q')
  const location = searchParams.get('location')
  const page = parseInt(searchParams.get('page') || '1')
  
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchVendors() {
      if (!query && !location) return

      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (location) params.set('location', location)
        params.set('page', page.toString())

        const response = await fetch(`/api/vendors/search?${params.toString()}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Search failed')
        }

        setVendors(data.vendors)
        setTotalPages(data.totalPages)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [query, location, page])

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        {query ? `Search Results for "${query}"` : 'Search Wedding Vendors'}
      </h1>

      <div className="mb-12">
        <SearchBar initialQuery={query} initialLocation={location} />
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading vendors...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <VendorGrid 
            vendors={vendors}
            title={vendors.length > 0 ? 'Found Vendors' : undefined}
          />
          
          {vendors.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {!loading && !error && vendors.length === 0 && (query || location) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No vendors found matching your search. Try adjusting your search terms or location.
          </p>
        </div>
      )}
    </div>
  )
} 