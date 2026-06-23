import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabaseClient as supabase } from '../../lib/supabase'

type FAQ = {
  id: string
  question: string
  answer: string
  category: string | null
  sort_order: number | null
  created_at: string | null
}

type Testimonial = {
  id: string
  name: string
  location: string | null
  rating: number
  comment: string
  avatar_url: string | null
  featured: boolean | null
  created_at: string | null
}

export function ContentSection() {
  const [tab, setTab] = useState<'faqs' | 'testimonials'>('faqs')

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Site Content</h2>
        <p className="text-sm text-gray-500 mt-1">Manage FAQs and testimonials</p>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setTab('faqs')} className={cn('px-4 py-2 rounded-lg text-sm font-medium', tab === 'faqs' ? 'bg-deep-green text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
          FAQs
        </button>
        <button onClick={() => setTab('testimonials')} className={cn('px-4 py-2 rounded-lg text-sm font-medium', tab === 'testimonials' ? 'bg-deep-green text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50')}>
          Testimonials
        </button>
      </div>
      {tab === 'faqs' ? <FAQsTab /> : <TestimonialsTab />}
    </div>
  )
}

function FAQsTab() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchFaqs = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('faqs').select('*').order('sort_order', { ascending: true })
    setFaqs(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchFaqs() }, [fetchFaqs])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('faqs').delete().eq('id', deleteId)
    if (!error) {
      setFaqs(prev => prev.filter(f => f.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{faqs.length} FAQs</p>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green-light transition-colors">
          <Plus size={16} /> Add FAQ
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-deep-green mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading FAQs...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {faqs.map(faq => (
              <div key={faq.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium text-charcoal text-sm">{faq.question}</p>
                  <p className="text-sm text-gray-500 mt-1">{faq.answer}</p>
                  <p className="text-xs text-gray-400 mt-1">Category: {faq.category || 'General'} · Order: {faq.sort_order || 0}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(faq); setShowForm(true) }} className="p-1.5 text-gray-500 hover:text-deep-green transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(faq.id)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {faqs.length === 0 && (
              <div className="p-8 text-center text-gray-500">No FAQs yet.</div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>
        {showForm && (
          <FAQFormModal faq={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchFaqs() }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete FAQ" message="Are you sure you want to delete this FAQ?" />
        )}
      </AnimatePresence>
    </div>
  )
}

function FAQFormModal({ faq, onClose, onSaved }: { faq: FAQ | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    question: faq?.question || '',
    answer: faq?.answer || '',
    category: faq?.category || '',
    sort_order: faq?.sort_order ?? 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, sort_order: Number(form.sort_order) }
    if (faq) {
      await supabase.from('faqs').update(payload).eq('id', faq.id)
    } else {
      await supabase.from('faqs').insert(payload)
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
        className="bg-white rounded-xl shadow-lg w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-charcoal">{faq ? 'Edit FAQ' : 'Add FAQ'}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Question</label>
            <input required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Answer</label>
            <textarea required value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green-light transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save FAQ'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTestimonials() }, [fetchTestimonials])

  const handleDelete = async () => {
    if (!deleteId) return
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteId)
    if (!error) {
      setTestimonials(prev => prev.filter(t => t.id !== deleteId))
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{testimonials.length} testimonials</p>
        <button onClick={() => { setEditing(null); setShowForm(true) }} className="flex items-center gap-2 px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green-light transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-deep-green mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading testimonials...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {testimonials.map(t => (
              <div key={t.id} className="p-4 flex items-start justify-between gap-4 hover:bg-gray-50">
                <div className="flex items-start gap-3 flex-1">
                  <img src={t.avatar_url || 'https://placehold.co/40?text=T'} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-charcoal text-sm">{t.name}</p>
                      {t.featured && <span className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded">Featured</span>}
                    </div>
                    <p className="text-xs text-gray-500">{t.location} · {t.rating}/5</p>
                    <p className="text-sm text-gray-600 mt-1">{t.comment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditing(t); setShowForm(true) }} className="p-1.5 text-gray-500 hover:text-deep-green transition-colors">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(t.id)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="p-8 text-center text-gray-500">No testimonials yet.</div>
            )}
          </div>
        )}
      </div>
      <AnimatePresence>
        {showForm && (
          <TestimonialFormModal testimonial={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); fetchTestimonials() }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleteId && (
          <DeleteModal onConfirm={handleDelete} onCancel={() => setDeleteId(null)} title="Delete Testimonial" message="Are you sure you want to delete this testimonial?" />
        )}
      </AnimatePresence>
    </div>
  )
}

function TestimonialFormModal({ testimonial, onClose, onSaved }: { testimonial: Testimonial | null; onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    location: testimonial?.location || '',
    rating: testimonial?.rating || 5,
    comment: testimonial?.comment || '',
    avatar_url: testimonial?.avatar_url || '',
    featured: testimonial?.featured || false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, rating: Number(form.rating) }
    if (testimonial) {
      await supabase.from('testimonials').update(payload).eq('id', testimonial.id)
    } else {
      await supabase.from('testimonials').insert(payload)
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
        className="bg-white rounded-xl shadow-lg w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-charcoal">{testimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
              <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Rating (1-5)</label>
              <input type="number" min={1} max={5} required value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Avatar URL</label>
              <input value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Comment</label>
            <textarea required value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="rounded border-gray-300" /> Featured on homepage
          </label>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-deep-green text-white text-sm font-medium rounded-lg hover:bg-deep-green-light transition-colors disabled:opacity-70 flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}
              {saving ? 'Saving...' : 'Save Testimonial'}
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
