import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, Grid3x2 as Grid3X3, LayoutList } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ProductCard } from '../components/ProductCard'
import { cn } from '../lib/utils'
import type { Database } from '../types/database'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])

  const loadProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*')

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory)
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (searchQuery.trim()) {
      query = query.ilike('name', `%${searchQuery.trim()}%`)
    }

    if (sortBy === 'price_low') query = query.order('price', { ascending: true })
    else if (sortBy === 'price_high') query = query.order('price', { ascending: false })
    else if (sortBy === 'rating') query = query.order('rating', { ascending: false })
    else if (sortBy === 'newest') query = query.order('created_at', { ascending: false })
    else query = query.order('featured', { ascending: false })

    const { data } = await query
    if (data) {
      const filtered = (data as any[]).filter(
        (p: any) => p.price >= priceRange[0] && p.price <= priceRange[1]
      )
      setProducts(filtered)
    }
    setLoading(false)
  }, [selectedCategory, searchQuery, sortBy, categories, priceRange])

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      if (data) setCategories(data)
    })
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    setSearchParams(params, { replace: true })
  }, [searchQuery, selectedCategory])

  useEffect(() => {
    const sp = new URLSearchParams(location.search)
    setSearchQuery(sp.get('search') || '')
    setSelectedCategory(sp.get('category') || '')
  }, [location.search])

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">Our Products</h1>
            <p className="text-sm text-gray-500 mt-1">{products.length} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                loadProducts()
              }}
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-48 sm:w-64 pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-deep-green/20"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors',
                showFilters ? 'bg-deep-green text-white border-deep-green' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              )}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2', viewMode === 'grid' ? 'bg-deep-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}
              >
                <Grid3X3 size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2', viewMode === 'list' ? 'bg-deep-green text-white' : 'bg-white text-gray-500 hover:bg-gray-50')}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filters</h3>
              <button onClick={() => { setSelectedCategory(''); setPriceRange([0, 2000]); setSearchQuery('') }} className="text-xs text-terracotta hover:underline">
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Category</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                      !selectedCategory ? 'bg-deep-green text-white border-deep-green' : 'bg-white text-gray-600 border-gray-200 hover:border-deep-green'
                    )}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-lg border transition-colors',
                        selectedCategory === cat.slug ? 'bg-deep-green text-white border-deep-green' : 'bg-white text-gray-600 border-gray-200 hover:border-deep-green'
                      )}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">Sort By</label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  >
                    <option value="featured">Featured</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-2 block">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="flex-1 accent-deep-green"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters */}
        {(selectedCategory || searchQuery || priceRange[1] < 2000) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-deep-green/10 text-deep-green text-xs rounded-full">
                {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('')}><X size={10} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-deep-green/10 text-deep-green text-xs rounded-full">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')}><X size={10} /></button>
              </span>
            )}
            {priceRange[1] < 2000 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-deep-green/10 text-deep-green text-xs rounded-full">
                Under ₹{priceRange[1]}
                <button onClick={() => setPriceRange([0, 2000])}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-xl animate-pulse h-72" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="font-semibold text-charcoal mb-2">No products found</h3>
            <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search query.</p>
            <button
              onClick={() => { setSelectedCategory(''); setPriceRange([0, 2000]); setSearchQuery('') }}
              className="px-4 py-2 bg-deep-green text-white text-sm rounded-lg hover:bg-deep-green-light transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
