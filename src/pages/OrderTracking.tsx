import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Package, Truck, CircleCheck as CheckCircle, Clock, ArrowRight, Loader as Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'

export function OrderTracking() {
  const { user } = useAuth()
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<any[]>([])
  const [order, setOrder] = useState<any>(null)
  const [orderItems, setOrderItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  // Load user's orders automatically
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email)
      loadUserOrders()
    }
  }, [user])

  const loadUserOrders = async () => {
    if (!user?.email) return
    setLoading(true)
    try {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
      if (err) {
        setError('Failed to load orders.')
      } else {
        setOrders(data || [])
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSearched(true)
    setOrder(null)

    try {
      const { data: orders, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('user_email', email)
        .ilike('id', `%${orderId}%`)
        .limit(1)
      if (err || !orders || orders.length === 0) {
        setError('No order found with the given details.')
        setOrder(null)
      } else {
        setOrder(orders[0])
        const { data: items } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', (orders[0] as any).id)
        if (items) setOrderItems(items)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusSteps = [
    { status: 'pending', label: 'Order Placed', icon: Package },
    { status: 'processing', label: 'Processing', icon: Clock },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'delivered', label: 'Delivered', icon: CheckCircle },
  ]

  const getStepIndex = (status: string) => {
    const idx = statusSteps.findIndex((s) => s.status === status)
    return idx === -1 ? 0 : idx
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-2">Track Your Order</h1>
      <p className="text-sm text-gray-500 mb-8">{user?.email ? 'View your orders or track by order ID.' : 'Enter your order ID and email to track your order.'}</p>

      <form onSubmit={handleTrack} className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Order ID</label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g., abc12345"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-deep-green text-white font-medium rounded-lg hover:bg-deep-green-light transition-colors disabled:opacity-70"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-6">
          {error}
        </div>
      )}

      {/* User's orders list */}
      {orders.length > 0 && !order && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Your Orders</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between hover:border-deep-green/30 transition-colors cursor-pointer"
                onClick={() => {
                  setOrderId(o.id)
                  setOrder(o)
                  handleTrack({ preventDefault: () => {} } as any)
                }}
              >
                <div>
                  <p className="text-sm font-medium text-charcoal">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-gray-500">{formatDate(o.created_at)} · {o.total_amount} · {o.status}</p>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order detail */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="font-serif text-lg font-semibold text-charcoal">
                  Order #{order.id?.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Placed on {formatDate(order.created_at)}</p>
              </div>
              <span className={cn(
                'px-3 py-1 rounded-full text-xs font-medium',
                order.status === 'pending' && 'bg-yellow-50 text-yellow-700',
                order.status === 'processing' && 'bg-blue-50 text-blue-700',
                order.status === 'shipped' && 'bg-purple-50 text-purple-700',
                order.status === 'delivered' && 'bg-green-50 text-green-700',
                order.status === 'cancelled' && 'bg-red-50 text-red-700',
              )}>
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Status tracker */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              {statusSteps.map((step, i) => {
                const current = getStepIndex(order.status)
                const completed = i <= current
                const Icon = step.icon
                return (
                  <div key={step.status} className="flex flex-col items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      completed ? 'bg-deep-green text-white' : 'bg-gray-100 text-gray-400'
                    )}>
                      <Icon size={16} />
                    </div>
                    <span className={cn(
                      'text-xs font-medium',
                      completed ? 'text-deep-green' : 'text-gray-400'
                    )}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-deep-green transition-all duration-500 rounded-full"
                style={{ width: `${((getStepIndex(order.status) + 1) / statusSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Order items */}
          <div className="px-6 py-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-charcoal mb-3">Items Ordered</h3>
            <div className="space-y-3">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <img
                    src={item.product_image || 'https://placehold.co/50x50?text=P'}
                    alt={item.product_name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-charcoal">{item.product_name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} · {item.weight_option}</p>
                  </div>
                  <p className="text-sm font-semibold text-charcoal">Rs.{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping & Total */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-charcoal mb-1">Shipping Address</h3>
                <p className="text-sm text-gray-600">{order.shipping_name}</p>
                <p className="text-sm text-gray-600">{order.shipping_address}</p>
                <p className="text-sm text-gray-600">{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}</p>
                <p className="text-sm text-gray-600">Phone: {order.shipping_phone}</p>
              </div>
              <div className="sm:text-right">
                <h3 className="text-sm font-semibold text-charcoal mb-1">Order Summary</h3>
                <p className="text-sm text-gray-600">Payment: {order.payment_method?.toUpperCase()}</p>
                <p className="text-sm text-gray-600">Status: {order.payment_status?.toUpperCase()}</p>
                <p className="text-lg font-semibold text-deep-green mt-2">Total: Rs.{order.total_amount}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {searched && !order && !error && !loading && orders.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-50 flex items-center justify-center">
            <Search size={20} className="text-gray-400" />
          </div>
          <p className="text-sm text-gray-500">No orders found. Place your first order to get started.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-4 text-sm text-deep-green font-medium hover:underline"
          >
            Browse Products <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  )
}
