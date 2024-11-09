import axios from 'axios'
import { Vendor, Location, DataForSEOResponse, DataForSEOItem } from '@/types'

export async function searchVendors(
  keyword: string,
  location: Location,
  options: { limit?: number; offset?: number } = {}
): Promise<{ vendors: Vendor[]; total: number }> {
  try {
    const response = await axios.get<{ items: DataForSEOItem[] }>('/api/vendors/search', {
      params: {
        keyword,
        location: `${location.city}, ${location.state_name}`
      }
    })

    const items = response.data.items || []
    
    const vendors: Vendor[] = items.map((item: DataForSEOItem) => ({
      id: item.place_id,
      name: item.title,
      category: keyword,
      location,
      rating: item.rating?.value || 4.5,
      reviewCount: item.rating?.votes_count || 0,
      phone: item.phone,
      website: item.website,
      address: item.address || `${location.city}, ${location.state_name}`,
      description: item.description || `Professional ${keyword.toLowerCase()} in ${location.city}`,
      images: item.photos || ['/placeholder.jpg'],
      businessHours: item.schedule || defaultBusinessHours(),
      priceRange: item.price_level || '$$'
    }))

    return {
      vendors,
      total: vendors.length
    }

  } catch (error) {
    console.error('DataForSEO API Error:', error)
    return getMockVendors(keyword, location)
  }
}

export async function getVendorDetails(
  vendorId: string,
  location: Location
): Promise<Vendor | null> {
  try {
    const response = await axios.get<{ items: DataForSEOItem[] }>(`/api/vendors/${vendorId}`)
    const item = response.data.items[0]
    
    if (!item) {
      return null
    }

    return {
      id: vendorId,
      name: item.title,
      category: 'Wedding Vendor',
      location,
      rating: item.rating?.value || 4.5,
      reviewCount: item.rating?.votes_count || 0,
      phone: item.phone,
      website: item.website,
      address: item.address || `${location.city}, ${location.state_name}`,
      description: item.description || 'A professional wedding vendor.',
      images: item.photos || ['/placeholder.jpg'],
      businessHours: item.schedule || defaultBusinessHours(),
      priceRange: item.price_level || '$$'
    }
  } catch (error) {
    console.error('Error fetching vendor details:', error)
    return null
  }
}

function defaultBusinessHours(): Record<string, string> {
  return {
    'Monday': '9:00 AM - 5:00 PM',
    'Tuesday': '9:00 AM - 5:00 PM',
    'Wednesday': '9:00 AM - 5:00 PM',
    'Thursday': '9:00 AM - 5:00 PM',
    'Friday': '9:00 AM - 5:00 PM'
  }
}

function getMockVendors(keyword: string, location: Location) {
  const mockVendors = Array.from({ length: 6 }, (_, i) => ({
    id: `mock-${i}`,
    name: `${keyword} Business ${i + 1}`,
    category: keyword,
    location,
    rating: 4.5 + (Math.random() * 0.5),
    reviewCount: Math.floor(Math.random() * 50) + 10,
    phone: '(555) 123-4567',
    website: 'https://example.com',
    address: `${location.city}, ${location.state_name}`,
    description: `Professional ${keyword.toLowerCase()} in ${location.city}`,
    images: ['/placeholder.jpg'],
    businessHours: defaultBusinessHours(),
    priceRange: '$$'
  }))

  return {
    vendors: mockVendors,
    total: mockVendors.length
  }
}