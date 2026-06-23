import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/admin'

export function Footer() {
  const { user } = useAuth()
  return (
    <footer className="bg-deep-green text-white">
      {/* Newsletter */}
      <div className="bg-deep-green-light border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-serif text-xl font-semibold mb-1">Stay Updated</h3>
              <p className="text-white/70 text-sm">Get the latest offers, new products, and traditional recipes.</p>
            </div>
            <form className="flex w-full md:w-auto max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              />
              <button className="px-5 py-2.5 bg-gold text-deep-green-dark font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm flex items-center gap-1">
                Subscribe <ArrowRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
                <span className="text-deep-green font-serif font-bold text-sm">FP</span>
              </div>
              <span className="font-serif text-lg font-bold">Flavours of Palnadu</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Homemade pickles and traditional snacks made with family recipes and the finest ingredients from Palnadu, Andhra Pradesh.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-deep-green transition-colors text-xs font-bold">FB</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-deep-green transition-colors text-xs font-bold">IG</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold hover:text-deep-green transition-colors text-xs font-bold">YT</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><Link to="/shop" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Shop All</Link></li>
              <li><Link to="/about" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">About Us</Link></li>
              <li><Link to="/contact" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Contact</Link></li>
              <li><Link to="/faq" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">FAQ</Link></li>
              <li><Link to="/track-order" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Track Order</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Policies</h4>
            <ul className="space-y-2.5">
              <li><Link to="/shipping-policy" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Shipping Policy</Link></li>
              <li><Link to="/return-policy" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Return Policy</Link></li>
              <li><Link to="/" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Privacy Policy</Link></li>
              <li><Link to="/" className="text-white/70 text-sm hover:text-white hover:pl-1 transition-all">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <span className="text-white/70">Sattenapalle, Palnadu District,<br />Andhra Pradesh, India - 522403</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Phone size={16} className="text-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="text-white/70 hover:text-white">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail size={16} className="text-gold flex-shrink-0" />
                <a href="mailto:hello@flavoursofpalnadu.com" className="text-white/70 hover:text-white">hello@flavoursofpalnadu.com</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Clock size={16} className="text-gold flex-shrink-0" />
                <span className="text-white/70">Mon - Sat: 9AM - 7PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} Flavours of Palnadu. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {isAdmin(user?.email) && (
              <Link to="/admin" className="text-white/40 text-xs hover:text-white/70 transition-colors flex items-center gap-1">
                <Shield size={10} /> Admin
              </Link>
            )}
            <p className="text-white/50 text-xs">Handcrafted with love in Palnadu, Andhra Pradesh</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
