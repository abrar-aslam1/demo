import React from 'react'
import { Vendor } from '@/types'
import { VendorCard } from './VendorCard'

interface VendorGridProps {
  vendors: Vendor[]
  title?: string
}

export function VendorGrid({ vendors = [], title }: VendorGridProps) {
  return (
    <section className="py-8">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      
      {vendors.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No vendors found. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </section>
  )
} 