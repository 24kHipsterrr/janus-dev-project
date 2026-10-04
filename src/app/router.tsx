// © Janus — yashxsanjay
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { Suspense, lazy, type ReactNode } from 'react'
import { registry } from '@/core/registry'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FullPageSpinner } from '@/shared/ui'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import AuthCallbackPage from './pages/auth/AuthCallbackPage'

const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

export function createAppRouter() {
  const moduleRoutes = registry.getRoutes().map((route) => ({
    ...route,
    element: <Suspense fallback={<FullPageSpinner />}>{route.element as ReactNode}</Suspense>,
  }))

  return createBrowserRouter([
    // Public
    { path: '/login', element: <LoginPage /> },
    { path: '/signup', element: <SignupPage /> },
    { path: '/auth/callback', element: <AuthCallbackPage /> },

    // Protected
    {
      element: <ProtectedRoute />,
      children: [
        { path: '/', element: <Navigate to="/profile/setup" replace /> },
        ...moduleRoutes,
      ],
    },

    // Catch-all
    {
      path: '*',
      element: (
        <Suspense fallback={<FullPageSpinner />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ])
}
