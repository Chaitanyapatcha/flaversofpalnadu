import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Package, ShoppingCart, FileText, ChevronLeft, Menu, X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/admin'
import { cn } from '../lib/utils'
import { ProductsSection } from './admin/Products'
import { OrdersSection } from './admin/Orders'
import { ContentSection } from './admin/Content'

type Section = 'products' | 'orders' | 'content'

export function Admin() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [section, setSection] = useState<Section>('products')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !isAdmin(user?.email)) {
      navigate('/')
    }
  }, [user, loading, navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-deep-green" />
      </div>
    )
  }

  if (!isAdmin(user?.email)) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-deep-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FP</span>
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-charcoal">Admin</h1>
              <p className="text-[10px] text-gray-500">Flavours of Palnadu</p>
            </div>
          </div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          <SidebarItem active={section === 'products'} onClick={() => setSection('products')} icon={Package} label="Products" />
          <SidebarItem active={section === 'orders'} onClick={() => setSection('orders')} icon={ShoppingCart} label="Orders" />
          <SidebarItem active={section === 'content'} onClick={() => setSection('content')} icon={FileText} label="Site Content" />
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-deep-green transition-colors">
            <ChevronLeft size={16} /> Back to Site
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif text-lg font-bold text-charcoal">Admin</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-600">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              className="w-60 h-full bg-white shadow-lg"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-5 border-b border-gray-100">
                <h1 className="font-serif text-lg font-bold text-charcoal">Admin</h1>
              </div>
              <nav className="p-3 space-y-1">
                <SidebarItem active={section === 'products'} onClick={() => { setSection('products'); setSidebarOpen(false) }} icon={Package} label="Products" />
                <SidebarItem active={section === 'orders'} onClick={() => { setSection('orders'); setSidebarOpen(false) }} icon={ShoppingCart} label="Orders" />
                <SidebarItem active={section === 'content'} onClick={() => { setSection('content'); setSidebarOpen(false) }} icon={FileText} label="Site Content" />
              </nav>
              <div className="p-4 border-t border-gray-100">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-deep-green transition-colors">
                  <ChevronLeft size={16} /> Back to Site
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:pt-0 pt-14">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {section === 'products' && (
              <motion.div key="products" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <ProductsSection />
              </motion.div>
            )}
            {section === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <OrdersSection />
              </motion.div>
            )}
            {section === 'content' && (
              <motion.div key="content" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <ContentSection />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

function SidebarItem({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
        active ? 'bg-deep-green text-white' : 'text-gray-600 hover:bg-gray-50'
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}
