import { MetadataRoute } from 'next'
import { getLocations, getCategories } from '@/lib/data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const locations = await getLocations()
  const categories = await getCategories()

  // Filter for major cities
  const majorLocations = locations.filter(l => parseInt(l.population) > 100000)

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ]

  // Add category pages
  categories.forEach((category) => {
    routes.push({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  })

  // Add location pages
  majorLocations.forEach((location) => {
    const citySlug = location.city_ascii.toLowerCase().replace(/\s+/g, '-')
    const stateSlug = location.state_id.toLowerCase()

    routes.push({
      url: `${baseUrl}/${stateSlug}/${citySlug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })

    // Add category pages for each location
    categories.forEach((category) => {
      routes.push({
        url: `${baseUrl}/${stateSlug}/${citySlug}/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })
    })
  })

  return routes
} 