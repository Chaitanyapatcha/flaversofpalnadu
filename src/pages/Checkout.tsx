import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Truck, Shield, Check, ArrowLeft, Loader as Loader2, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCartStore } from '../stores/cartStore'
import { supabase } from '../lib/supabase'
import { cn } from '../lib/utils'

export function Checkout() {
  const items = useCartStore((s) => s.items)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('cod')
  const [step, setStep] = useState<'details' | 'payment'>('details')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    notes: '',
  })

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: user.full_name || prev.name,
      }))
    }
  }, [user])

  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getTotal()
  const shipping = 60
  const total = subtotal + shipping

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinue = () => {
    if (validateForm()) {
      setStep('payment')
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return
    setLoading(true)

    try {
      const userId = user?.id
      const userEmail = user?.email || formData.email

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          user_email: userEmail,
          status: 'pending',
          payment_method: paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI',
          payment_status: 'pending',
          total_amount: total,
          shipping_name: formData.name,
          shipping_phone: formData.phone,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_pincode: formData.pincode,
          notes: formData.notes,
        } as any)
        .select()
        .single() as any

      if (orderError || !orderData) throw orderError

      const orderItems = items.map((item) => ({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: item.name,
        product_image: item.image,
        price: item.price,
        quantity: item.quantity,
        weight_option: item.weightOption,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems as any)
      if (itemsError) throw itemsError

      setOrderId((orderData as any).id)
      setOrderPlaced(true)
      clearCart()
    } catch (err) {
      console.error('Order error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    navigate('/cart')
    return null
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Check size={36} className="text-green-600" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-2">Order Placed Successfully!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your order. We have received it and will process it shortly.
          </p>
          <div className="bg-cream rounded-xl p-6 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono font-medium">{orderId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/track-order')}
              className="px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Progress */}
      <div className="flex items-center gap-4 mb-8">
        <div className={cn('flex items-center gap-2 text-sm font-medium', step === 'details' ? 'text-deep-green' : 'text-gray-400')}>
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs', step === 'details' ? 'bg-deep-green text-white' : 'bg-gray-200')}>1</div>
          Details
        </div>
        <div className="flex-1 h-px bg-gray-200" />
        <div className={cn('flex items-center gap-2 text-sm font-medium', step === 'payment' ? 'text-deep-green' : 'text-gray-400')}>
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center text-xs', step === 'payment' ? 'bg-deep-green text-white' : 'bg-gray-200')}>2</div>
          Payment
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'details' ? (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <User size={18} className="text-deep-green" /> Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.name ? 'border-red-300' : 'border-gray-200')}
                    placeholder="John Doe"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.email ? 'border-red-300' : 'border-gray-200')}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.phone ? 'border-red-300' : 'border-gray-200')}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Pincode *</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.pincode ? 'border-red-300' : 'border-gray-200')}
                    placeholder="522403"
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Address *</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 resize-none', errors.address ? 'border-red-300' : 'border-gray-200')}
                    placeholder="House no, street, landmark"
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">City *</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.city ? 'border-red-300' : 'border-gray-200')}
                    placeholder="Sattenapalle"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">State *</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={cn('w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20', errors.state ? 'border-red-300' : 'border-gray-200')}
                    placeholder="Andhra Pradesh"
                  />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-gray-600 mb-1 block">Order Notes (optional)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium">₹{shipping}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span className="text-deep-green">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
              >
                Continue to Payment <ArrowLeft size={16} className="rotate-180" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <button
                onClick={() => setStep('details')}
                className="text-sm text-gray-500 hover:text-deep-green mb-4 flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to details
              </button>

              <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-deep-green" /> Select Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setPaymentMethod('cod')}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left',
                    paymentMethod === 'cod' ? 'border-deep-green bg-deep-green/5' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', paymentMethod === 'cod' ? 'bg-deep-green text-white' : 'bg-gray-100 text-gray-500')}>
                    <Truck size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Cash on Delivery</h3>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                  <div className="ml-auto">
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', paymentMethod === 'cod' ? 'border-deep-green' : 'border-gray-300')}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-deep-green" />}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod('upi')}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 border rounded-xl transition-all text-left',
                    paymentMethod === 'upi' ? 'border-deep-green bg-deep-green/5' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', paymentMethod === 'upi' ? 'bg-deep-green text-white' : 'bg-gray-100 text-gray-500')}>
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">UPI / Online Payment</h3>
                    <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm, etc.</p>
                  </div>
                  <div className="ml-auto">
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', paymentMethod === 'upi' ? 'border-deep-green' : 'border-gray-300')}>
                      {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-deep-green" />}
                    </div>
                  </div>
                </button>
              </div>

              {/* Order summary */}
              <div className="bg-cream rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.weightOption}`} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt="" className="w-8 h-8 rounded object-cover bg-gray-100" />
                        <span className="text-gray-600 line-clamp-1">{item.name} x {item.quantity}</span>
                      </div>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>₹{shipping}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-1 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-deep-green">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <Shield size={14} className="text-deep-green" /> Secure checkout. Your information is protected.
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors disabled:opacity-70"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
