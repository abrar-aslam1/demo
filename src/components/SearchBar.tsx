'use client'

import { Search } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  initialQuery?: string | null
  initialLocation?: string | null
}

export function SearchBar({ initialQuery = '', initialLocation = '' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery || '')
  const [location, setLocation] = useState(initialLocation || '')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() || location.trim()) {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (location) params.set('location', location)
      router.push(`/search?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-3xl mx-auto">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for vendors..."
          className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location..."
        className="w-48 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />
      <button
        type="submit"
        className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
      >
        Search
      </button>
    </form>
  )
} 