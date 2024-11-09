'use client'

import Link from 'next/link'
import { Menu } from 'lucide-react'
import { useState } from 'react'

const navigationLinks = [
  { name: 'Categories', href: '/categories' },
  { name: 'Popular Locations', href: '/locations' },
  { name: 'Search', href: '/search' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-pink-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="font-bold text-xl flex items-center space-x-2 text-pink-600"
          >
            Wedding Vendors
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link 
              href="/vendors/register" 
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
            >
              List Your Business
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-pink-600 px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/vendors/register" 
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                List Your Business
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 