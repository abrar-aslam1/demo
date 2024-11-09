import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find what you were looking for.
        </p>
        <Link 
          href="/"
          className="btn btn-primary"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
} 