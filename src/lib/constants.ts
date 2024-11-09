export const SITE_NAME = 'Wedding Vendors Directory'
export const SITE_DESCRIPTION = 'Find and connect with trusted wedding vendors in your area'
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourwebsite.com'

export const API_ENDPOINTS = {
  VENDORS: '/api/vendors',
  SEARCH: '/api/search',
  CATEGORIES: '/api/categories',
  LOCATIONS: '/api/locations',
}

export const ITEMS_PER_PAGE = 12

export const POPULATION_THRESHOLD = {
  CITY_PAGE: 10000,
  CATEGORY_PAGE: 50000,
}

export const META_DEFAULTS = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@weddingvendors',
  },
} 