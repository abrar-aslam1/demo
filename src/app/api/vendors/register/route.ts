import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// In a real app, this would be a database
const registrations = new Map()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const id = uuidv4()
    const images: string[] = []

    // Handle image uploads
    const imageFiles = formData.getAll('images')
    for (const file of imageFiles) {
      if (file instanceof Blob) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const filename = `${id}-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
        const filepath = join(process.cwd(), 'public', 'uploads', filename)
        
        await writeFile(filepath, buffer)
        images.push(`/uploads/${filename}`)
      }
    }

    // Process other form data
    const vendorData = {
      id,
      businessName: formData.get('businessName'),
      category: formData.get('category'),
      description: formData.get('description'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      website: formData.get('website'),
      images,
      businessHours: JSON.parse(formData.get('businessHours') as string),
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString()
    }

    // Store the registration
    registrations.set(id, vendorData)

    // Send confirmation email (in a real app)
    // await sendConfirmationEmail(vendorData.email, vendorData)

    return NextResponse.json({ 
      success: true, 
      message: 'Registration submitted successfully',
      id 
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process registration' 
    }, { status: 500 })
  }
} 