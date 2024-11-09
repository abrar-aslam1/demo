'use client'

import { VendorReview } from '@/types'
import { Star } from 'lucide-react'
import { useState } from 'react'

interface ReviewsProps {
  reviews: VendorReview[]
  vendorId: string
  onAddReview?: (review: VendorReview) => void
}

export function Reviews({ reviews, vendorId, onAddReview }: ReviewsProps) {
  const [showAddReview, setShowAddReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [text, setText] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const review: VendorReview = {
      rating,
      text,
      author: 'Anonymous User', // Replace with actual user name when auth is implemented
      date: new Date().toISOString()
    }

    try {
      const response = await fetch(`/api/vendors/${vendorId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review)
      })

      if (!response.ok) throw new Error('Failed to submit review')

      onAddReview?.(review)
      setShowAddReview(false)
      setRating(5)
      setText('')
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reviews</h2>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
          className="btn btn-primary"
        >
          Write a Review
        </button>
      </div>

      {showAddReview && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      value <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={4}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Review
          </button>
        </form>
      )}

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{review.author}</span>
            </div>
            <p className="text-gray-700 mb-2">{review.text}</p>
            <time className="text-sm text-gray-500">
              {new Date(review.date).toLocaleDateString()}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
} 