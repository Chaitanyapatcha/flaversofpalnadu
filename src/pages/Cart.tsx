import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Shield, Leaf } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'

export function Cart() {
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const getTotal = useCartStore((s) => s.getTotal)
  const clearCart = useCartStore((s) => s.clearCart)
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  const subtotal = getTotal()
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0
  const shipping = 60
  const total = subtotal - discount + shipping

  const handleApplyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'palnadu10') {
      setCouponApplied(true)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
            <ShoppingBag size={32} className="text-gray-300" />
          </div>
          <h2 className="font-serif text-xl font-bold text-charcoal mb-2">Your cart is empty</h2>
          <p className="text-sm text-gray-500 mb-6">Browse our delicious collection of homemade Andhra pickles and snacks.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
          >
            <ShoppingBag size={18} /> Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2 text-right">Action</div>
            </div>

            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.weightOption}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <Link
                          to={`/shop/${item.slug}`}
                          className="text-sm font-medium text-charcoal hover:text-deep-green transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">Weight: {item.weightOption}</p>
                        <p className="text-xs text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.productId, item.weightOption, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.weightOption, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-charcoal">₹{item.price * item.quantity}</span>
                    </div>

                    <div className="col-span-2 text-right">
                      <button
                        onClick={() => removeItem(item.productId, item.weightOption)}
                        className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 hover:text-terracotta hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="p-4 flex items-center justify-between border-t border-gray-100">
              <button
                onClick={clearCart}
                className="text-sm text-terracotta hover:underline"
              >
                Clear Cart
              </button>
              <Link to="/shop" className="text-sm text-deep-green hover:underline flex items-center gap-1">
                Continue Shopping <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
            <h2 className="font-semibold text-charcoal mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Discount (PALNADU10)</span>
                  <span className="font-medium text-green-600">-₹{discount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium">₹{shipping}</span>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-charcoal">Total</span>
                  <span className="font-bold text-xl text-deep-green">₹{total}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-500 mb-1 block">Coupon Code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponApplied && <p className="text-xs text-green-600 mt-1">Coupon applied! 10% off</p>}
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors mb-4"
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            {/* Trust badges */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck size={14} className="text-deep-green" /> Flat shipping ₹60
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield size={14} className="text-deep-green" /> Secure checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Leaf size={14} className="text-deep-green" /> No preservatives
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
