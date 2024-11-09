import { Metadata } from 'next'
import { VendorGrid } from '@/components/VendorGrid'
import { SearchBar } from '@/components/SearchBar'
import { getVendorsByLocation, getLocations, getCategories } from '@/lib/data'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CityPageProps {
  params: {
    state: string
    city: string
  }
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const locations = await getLocations()
  const location = locations.find(l => 
    l.city_ascii.toLowerCase().replace(/\s+/g, '-') === params.city &&
    l.state_id.toLowerCase() === params.state.toLowerCase()
  )
  
  if (!location) return notFound()

  return {
    title: `Wedding Vendors in ${location.city}, ${location.state_name}`,
    description: `Find and book the best wedding vendors in ${location.city}, ${location.state_name}. Browse reviews, compare prices, and contact vendors directly.`,
  }
}

// Generate static paths for major cities only
export async function generateStaticParams() {
  const locations = await getLocations()
  return locations
    .filter(location => parseInt(location.population) > 100000)
    .map((location) => ({
      state: location.state_id.toLowerCase(),
      city: location.city_ascii.toLowerCase().replace(/\s+/g, '-')
    }))
}

export default async function CityPage({ params }: CityPageProps) {
  const locations = await getLocations()
  const location = locations.find(l => 
    l.city_ascii.toLowerCase().replace(/\s+/g, '-') === params.city &&
    l.state_id.toLowerCase() === params.state.toLowerCase()
  )
  
  if (!location) return notFound()

  const categories = await getCategories()
  const vendors = await getVendorsByLocation(location.city, location.state_id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        Wedding Vendors in {location.city}, {location.state_name}
      </h1>

      <div className="mb-12">
        <SearchBar />
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${params.state}/${params.city}/${category.slug}`}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-600">
                Find local {category.name.toLowerCase()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <VendorGrid 
        vendors={vendors}
        title="Featured Vendors"
      />

      <section className="prose max-w-none mt-12">
        <h2>Planning Your Wedding in {location.city}</h2>
        <p>
          Find everything you need for your wedding in {location.city}, {location.state_name}. 
          Our local vendors are experienced professionals ready to help make your special day perfect.
        </p>

        <h3>Local Wedding Information</h3>
        <ul>
          <li>Population: {parseInt(location.population).toLocaleString()}</li>
          <li>Timezone: {location.timezone}</li>
          <li>ZIP Codes: {location.zips}</li>
        </ul>
      </section>
    </div>
  )
} 