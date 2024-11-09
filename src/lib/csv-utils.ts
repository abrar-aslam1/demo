import { promises as fs } from 'fs'
import { parse } from 'csv-parse'
import path from 'path'
import { Location, VendorCategory } from '@/types'

// Define our categories with exact slugs
const CATEGORIES = [
  {
    name: 'Wedding Venue',
    slug: 'wedding-venue',
    description: 'Find the perfect wedding venue for your special day. Browse beautiful ceremony and reception spaces.'
  },
  {
    name: 'Wedding Catering',
    slug: 'wedding-catering',
    description: 'Discover exceptional wedding caterers who will create an unforgettable dining experience.'
  },
  {
    name: 'Wedding Planner',
    slug: 'wedding-planner',
    description: 'Connect with experienced wedding planners who will bring your vision to life.'
  },
  {
    name: 'Wedding Photographer',
    slug: 'wedding-photographer',
    description: 'Capture your special moments with professional wedding photographers.'
  },
  {
    name: 'Wedding Videographer',
    slug: 'wedding-videographer',
    description: 'Document your wedding day with cinematic wedding videos.'
  },
  {
    name: 'Florist',
    slug: 'florist',
    description: 'Create stunning floral arrangements for your ceremony and reception.'
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Book amazing DJs and bands for your wedding celebration.'
  },
  {
    name: 'Officiant',
    slug: 'officiant',
    description: 'Find the perfect officiant to perform your wedding ceremony.'
  },
  {
    name: 'Wedding Attire',
    slug: 'wedding-attire',
    description: 'Find your dream wedding dress and perfect tuxedo rentals.'
  },
  {
    name: 'Beauty Services',
    slug: 'beauty-services',
    description: 'Look your best with professional hair and makeup services.'
  },
  {
    name: 'Wedding Bakery',
    slug: 'wedding-bakery',
    description: 'Order your perfect wedding cake and delicious desserts.'
  },
  {
    name: 'Stationery Design',
    slug: 'stationery-design',
    description: 'Create beautiful invitations and wedding stationery.'
  },
  {
    name: 'Wedding Rentals',
    slug: 'wedding-rentals',
    description: 'Find everything you need to style your wedding.'
  },
  {
    name: 'Transportation',
    slug: 'transportation',
    description: 'Book elegant transportation for your wedding day.'
  },
  {
    name: 'Jeweler',
    slug: 'jeweler',
    description: 'Find the perfect wedding rings and jewelry.'
  },
  {
    name: 'Decor Services',
    slug: 'decor-services',
    description: 'Transform your venue with professional wedding décor.'
  },
  {
    name: 'Bar Services',
    slug: 'bar-services',
    description: 'Professional bartending and beverage services.'
  },
  {
    name: 'Invitations',
    slug: 'invitations',
    description: 'Design and order your wedding invitations and paper goods.'
  },
  {
    name: 'Photo Booth',
    slug: 'photo-booth',
    description: 'Add fun photo booth entertainment to your reception.'
  },
  {
    name: 'Lighting Services',
    slug: 'lighting-services',
    description: 'Create the perfect ambiance with professional lighting.'
  },
  {
    name: 'Wedding Insurance',
    slug: 'wedding-insurance',
    description: 'Protect your special day with wedding insurance.'
  },
  {
    name: 'Dance Lessons',
    slug: 'dance-lessons',
    description: 'Prepare for your first dance with professional lessons.'
  },
  {
    name: 'Hotel Blocks',
    slug: 'hotel-blocks',
    description: 'Arrange accommodations for your wedding guests.'
  },
  {
    name: 'Travel Services',
    slug: 'travel-services',
    description: 'Plan your honeymoon and guest travel arrangements.'
  },
  {
    name: 'Wedding Favors',
    slug: 'wedding-favors',
    description: 'Find unique wedding favors and gifts for your guests.'
  }
]

export async function readCategoriesFromCsv(): Promise<VendorCategory[]> {
  return CATEGORIES
}

export async function readLocationsFromCsv(): Promise<Location[]> {
  // Return mock locations for development
  return [
    {
      city: "New York",
      city_ascii: "New York",
      state_id: "NY",
      state_name: "New York",
      county_name: "New York County",
      lat: "40.7128",
      lng: "-74.0060",
      population: "8419000",
      density: "27012",
      timezone: "America/New_York",
      zips: "10001, 10002, 10003"
    },
    {
      city: "Los Angeles",
      city_ascii: "Los Angeles",
      state_id: "CA",
      state_name: "California",
      county_name: "Los Angeles County",
      lat: "34.0522",
      lng: "-118.2437",
      population: "3898747",
      density: "8092",
      timezone: "America/Los_Angeles",
      zips: "90001, 90002, 90003"
    }
    // Add more mock locations as needed
  ]
} 