import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Check } from 'lucide-react'

export function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div>
      <div className="bg-cream border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">Contact Us</h1>
          <p className="text-sm text-gray-500 mt-1">We would love to hear from you. Reach out for orders, queries, or just to say hello!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
              <h2 className="font-semibold text-charcoal">Get in Touch</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-deep-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal">Address</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Sattenapalle, Palnadu District,<br />Andhra Pradesh, India - 522403
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-deep-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal">Phone</h3>
                    <a href="tel:+919876543210" className="text-sm text-gray-500 hover:text-deep-green transition-colors mt-0.5 block">
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-deep-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal">Email</h3>
                    <a href="mailto:hello@flavoursofpalnadu.com" className="text-sm text-gray-500 hover:text-deep-green transition-colors mt-0.5 block">
                      hello@flavoursofpalnadu.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-deep-green/10 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-deep-green" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal">Business Hours</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      Mon - Sat: 9:00 AM - 7:00 PM<br />Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919876543210?text=Hello%20Flavours%20of%20Palnadu!"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-[#25D366]/10 rounded-lg hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageCircle size={20} className="text-[#25D366]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#25D366]">Chat on WhatsApp</h3>
                  <p className="text-xs text-gray-500">Quick replies, order support</p>
                </div>
              </a>

              {/* Map */}
              <div className="rounded-lg overflow-hidden h-48 border border-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30573.6360601963!2d80.175!3d16.396!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0c5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2sSattenapalle%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Flavours of Palnadu Location"
                />
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-charcoal mb-6">Send us a Message</h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 rounded-xl p-8 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <Check size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-sm text-green-600">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green"
                      >
                        <option value="">Select a subject</option>
                        <option value="order">Order Inquiry</option>
                        <option value="bulk">Bulk Order</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-deep-green text-white font-semibold rounded-lg hover:bg-deep-green-light transition-colors"
                  >
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
