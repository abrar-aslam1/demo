'use client'

import { Vendor } from '@/types'
import { Star, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'

interface VendorCardProps {
  vendor: Vendor
}

export function VendorCard({ vendor }: VendorCardProps) {
  return (
    <Link 
      href={`/vendor/${vendor.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      <div className="relative h-48 bg-gray-200">
        {vendor.images?.[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.images[0]}
            alt={vendor.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{vendor.name}</h3>
        
        <div className="flex items-center mb-2">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm">
            {vendor.rating.toFixed(1)} ({vendor.reviewCount} reviews)
          </span>
        </div>
        
        {vendor.address && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{vendor.address}</span>
          </div>
        )}
        
        {vendor.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-1" />
            <span>{vendor.phone}</span>
          </div>
        )}
      </div>
    </Link>
  )
} 