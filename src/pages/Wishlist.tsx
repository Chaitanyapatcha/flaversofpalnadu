import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useWishlistStore } from '../stores/wishlistStore'
import { ProductCard } from '../components/ProductCard'

export function Wishlist() {
  const wishlistItems = useWishlistStore((s) => s.items)
  const clearWishlist = useWishlistStore((s) => s.clearWishlist)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlistItems.length === 0) {
      setLoading(false)
      return
    }
    supabase
      .from('products')
      .select('*')
      .in('id', wishlistItems)
      .then(({ data }) => {
        if (data) setProducts(data)
        setLoading(false)
      })
  }, [wishlistItems])

  if (!loading && wishlistItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
          <Heart size={32} className="text-gray-300" />
        </div>
        <h2 className="font-serif text-xl font-bold text-charcoal mb-2">Your wishlist is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Save your favorite products to buy them later.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors">
          <ShoppingBag size={18} /> Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">{wishlistItems.length} saved items</p>
        </div>
        <button onClick={clearWishlist} className="text-sm text-terracotta hover:underline">
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <motion.div key={product.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
