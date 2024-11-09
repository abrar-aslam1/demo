import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories } from '@/lib/data'
import { Camera, Music, Utensils, Building, Calendar, 
         Flower2, Gem, Scissors, Car, Gift, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Wedding Vendor Categories - Browse by Service Type',
  description: 'Explore wedding vendors by category. Find photographers, venues, caterers, planners, and more for your special day.',
}

// Map of category slugs to icons
const categoryIcons: Record<string, any> = {
  'venue': Building,
  'catering': Utensils,
  'wedding-planner-coordinator': Calendar,
  'photographer': Camera,
  'videographer': Camera,
  'florist': Flower2,
  'entertainment': Music,
  'officiant': Heart,
  'attire': Scissors,
  'beauty': Scissors,
  'cake-baker': Utensils,
  'stationery': Gift,
  'rentals': Building,
  'transportation': Car,
  'jeweler': Gem,
  'decor': Flower2,
  'bar-services': Utensils,
  'invitations': Gift,
  'photo-booth': Camera,
  'lighting': Building,
  'insurance': Heart,
  'dance-lessons': Music,
  'hotel-blocks': Building,
  'travel': Car,
  'favors-gifts': Gift
}

export default async function CategoriesPage() {
  const categories = await getCategories()
  console.log('Available categories:', categories) // For debugging

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Wedding Vendor Categories</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] || Gift
          return (
            <div key={category.slug} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-pink-600" />
                <h2 className="text-xl font-semibold">
                  <Link 
                    href={`/categories/${category.slug}`}
                    className="hover:text-pink-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                </h2>
              </div>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              <Link 
                href={`/categories/${category.slug}`}
                className="text-pink-600 hover:text-pink-700 font-medium inline-flex items-center"
              >
                Browse {category.name}
                <span className="ml-1">→</span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
} 