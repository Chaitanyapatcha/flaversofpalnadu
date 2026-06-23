import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Heart, Minus, Plus, Check, Truck, Shield, Leaf, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { ProductCard } from '../components/ProductCard'
import { cn } from '../lib/utils'
import type { Database } from '../types/database'

type Product = Database['public']['Tables']['products']['Row']
type Review = Database['public']['Tables']['reviews']['Row']

export function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedWeight, setSelectedWeight] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description')

  const addToCart = useCartStore((s) => s.addItem)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist)
  const toggleWishlist = useWishlistStore((s) => s.toggleItem)

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return
      setLoading(true)
      const { data: productData } = await supabase.from('products').select('*').eq('slug', slug).single() as any
      if (productData) {
        setProduct(productData as any)
        setSelectedWeight((productData as any).weight_options?.[0] || '250g')
        setSelectedImage(0)
        setQuantity(1)

        // Load reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', (productData as any).id)
          .order('created_at', { ascending: false })
        if (reviewsData) setReviews(reviewsData as any)

        // Load related products
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', (productData as any).category_id)
          .neq('id', (productData as any).id)
          .limit(4)
        if (relatedData) setRelatedProducts(relatedData as any)
      }
      setLoading(false)
    }
    loadProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl h-96" />
          <div className="space-y-4">
            <div className="bg-gray-100 h-8 rounded w-3/4" />
            <div className="bg-gray-100 h-4 rounded w-1/2" />
            <div className="bg-gray-100 h-24 rounded" />
            <div className="bg-gray-100 h-10 rounded w-1/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-charcoal mb-2">Product not found</h2>
        <p className="text-sm text-gray-500 mb-4">The product you are looking for does not exist.</p>
        <Link to="/shop" className="px-4 py-2 bg-deep-green text-white rounded-lg text-sm">
          Browse Products
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : ['https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800']
  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0
  const weight = product.weight_options?.length ? product.weight_options : ['250g']
  const priceMultiplier = selectedWeight === '500g' ? 1.8 : selectedWeight === '1kg' ? 3.2 : 1
  const finalPrice = Math.round(product.price * priceMultiplier)

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: finalPrice,
      image: images[0],
      quantity,
      weightOption: selectedWeight,
      stock: product.stock || 100,
    })
  }

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-deep-green">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-deep-green">Shop</Link>
          <ChevronRight size={14} />
          <span className="text-charcoal">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="bg-gray-50 rounded-xl overflow-hidden mb-3 aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors',
                    selectedImage === i ? 'border-deep-green' : 'border-transparent hover:border-gray-200'
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">{product.name}</h1>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Heart size={18} className={isInWishlist(product.id) ? 'fill-terracotta text-terracotta' : 'text-gray-400'} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= Math.round(product.rating || 0) ? 'fill-gold text-gold' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.review_count} reviews</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-deep-green">₹{finalPrice}</span>
              {product.compare_price && product.compare_price > finalPrice && (
                <span className="text-lg text-gray-400 line-through">₹{Math.round(product.compare_price * priceMultiplier)}</span>
              )}
              {discount > 0 && (
                <span className="px-2 py-0.5 bg-gold/20 text-gold-dark text-xs font-bold rounded">
                  Save {discount}%
                </span>
              )}
            </div>

            {/* Weight selector */}
            <div className="mb-6">
              <label className="text-sm font-medium text-charcoal mb-2 block">Select Weight</label>
              <div className="flex gap-2">
                {weight.map((w) => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={cn(
                      'px-4 py-2 text-sm border rounded-lg transition-colors',
                      selectedWeight === w ? 'bg-deep-green text-white border-deep-green' : 'bg-white text-gray-600 border-gray-200 hover:border-deep-green'
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-sm font-medium text-charcoal mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 100, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus size={14} />
                </button>
                <span className="text-sm text-gray-400 ml-2">{product.stock} in stock</span>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                onClick={() => {
                  handleAddToCart()
                  navigate('/cart')
                }}
                className="flex-1 px-6 py-3 border-2 border-deep-green text-deep-green font-semibold rounded-lg hover:bg-deep-green hover:text-white transition-colors"
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck size={16} className="text-deep-green" /> Flat shipping ₹60
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield size={16} className="text-deep-green" /> Secure checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Leaf size={16} className="text-deep-green" /> No preservatives
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-6">
                {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      'pb-3 text-sm font-medium capitalize border-b-2 transition-colors',
                      activeTab === tab ? 'border-deep-green text-deep-green' : 'border-transparent text-gray-500 hover:text-charcoal'
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="py-4">
              {activeTab === 'description' && (
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              )}
              {activeTab === 'ingredients' && (
                <div className="text-sm text-gray-600">
                  {product.ingredients ? (
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients.split(',').map((ing, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full text-xs">
                          <Check size={10} className="text-deep-green" /> {ing.trim()}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p>Ingredients information coming soon.</p>
                  )}
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-gray-500">No reviews yet. Be the first to review!</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-deep-green text-white flex items-center justify-center text-xs font-bold">
                            {review.user_name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{review.user_name}</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} size={10} className={star <= review.rating ? 'fill-gold text-gold' : 'text-gray-300'} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
