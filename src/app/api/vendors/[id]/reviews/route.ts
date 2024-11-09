import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { VendorReview } from '@/types'

// In a real app, this would be a database
const reviews = new Map<string, VendorReview[]>()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const vendorReviews = reviews.get(params.id) || []
  return NextResponse.json(vendorReviews)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const review: VendorReview = await request.json()
    
    if (!reviews.has(params.id)) {
      reviews.set(params.id, [])
    }
    
    const vendorReviews = reviews.get(params.id)!
    vendorReviews.push(review)
    
    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error('Error adding review:', error)
    return NextResponse.json(
      { error: 'Failed to add review' },
      { status: 500 }
    )
  }
} 