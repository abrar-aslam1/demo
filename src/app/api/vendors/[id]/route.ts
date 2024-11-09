import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getVendorDetails } from '@/lib/dataforseo'
import { getLocations } from '@/lib/data'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const locations = await getLocations()
    // For now, we'll use a default location. In production, you'd want to determine this from the vendor's data
    const defaultLocation = locations[0]
    
    const vendor = await getVendorDetails(params.id, defaultLocation)
    
    if (!vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 })
    }
    
    return NextResponse.json(vendor)
  } catch (error) {
    console.error('Error fetching vendor:', error)
    return NextResponse.json({ error: 'Failed to fetch vendor' }, { status: 500 })
  }
} 