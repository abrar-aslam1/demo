import { Metadata } from 'next'
import Link from 'next/link'
import { getCategories, getLocations } from '@/lib/data'
import { VendorGrid } from '@/components/VendorGrid'
import { SearchBar } from '@/components/SearchBar'
import { notFound } from 'next/navigation'
import { searchVendors } from '@/lib/dataforseo'

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categories = await getCategories()
  const category = categories.find(c => c.slug === params.slug)
  if (!category) return notFound()

  return {
    title: `${category.name} - Wedding Vendor Directory`,
    description: category.description,
  }
}

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.slug,
  }))
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categories = await getCategories()
  const locations = await getLocations()
  const category = categories.find(c => c.slug === params.slug)
  
  if (!category) {
    return notFound()
  }

  // Get default location (New York)
  const defaultLocation = locations.find(l => 
    l.city === 'New York' && l.state_id === 'NY'
  ) || locations[0]

  console.log('Searching for vendors with:', {
    category: category.name,
    location: defaultLocation
  })

  // Generate mock vendors for testing
  const mockVendors = Array.from({ length: 6 }, (_, i) => ({
    id: `mock-${i}`,
    name: `${category.name} Business ${i + 1}`,
    category: category.name,
    location: defaultLocation,
    rating: 4.5 + (Math.random() * 0.5),
    reviewCount: Math.floor(Math.random() * 50) + 10,
    phone: '(555) 123-4567',
    website: 'https://example.com',
    address: `${defaultLocation.city}, ${defaultLocation.state_name}`,
    description: `Professional ${category.name.toLowerCase()} in ${defaultLocation.city}`,
    images: ['/placeholder.jpg'],
    businessHours: {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM'
    },
    priceRange: '$$'
  }))

  // Try to get real vendors, fallback to mock data
  let vendors = []
  try {
    const result = await searchVendors(category.name, defaultLocation, { limit: 10 })
    vendors = result.vendors
    console.log('Found vendors:', vendors.length)
  } catch (error) {
    console.error('Error fetching vendors:', error)
    vendors = mockVendors
    console.log('Using mock vendors:', vendors.length)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{category.name}</h1>
      <p className="text-lg text-gray-600 mb-8">{category.description}</p>

      <div className="mb-12">
        <SearchBar />
      </div>

      {/* Popular Locations */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Popular Locations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations
            .filter(l => parseInt(l.population) > 500000)
            .slice(0, 8)
            .map((location) => (
              <Link
                key={`${location.state_id}-${location.city}`}
                href={`/${location.state_id.toLowerCase()}/${location.city.toLowerCase().replace(/\s+/g, '-')}/${params.slug}`}
                className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <h3 className="font-semibold">{location.city}</h3>
                <p className="text-sm text-gray-600">{location.state_name}</p>
              </Link>
            ))}
        </div>
      </section>

      <VendorGrid 
        vendors={vendors}
        title={`Featured ${category.name}`}
      />

      <section className="prose max-w-none mt-12">
        <h2>Why Choose Professional {category.name}?</h2>
        <p>
          Working with professional {category.name.toLowerCase()} ensures your wedding day is perfect. 
          Our verified vendors have the experience and expertise to exceed your expectations.
        </p>

        <h3>What to Look for in {category.name}</h3>
        <ul>
          <li>Experience with weddings</li>
          <li>Portfolio of past work</li>
          <li>Reviews from other couples</li>
          <li>Clear pricing and packages</li>
          <li>Professional communication</li>
        </ul>
      </section>
    </div>
  )
} 