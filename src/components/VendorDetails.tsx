'use client'

import { Vendor } from '@/types'
import { Star, MapPin, Phone, Globe, Clock, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { Reviews } from './Reviews'

interface VendorDetailsProps {
  vendor: Vendor
}

export function VendorDetails({ vendor }: VendorDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Images Section */}
      <div className="space-y-4">
        {vendor.images?.[0] && (
          <div className="relative h-96 rounded-lg overflow-hidden">
            <Image
              src={vendor.images[0]}
              alt={vendor.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-2">
          {vendor.images?.slice(1).map((image, index) => (
            <div key={index} className="relative h-24 rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${vendor.name} gallery image ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{vendor.name}</h1>
        
        <div className="flex items-center mb-4">
          <Star className="w-5 h-5 text-yellow-400 mr-1" />
          <span className="text-lg font-semibold mr-2">
            {vendor.rating.toFixed(1)}
          </span>
          <span className="text-gray-600">
            ({vendor.reviewCount} reviews)
          </span>
        </div>

        {vendor.address && (
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{vendor.address}</span>
          </div>
        )}

        {vendor.phone && (
          <div className="flex items-center text-gray-600 mb-2">
            <Phone className="w-5 h-5 mr-2" />
            <span>{vendor.phone}</span>
          </div>
        )}

        {vendor.website && (
          <div className="flex items-center text-gray-600 mb-4">
            <Globe className="w-5 h-5 mr-2" />
            <a 
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {vendor.businessHours && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Business Hours
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(vendor.businessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="font-medium">{day}</span>
                  <span className="text-gray-600">{hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {vendor.priceRange && (
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-gray-600">{vendor.priceRange}</span>
          </div>
        )}

        <div className="prose max-w-none mt-6">
          <h2>About {vendor.name}</h2>
          <p>{vendor.description}</p>
        </div>

        {/* Add Reviews section */}
        <Reviews
          reviews={vendor.reviews || []}
          vendorId={vendor.id}
          onAddReview={(review) => {
            // In a real app, you'd update the vendor data here
            console.log('Review added:', review)
          }}
        />
      </div>
    </div>
  )
} 