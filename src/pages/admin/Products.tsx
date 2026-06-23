import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabaseClient as supabase } from '../../lib/supabase'

type Product = {
  id: string
  name: string
  slug: string
  description: string
  ingredients: string | null
  price: number
  compare_price: number | null
  weight_options: string[] | null
  category_id: string | null
  images: string[] | null
  featured: boolean | null
  bestseller: boolean | null
  stock: number | null
  rating: number | null
  review_count: number | null
  seo_title: string | null
  seo_description: string | null
  created_at: string | null
  category_name?: string
}

const CATEGORIES = [
  { id: 'a4f64e3c-8c6f-49b9-b6c9-0ff9e0c0e00d', name: 'Mango Pickles' },
  { id: 'b5e8c4e1-6d9e-4b3e-9d8e-0a1b2c3d4e5f', name: 'Lemon Pickles' },
  { id: 'c6d0e8c2-7f8e-5c4e-a0d9-b1c2d3e4f5a6', name: 'Gongura Pickles' },
  { id: 'd7e1f8c3-8a9e-6d4e-b1d0-c2d3e4f5a6b7', name: 'Red Chilli Pickles' },
  { id: 'e8f2a8c4-9b0e-7e4e-c2e1-d3e4f5a6b7c8', name: 'Mixed Pickles' },
  { id: 'f9a3b8c5-0c1e-8f4e-d3f2-e4f5a6b7c8d9', name: 'Snacks' },
  { id: '0a4c9e6d-1d2e-9g4e-e4g3-f5a6b7c8d9e0', name: 'Podis' },
  { id: '1b5d0e7e-2e3e-ah4e-f5h4-g6a7b8c9d0e1', name: 'Special Combos' },
]

export function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const mapped = (data || []).map(p => ({
      ...p,
      category_name: CATEGORIES.find(c => c.id === p.category_id)?.name || 'Uncategorized'
    }))
    setProducts(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('products').delete().eq('id', deleteId)
    if (!error) {
      setProducts(prev => prev.filter(p => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-charcoal">Products</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-deep-green text-white font-medium rounded-lg hover:bg-deep-green-light transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 text-sm outline-none"
          />
        </div>
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-deep-green mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Product</th>
                  <th className="text-left px-4 py-3 font-medium">Category</th>
                  <th className="text-left px-4 py-3 font-medium">Price</th>
                  <th className="text-left px-4 py-3 font-medium">Stock</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0] || 'https://placehold.co/40?text=P'} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category_name}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">Rs.{product.price}</td>
                    <td className="px-4 py-3">{product.stock ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        product.featured ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'
                      )}>
                        {product.featured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => { setEditing(product); setShowForm(true) }} className="p-1.5 text-gray-500 hover:text-deep-green transition-colors">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            product={editing}
            onClose={() => setShowForm(false)}
            onSaved={() => { setShowForm(false); fetchProducts() }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <DeleteModal
            onConfirm={handleDelete}
            onCancel={() => setDeleteId(null)}
            title="Delete Product"
            message="Are you sure you want to delete this product? This action cannot be undone."
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProductFormModal({ product, onClose, onSaved }: { product: Product | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    ingredients: product?.ingredients || '',
    price: product?.price || 0,
    compare_price: product?.compare_price || null,
    weight_options: product?.weight_options?.join(', ') || '',
    category_id: product?.category_id || '',
    images: product?.images?.join(', ') || '',
    featured: product?.featured || false,
    bestseller: product?.bestseller || false,
    stock: product?.stock || 0,
    seo_title: product?.seo_title || '',
    seo_description: product?.seo_description || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock: Number(form.stock),
      weight_options: form.weight_options.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.split(',').map(s => s.trim()).filter(Boolean),
    }
    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setSaving(false)
    onSaved()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-charcoal">{product ? 'Edit Product' : 'Add Product'}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Slug</label>
              <input required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
            <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Price</label>
              <input type="number" required value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Compare Price</label>
              <input type="number" value={form.compare_price || ''} onChange={e => setForm({ ...form, compare_price: e.target.value ? Number(e.target.value) : null })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Stock</label>
              <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Weight Options (comma separated)</label>
              <input value={form.weight_options} onChange={e => setForm({ ...form, weight_options: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" placeholder="250g, 500g, 1kg" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Image URLs (comma separated)</label>
            <input value={form.images} onChange={e => setForm({ ...form, images: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">SEO Title</label>
              <input value={form.seo_title} onChange={e => setForm({ ...form, seo_title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">SEO Description</label>
              <input value={form.seo_description} onChange={e => setForm({ ...form, seo_description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} className="rounded border-gray-300" /> Bestseller
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green-light transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function DeleteModal({ onConfirm, onCancel, title, message }: { onConfirm: () => void; onCancel: () => void; title: string; message: string }) {
  const [deleting, setDeleting] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-lg w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 size={24} className="text-red-600" />
          </div>
          <h3 className="font-serif text-lg font-bold text-charcoal mb-1">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={async () => { setDeleting(true); await onConfirm(); setDeleting(false) }}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center gap-2"
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
