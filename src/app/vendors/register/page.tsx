'use client'

import { useState, useEffect } from 'react'
import { Camera, Upload } from 'lucide-react'
import { getCategories } from '@/lib/data'
import { VendorCategory } from '@/types'

interface RegistrationFormData {
  businessName: string
  category: string
  description: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website?: string
  images: File[]
  businessHours: {
    [key: string]: { open: string; close: string }
  }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function VendorRegistrationPage() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    businessName: '',
    category: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    images: [],
    businessHours: DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { open: '09:00', close: '17:00' }
    }), {})
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<VendorCategory[]>([])

  // Changed useState to useEffect
  useEffect(() => {
    getCategories().then(setCategories)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'images') {
          (value as File[]).forEach((file) => {
            formDataToSend.append('images', file)
          })
        } else if (key === 'businessHours') {
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch('/api/vendors/register', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to register vendor')
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...Array.from(e.target.files!)]
      }))
    }
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Registration Successful!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Thank you for registering your business. We'll review your information and get back to you soon.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="btn btn-primary"
        >
          Return to Homepage
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">List Your Wedding Business</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Basic Information</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Business Name</label>
            <input
              type="text"
              value={formData.businessName}
              onChange={e => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={4}
              required
            />
          </div>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website (Optional)</label>
            <input
              type="url"
              value={formData.website}
              onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="https://"
            />
          </div>
        </section>

        {/* Location */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Location</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">ZIP Code</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={e => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Images</h2>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1">Upload Photos</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-5 h-5" />
                <span>Choose Files</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                {formData.images.length} files selected
              </span>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {Array.from(formData.images).map((file, index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Business Hours */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Business Hours</h2>
          
          <div className="space-y-2">
            {DAYS.map(day => (
              <div key={day} className="grid grid-cols-3 gap-4 items-center">
                <span className="font-medium">{day}</span>
                <input
                  type="time"
                  value={formData.businessHours[day].open}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    businessHours: {
                      ...prev.businessHours,
                      [day]: { ...prev.businessHours[day], open: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="time"
                  value={formData.businessHours[day].close}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    businessHours: {
                      ...prev.businessHours,
                      [day]: { ...prev.businessHours[day], close: e.target.value }
                    }
                  }))}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            ))}
          </div>
        </section>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Submitting...' : 'Submit Registration'}
        </button>
      </form>
    </div>
  )
} 