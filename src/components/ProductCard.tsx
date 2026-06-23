import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { useWishlistStore } from '../stores/wishlistStore'
import { useCartStore } from '../stores/cartStore'
import type { Database } from '../types/database'

type Product = Database['public']['Tables']['products']['Row']

export function ProductCard({ product }: { product: Product }) {
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product.id))
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)
  const addToCart = useCartStore((s) => s.addItem)

  const image = product.images?.[0] || 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800'
  const weight = product.weight_options?.[0] || '250g'
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image,
      quantity: 1,
      weightOption: weight,
      stock: product.stock || 100,
    })
  }

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/shop/${product.slug}`} className="relative block overflow-hidden">
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.bestseller && (
            <span className="px-2 py-0.5 bg-terracotta text-white text-[10px] font-bold uppercase tracking-wider rounded">
              Bestseller
            </span>
          )}
          {product.featured && !product.bestseller && (
            <span className="px-2 py-0.5 bg-deep-green text-white text-[10px] font-bold uppercase tracking-wider rounded">
              Featured
            </span>
          )}
          {discount > 0 && (
            <span className="px-2 py-0.5 bg-gold text-deep-green-dark text-[10px] font-bold uppercase tracking-wider rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            toggleWishlist(product.id)
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart size={14} className={isInWishlist ? 'fill-terracotta text-terracotta' : 'text-gray-500'} />
        </button>
      </Link>

      <div className="p-4">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-medium text-charcoal text-sm leading-snug mb-1 hover:text-deep-green transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={10}
                className={star <= Math.round(product.rating || 0) ? 'fill-gold text-gold' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.review_count || 0})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-deep-green">₹{product.price}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-xs text-gray-400 line-through">₹{product.compare_price}</span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-8 h-8 rounded-full bg-deep-green text-white flex items-center justify-center hover:bg-deep-green-light transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
