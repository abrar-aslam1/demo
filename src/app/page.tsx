import type { NextPage } from 'next'
import React from 'react'
import { SearchBar } from '@/components/SearchBar'
import Link from 'next/link'
import { Camera, Music, Utensils, Building, Calendar, 
         Flower2, Gem, Scissors, Car, Gift, LucideIcon } from 'lucide-react'
import { getCategories } from '@/lib/data'
import { VendorCategory } from '@/types'

interface HomePageProps {}

// Define proper type for the icons mapping
const categoryIcons: Record<string, LucideIcon> = {
  'wedding-venue': Building,
  'wedding-catering': Utensils,
  'wedding-planner': Calendar,
  'wedding-photographer': Camera,
  'wedding-videographer': Camera,
  'florist': Flower2,
  'entertainment': Music,
  'officiant': Gift,
  'wedding-attire': Scissors,
  'beauty-services': Scissors,
  'wedding-bakery': Utensils,
  'stationery-design': Gift,
  'wedding-rentals': Building,
  'transportation': Car,
  'jeweler': Gem,
  'decor-services': Flower2,
  'bar-services': Utensils,
  'invitations': Gift,
  'photo-booth': Camera,
  'lighting-services': Building,
  'wedding-insurance': Gift,
  'dance-lessons': Music,
  'hotel-blocks': Building,
  'travel-services': Car,
  'wedding-favors': Gift
}

const HomePage: NextPage<HomePageProps> = async () => {
  const allCategories = await getCategories()
  const featuredCategories = allCategories.slice(0, 6)

  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="hero-section py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Wedding Vendors
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with trusted wedding professionals in your area
            </p>
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCategories.map((category: VendorCategory) => {
            const IconComponent = categoryIcons[category.slug] || Gift
            return (
              <Link 
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="card card-hover p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <IconComponent 
                    size={24}
                    className="text-pink-600"
                  />
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
                <p className="text-gray-600">
                  Find the best {category.name.toLowerCase()} for your wedding
                </p>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-8">
          <Link 
            href="/categories"
            className="btn btn-primary"
          >
            View All Categories
          </Link>
        </div>
      </section>

      {/* Featured Vendors Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Wedding Vendors
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-600">Featured vendors will be displayed here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage