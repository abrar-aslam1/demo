import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import axios from 'axios'
import { getLocations } from '@/lib/data'
import { DataForSEOResponse } from '@/types'

const auth = Buffer.from(
  `${process.env.DATAFORSEO_USERNAME}:${process.env.DATAFORSEO_PASSWORD}`
).toString('base64')

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  const locationQuery = searchParams.get('location')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  if (!query && !locationQuery) {
    return NextResponse.json({ error: 'Missing search parameters' }, { status: 400 })
  }

  try {
    const locations = await getLocations()
    const location = locations.find(l => 
      l.city_ascii.toLowerCase() === locationQuery?.toLowerCase()
    )

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const response = await axios.post<DataForSEOResponse>(
      'https://api.dataforseo.com/v3/serp/google/maps/live/advanced',
      [{
        keyword: `${query} wedding vendors in ${location.city}`,
        location_name: `${location.city}, ${location.state_name}, United States`,
        language_code: 'en',
        device: 'desktop',
        os: 'windows',
        depth: limit
      }],
      { 
        headers: { 
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json'
        } 
      }
    )

    const items = response.data.tasks?.[0]?.result?.[0]?.items ?? []
    
    return NextResponse.json({
      items,
      total: items.length,
      page,
      pageSize: limit,
      totalPages: Math.ceil(items.length / limit)
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
} 