// © Janus — yashxsanjay
import { useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/core/supabase/client'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return { session, user: session?.user ?? null, loading }
}

export function useUser(): User | null {
  const { user } = useSession()
  return user
}

const redirectTo = typeof window !== 'undefined'
  ? `${window.location.origin}/auth/callback`
  : '/auth/callback'

export const auth = {
  signInWithEmail: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signUpWithEmail: (email: string, password: string) =>
    supabase.auth.signUp({ email, password }),

  signInWithGitHub: () =>
    supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo } }),

  signInWithGoogle: () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } }),

  signOut: () => supabase.auth.signOut(),

  resetPassword: (email: string) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
    }),
}
