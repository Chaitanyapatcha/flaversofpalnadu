import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { supabaseClient as supabase } from '../../lib/supabase'

type Order = {
  id: string
  user_id: string
  user_email: string
  status: string
  payment_method: string
  payment_status: string
  total_amount: number
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
  tracking_number: string | null
  notes: string | null
  created_at: string | null
}

export function OrdersSection() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState<Order | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-charcoal">Orders</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage all customer orders</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { key: 'pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700' },
          { key: 'processing', label: 'Processing', color: 'bg-blue-50 text-blue-700' },
          { key: 'shipped', label: 'Shipped', color: 'bg-purple-50 text-purple-700' },
          { key: 'delivered', label: 'Delivered', color: 'bg-green-50 text-green-700' },
        ].map(stat => (
          <button
            key={stat.key}
            onClick={() => setFilter(filter === stat.key ? 'all' : stat.key)}
            className={cn(
              'p-3 rounded-xl border text-left transition-colors',
              filter === stat.key ? 'border-deep-green bg-deep-green/5' : 'border-gray-100 bg-white hover:bg-gray-50'
            )}
          >
            <p className={cn('text-2xl font-bold', stat.color.split(' ')[1])}>{statusCounts[stat.key as keyof typeof statusCounts]}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="animate-spin text-deep-green mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Customer</th>
                  <th className="text-left px-4 py-3 font-medium">Amount</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                  <th className="text-right px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{order.payment_method.toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-800">{order.shipping_name}</p>
                      <p className="text-xs text-gray-500">{order.user_email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-charcoal">Rs.{order.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                        order.status === 'pending' && 'bg-yellow-50 text-yellow-700',
                        order.status === 'processing' && 'bg-blue-50 text-blue-700',
                        order.status === 'shipped' && 'bg-purple-50 text-purple-700',
                        order.status === 'delivered' && 'bg-green-50 text-green-700',
                        order.status === 'cancelled' && 'bg-red-50 text-red-700',
                      )}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('en-IN') : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(order)} className="text-sm text-deep-green font-medium hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <OrderDetailModal order={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function OrderDetailModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    supabase.from('order_items').select('*').eq('order_id', order.id).then(({ data }) => setItems(data || []))
  }, [order.id])

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
          <h3 className="font-serif text-lg font-bold text-charcoal">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Customer</p>
              <p className="text-sm font-medium text-charcoal">{order.shipping_name}</p>
              <p className="text-sm text-gray-600">{order.user_email}</p>
              <p className="text-sm text-gray-600">{order.shipping_phone}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Shipping Address</p>
              <p className="text-sm text-gray-600">{order.shipping_address}</p>
              <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Order Items</p>
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <img src={item.product_image || 'https://placehold.co/40?text=P'} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} · {item.weight_option}</p>
                  </div>
                  <p className="text-sm font-medium text-charcoal">Rs.{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3">
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                order.status === 'pending' && 'bg-yellow-50 text-yellow-700',
                order.status === 'processing' && 'bg-blue-50 text-blue-700',
                order.status === 'shipped' && 'bg-purple-50 text-purple-700',
                order.status === 'delivered' && 'bg-green-50 text-green-700',
                order.status === 'cancelled' && 'bg-red-50 text-red-700',
              )}>
                {order.status}
              </span>
              <span className="text-xs text-gray-500">Payment: {order.payment_status}</span>
            </div>
            <p className="text-lg font-bold text-charcoal">Total: Rs.{order.total_amount}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
