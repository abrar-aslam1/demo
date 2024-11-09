import { Location, Vendor, SearchResult } from '@/types'
import { searchVendors } from './dataforseo'

export async function searchAllVendors(
  query: string,
  location: Location,
  options: {
    page?: number
    limit?: number
    category?: string
  } = {}
): Promise<SearchResult> {
  const { page = 1, limit = 20, category } = options

  try {
    // Build search query
    let searchQuery = query
    if (category) {
      searchQuery = `${category} ${query}`
    }

    const { vendors, total } = await searchVendors(searchQuery, location, {
      limit,
      offset: (page - 1) * limit
    })

    return {
      vendors,
      total,
      page,
      pageSize: limit
    }
  } catch (error) {
    console.error('Search error:', error)
    return {
      vendors: [],
      total: 0,
      page,
      pageSize: limit
    }
  }
}

export async function searchVendorsByCategory(
  category: string,
  location: Location,
  options: {
    page?: number
    limit?: number
  } = {}
): Promise<SearchResult> {
  return searchAllVendors('', location, {
    ...options,
    category
  })
} 