export interface Location {
  city: string
  city_ascii: string
  state_id: string
  state_name: string
  county_name: string
  lat: string
  lng: string
  population: string
  density: string
  timezone: string
  zips: string
}

export interface DataForSEOItem {
  place_id: string
  title: string
  rating?: {
    value: number
    votes_count: number
  }
  phone?: string
  website?: string
  address?: string
  description?: string
  photos?: string[]
  schedule?: Record<string, string>
  price_level?: string
}

export interface DataForSEOResponse {
  tasks: Array<{
    result: Array<{
      items: DataForSEOItem[]
    }>
  }>
}

export interface Vendor {
  id: string
  name: string
  category: string
  location: Location
  rating: number
  reviewCount: number
  phone?: string
  website?: string
  address?: string
  description?: string
  images?: string[]
  businessHours?: Record<string, string>
  priceRange?: string
  reviews?: VendorReview[]
}

export interface VendorReview {
  rating: number
  text: string
  author: string
  date: string
}

export interface SearchResult {
  vendors: Vendor[]
  total: number
  page: number
  pageSize: number
} 