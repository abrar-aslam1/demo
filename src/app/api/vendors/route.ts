import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { searchAllVendors } from '@/lib/search'
import { getLocations } from '@/lib/data'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const locationQuery = searchParams.get('location')
  const category = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  try {
    const locations = await getLocations()
    const location = locations.find(l => 
      l.city.toLowerCase() === locationQuery?.toLowerCase()
    )

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    const result = await searchAllVendors(query, location, {
      page,
      limit,
      category: category || undefined
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Vendor search error:', error)
    return NextResponse.json(
      { error: 'Failed to search vendors' },
      { status: 500 }
    )
  }
} 