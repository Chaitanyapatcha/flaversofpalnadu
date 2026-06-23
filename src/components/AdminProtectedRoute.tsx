import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { isAdmin } from '../lib/admin'
import { Loader2 } from 'lucide-react'

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-deep-green" />
      </div>
    )
  }

  if (!isAdmin(user?.email)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
