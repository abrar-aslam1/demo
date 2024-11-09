import { Metadata } from 'next'
import { VendorGrid } from '@/components/VendorGrid'
import { SearchBar } from '@/components/SearchBar'
import { getVendorsByCategoryAndLocation, getLocations, getCategories } from '@/lib/data'
import { notFound } from 'next/navigation'

interface CategoryLocationPageProps {
  params: {
    state: string
    city: string
    category: string
  }
}

export async function generateMetadata({ params }: CategoryLocationPageProps): Promise<Metadata> {
  const locations = await getLocations()
  const categories = await getCategories()
  
  const location = locations.find(l => 
    l.city_ascii.toLowerCase().replace(/\s+/g, '-') === params.city &&
    l.state_id.toLowerCase() === params.state.toLowerCase()
  )
  const category = categories.find(c => c.slug === params.category)
  
  if (!location || !category) return notFound()

  return {
    title: `${category.name} in ${location.city}, ${location.state_name} - Wedding Vendor Directory`,
    description: `Find the best ${category.name.toLowerCase()} in ${location.city}, ${location.state_name}. Compare reviews, prices, and availability of local wedding professionals.`,
  }
}

// Generate static paths for major cities only
export async function generateStaticParams() {
  const locations = await getLocations()
  const categories = await getCategories()
  
  const paths = []
  
  for (const location of locations.filter(l => parseInt(l.population) > 100000)) {
    for (const category of categories) {
      paths.push({
        state: location.state_id.toLowerCase(),
        city: location.city_ascii.toLowerCase().replace(/\s+/g, '-'),
        category: category.slug
      })
    }
  }
  
  return paths
}

export default async function CategoryLocationPage({ params }: CategoryLocationPageProps) {
  const locations = await getLocations()
  const categories = await getCategories()
  
  const location = locations.find(l => 
    l.city_ascii.toLowerCase().replace(/\s+/g, '-') === params.city &&
    l.state_id.toLowerCase() === params.state.toLowerCase()
  )
  const category = categories.find(c => c.slug === params.category)
  
  if (!location || !category) return notFound()

  const vendors = await getVendorsByCategoryAndLocation(params.category, location.city, location.state_id)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">
        {category.name} in {location.city}, {location.state_name}
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Find and book the perfect {category.name.toLowerCase()} for your wedding in {location.city}.
      </p>

      <div className="mb-12">
        <SearchBar />
      </div>

      <VendorGrid 
        vendors={vendors}
        title={`${category.name} in ${location.city}`}
      />

      <section className="prose max-w-none mt-12">
        <h2>Choosing a {category.name} in {location.city}</h2>
        <p>
          When selecting a {category.name.toLowerCase()} for your wedding in {location.city}, 
          consider these important factors:
        </p>
        <ul>
          <li>Local experience and knowledge</li>
          <li>Portfolio of past weddings</li>
          <li>Reviews from local couples</li>
          <li>Pricing and packages</li>
          <li>Availability for your date</li>
        </ul>

        <h3>Questions to Ask Your {category.name}</h3>
        <ul>
          <li>How many weddings have you done in {location.city}?</li>
          <li>What's included in your standard package?</li>
          <li>Do you have backup equipment/staff?</li>
          <li>What's your cancellation policy?</li>
          <li>Can you provide references from recent weddings?</li>
        </ul>
      </section>
    </div>
  )
} 