import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/database'

type FAQ = Database['public']['Tables']['faqs']['Row']

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('faqs').select('*').order('sort_order', { ascending: true }).then(({ data }) => {
      if (data) setFaqs(data)
      setLoading(false)
    })
  }, [])

  const categories = [...new Set(faqs.map((f) => f.category || 'General'))]

  return (
    <div>
      <div className="bg-cream border-b border-gray-100 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Frequently Asked Questions</h1>
          <p className="text-sm text-gray-500">Find answers to common questions about our products, shipping, and policies.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-50 h-14 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <h2 className="font-semibold text-charcoal mb-3 text-sm uppercase tracking-wider">{cat}</h2>
                <div className="space-y-2">
                  {faqs.filter((f) => (f.category || 'General') === cat).map((faq) => (
                    <div key={faq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-charcoal">{faq.question}</span>
                        {openId === faq.id ? (
                          <Minus size={16} className="text-deep-green flex-shrink-0" />
                        ) : (
                          <Plus size={16} className="text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {openId === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="px-4 pb-4"
                        >
                          <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
