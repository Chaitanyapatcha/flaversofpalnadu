import { Link } from 'react-router-dom'
import { Hop as Home, Search } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-deep-green/10 flex items-center justify-center">
          <Search size={36} className="text-deep-green" />
        </div>
        <h1 className="font-serif text-5xl font-bold text-charcoal mb-2">404</h1>
        <h2 className="text-xl font-semibold text-charcoal mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The page you are looking for might have been moved, deleted, or does not exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Search size={18} /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
