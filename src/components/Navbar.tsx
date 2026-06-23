import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Search, ShoppingCart, Menu, X, Heart, User, Phone, ChevronDown,
  LogOut, Package, Loader2, Shield
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCartStore } from '../stores/cartStore'
import { useWishlistStore } from '../stores/wishlistStore'
import { cn } from '../lib/utils'
import { isAdmin } from '../lib/admin'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, loading, signOut } = useAuth()
  const cartCount = useCartStore((s) => s.getCount())
  const wishlistCount = useWishlistStore((s) => s.items.length)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setSearchQuery('')
    setShowUserMenu(false)
  }, [location])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showUserMenu])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (!error) {
      navigate('/')
    }
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Top bar */}
      <div className="bg-deep-green-dark text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 ml-auto">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-gold-light transition-colors">
              <Phone size={12} /> +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-deep-green rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">FP</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-serif text-xl font-bold text-deep-green leading-tight">Flavours of Palnadu</h1>
                <p className="text-[10px] text-gold-dark tracking-wider uppercase">Taste of Tradition</p>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-deep-green',
                    location.pathname === link.to ? 'text-deep-green font-semibold' : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Search + Actions */}
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-48 lg:w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-deep-green/20 focus:border-deep-green transition-all"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </form>

              <Link to="/wishlist" className="hidden sm:flex relative p-2 text-gray-600 hover:text-deep-green transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-deep-green transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-deep-green text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User */}
              <div className="relative user-menu">
                {loading ? (
                  <div className="p-2">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  </div>
                ) : user ? (
                  <>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-1 p-2 text-gray-600 hover:text-deep-green transition-colors"
                    >
                      <User size={20} />
                      <ChevronDown size={14} />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {user.full_name || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link to="/track-order" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Package size={14} /> My Orders
                        </Link>
                        <Link to="/wishlist" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Heart size={14} /> Wishlist
                        </Link>
                        {isAdmin(user?.email) && (
                          <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Shield size={14} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                        >
                          <LogOut size={14} /> Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login" className="p-2 text-gray-600 hover:text-deep-green transition-colors">
                    <User size={20} />
                  </Link>
                )}
              </div>

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-gray-600">
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="flex items-center md:hidden">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-deep-green/20"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </form>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'block text-sm font-medium py-2',
                    location.pathname === link.to ? 'text-deep-green font-semibold' : 'text-gray-600'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/wishlist" className="flex items-center gap-2 text-sm text-gray-600 py-2">
                <Heart size={16} /> Wishlist ({wishlistCount})
              </Link>
              {user ? (
                <>
                  <Link to="/track-order" className="flex items-center gap-2 text-sm text-gray-600 py-2">
                    <Package size={16} /> My Orders
                  </Link>
                  {isAdmin(user?.email) && (
                    <Link to="/admin" className="flex items-center gap-2 text-sm text-deep-green font-semibold py-2">
                      <Shield size={16} /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 py-2">
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-sm text-deep-green font-semibold py-2">
                  <User size={16} /> Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
