// © Janus — yashxsanjay
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/core/supabase/client'
import { getProfileByUserId } from '@/modules/profiles/api/profiles'
import { FullPageSpinner } from '@/shared/ui'

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const userId = data.session?.user.id
      if (!userId) {
        navigate('/login', { replace: true })
        return
      }
      const profile = await getProfileByUserId(userId)
      navigate(profile ? '/' : '/profile/setup', { replace: true })
    })
  }, [navigate])

  return <FullPageSpinner />
}
