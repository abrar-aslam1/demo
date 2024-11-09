import { Location, VendorCategory, Vendor } from '@/types'
import { readLocationsFromCsv, readCategoriesFromCsv } from './csv-utils'

let cachedLocations: Location[] | null = null
let cachedCategories: VendorCategory[] | null = null

export async function getLocations(): Promise<Location[]> {
  if (!cachedLocations) {
    cachedLocations = await readLocationsFromCsv()
  }
  return cachedLocations
}

export async function getCategories(): Promise<VendorCategory[]> {
  if (!cachedCategories) {
    cachedCategories = await readCategoriesFromCsv()
  }
  return cachedCategories.map(category => ({
    ...category,
    slug: category.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }))
}

// Mock data for development
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'Elegant Events Venue',
    category: 'Venues',
    location: {
      city: 'New York',
      city_ascii: 'New York',
      state_id: 'NY',
      state_name: 'New York',
      county_name: 'New York County',
      lat: '40.7128',
      lng: '-74.0060',
      population: '8419000',
      density: '27012',
      timezone: 'America/New_York',
      zips: '10001'
    },
    rating: 4.8,
    reviewCount: 156,
    phone: '(555) 123-4567',
    website: 'https://example.com',
    address: '123 Main St, New York, NY',
    description: 'Beautiful wedding venue with indoor and outdoor spaces.',
    images: ['/placeholder.jpg']
  },
  // Add more mock vendors as needed
]

export async function getVendorsByLocation(city: string, state: string): Promise<Vendor[]> {
  return mockVendors
}

export async function getVendorsByCategoryAndLocation(
  category: string,
  city: string,
  state: string
): Promise<Vendor[]> {
  const vendors = await getVendorsByLocation(city, state)
  return vendors.filter(vendor => 
    vendor.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === category
  )
} 