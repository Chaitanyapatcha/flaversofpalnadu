import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function callEdgeFunction(functionName: string, payload: Record<string, unknown>) {
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      console.error(`Edge function ${functionName} error:`, await response.text())
    }
  } catch (err) {
    console.error(`Edge function ${functionName} failed:`, err)
  }
}

export type User = {
  id: string
  email: string | null
  full_name: string | null
} | null

interface AuthContextType {
  user: User
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => ({ error: null }),
})

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    const { data } = await supabase.auth.getUser()
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email ?? null,
        full_name: (data.user.user_metadata?.full_name as string) || null,
      })
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    fetchUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email ?? null,
          full_name: (session.user.user_metadata?.full_name as string) || null,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [fetchUser])

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut()
      return { error: 'Please verify your email address to access your account.' }
    }
    await fetchUser()
    if (data.user) {
      callEdgeFunction('auth-on-signin', {
        user: {
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
      })
    }
    return { error: null }
  }, [fetchUser])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) return { error: error.message }
    if (data.session) {
      await supabase.auth.signOut()
    }
    if (data.user) {
      callEdgeFunction('auth-on-signup', {
        user: {
          email: data.user.email,
          user_metadata: data.user.user_metadata,
        },
      })
    }
    return { error: null }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    setUser(null)
    return { error: null }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
