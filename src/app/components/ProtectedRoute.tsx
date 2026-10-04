// © Janus — yashxsanjay
import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/core/auth'
import { FullPageSpinner } from '@/shared/ui'

export function ProtectedRoute() {
  const { session, loading } = useSession()

  if (loading) return <FullPageSpinner />
  if (!session) return <Navigate to="/login" replace />
  return <Outlet />
}
