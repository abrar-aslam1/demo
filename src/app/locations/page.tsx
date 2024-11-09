import { Metadata } from 'next'
import Link from 'next/link'
import { getLocations } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Wedding Vendor Locations - Browse by City',
  description: 'Find wedding vendors in your area. Browse by city and state to find local wedding professionals.',
}

export default async function LocationsPage() {
  const locations = await getLocations()
  const popularLocations = locations
    .filter(location => parseInt(location.population) > 100000)
    .sort((a, b) => parseInt(b.population) - parseInt(a.population))
    .slice(0, 24)

  // Group locations by state
  const locationsByState = popularLocations.reduce((acc, location) => {
    const state = location.state_name
    if (!acc[state]) {
      acc[state] = []
    }
    acc[state].push(location)
    return acc
  }, {} as Record<string, typeof locations>)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Wedding Vendors by Location</h1>
      
      {Object.entries(locationsByState).map(([state, locations]) => (
        <section key={state} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{state}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locations.map((location) => (
              <Link
                key={`${location.state_id}-${location.city}`}
                href={`/${location.state_id.toLowerCase()}/${location.city_ascii.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2">{location.city}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Population: {parseInt(location.population).toLocaleString()}</p>
                  <p>ZIP Codes: {location.zips}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
} 