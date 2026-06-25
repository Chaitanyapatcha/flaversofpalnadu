import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Leaf, Shield, Truck, Star, Phone, MapPin, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import type { Database } from '../types/database'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']
type Testimonial = Database['public']['Tables']['testimonials']['Row']

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [productsRes, categoriesRes, testimonialsRes] = await Promise.all([
        supabase.from('products').select('*').eq('featured', true).limit(8),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').eq('featured', true).limit(6),
      ])
      if (productsRes.data) setFeaturedProducts(productsRes.data)
      if (categoriesRes.data) setCategories(categoriesRes.data)
      if (testimonialsRes.data) setTestimonials(testimonialsRes.data)
      setLoading(false)
    }
    loadData()
  }, [])

  const categoryImages: Record<string, string> = {
    'veg-pickles': 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800',
    'non-veg-pickles': 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800',
    'traditional-snacks': 'https://images.pexels.com/photos/6066050/pexels-photo-6066050.jpeg?auto=compress&cs=tinysrgb&w=800',
    'combo-packs': 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800',
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-deep-green overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Andhra spices"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-deep-green via-deep-green/90 to-deep-green/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-32">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold text-xs font-semibold rounded-full mb-6">
                <Leaf size={12} /> 100% Homemade & Natural
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4">
                Taste of Authentic
                <span className="text-gold"> Andhra Pradesh</span>
              </h1>
              <p className="text-white/80 text-lg sm:text-xl mb-8 leading-relaxed max-w-xl">
                Handcrafted pickles and traditional snacks from Palnadu, made with family recipes passed down through generations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-deep-green-dark font-semibold rounded-lg hover:bg-gold-light transition-colors"
                >
                  <ShoppingBag size={18} /> Shop Now
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Our Story <ArrowRight size={18} />
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-white/60 text-sm">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-gold" /> Flat shipping ₹60
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-gold" /> COD available
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-gold" /> No preservatives
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Browse Categories</h2>
            <p className="text-gray-500 text-sm">Explore our wide range of authentic Andhra products</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] bg-gray-100">
                  <img
                    src={cat.image_url || categoryImages[cat.slug] || 'https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-serif text-white font-semibold text-base sm:text-lg leading-tight">
                    {cat.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-white/80 text-xs mt-1 group-hover:text-gold transition-colors">
                    Shop now <ArrowRight size={11} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-1">Featured Products</h2>
              <p className="text-gray-500 text-sm">Our most loved and best-selling items</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-deep-green hover:text-deep-green-light transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-xl animate-pulse h-72" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="text-center mt-6 sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 px-5 py-2 border border-gray-200 rounded-lg text-sm font-medium text-deep-green hover:bg-gray-50 transition-colors"
            >
              View All Products <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-14 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Why Choose Us</h2>
            <p className="text-gray-500 text-sm">What makes Flavours of Palnadu special</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: '100% Natural', desc: 'Made with farm-fresh ingredients, no artificial preservatives or colors.' },
              { icon: Shield, title: 'Family Recipes', desc: 'Authentic recipes passed down through generations of our Palnadu family.' },
              { icon: Truck, title: 'Pan India Delivery', desc: 'Fast and reliable delivery across India with secure packaging.' },
              { icon: Star, title: '5-Star Quality', desc: 'Over 10,000 happy customers rate our products 4.8+ stars.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-deep-green/10 flex items-center justify-center">
                  <item.icon size={22} className="text-deep-green" />
                </div>
                <h3 className="font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Banner */}
      <section className="py-14 bg-deep-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4">Traditional Preparation Process</h2>
              <p className="text-white/70 mb-6 leading-relaxed">
                Every batch of our pickles and snacks follows a meticulous process that honors our heritage. From hand-picking fresh ingredients at local farms to sun-drying and grinding spices, we ensure every jar carries the authentic taste of Palnadu.
              </p>
              <div className="space-y-3">
                {['Handpicked fresh ingredients', 'Traditional sun-drying method', 'Stone-ground spices', 'Small batch production'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 rounded-full bg-gold text-deep-green-dark flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.pexels.com/photos/4110541/pexels-photo-4110541.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Pickle preparation"
                className="rounded-xl w-full h-48 object-cover"
                loading="lazy"
              />
              <img
                src="https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Spices"
                className="rounded-xl w-full h-48 object-cover mt-6"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">What Customers Say</h2>
            <p className="text-gray-500 text-sm">Real reviews from our happy customers</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-cream rounded-xl p-6 border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={star <= t.rating ? 'fill-gold text-gold' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-deep-green text-white flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <MapPin size={10} /> {t.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-14 bg-cream-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm border border-gray-100">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#25D366]/10 flex items-center justify-center">
              <Phone size={24} className="text-[#25D366]" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-3">
              Order on WhatsApp
            </h2>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              Prefer to chat? Send us a message on WhatsApp and we will help you place your order directly. Our team is ready to assist you!
            </p>
            <a
              href="https://wa.me/919876543210?text=Hello%20Flavours%20of%20Palnadu!%20I%20would%20like%20to%20place%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#128C7E] transition-colors"
            >
              <MessageCircleIcon size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function MessageCircleIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}
