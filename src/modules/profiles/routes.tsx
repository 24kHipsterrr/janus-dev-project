// © Janus — yashxsanjay
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const ProfileSetupPage = lazy(() => import('./components/ProfileSetupPage'))
const ProfileEditPage = lazy(() => import('./components/ProfileEditPage'))
const ProfileViewPage = lazy(() => import('./components/ProfileViewPage'))

export const profileRoutes: RouteObject[] = [
  { path: '/profile/setup', element: <ProfileSetupPage /> },
  { path: '/profile/edit', element: <ProfileEditPage /> },
  { path: '/profile/:handle', element: <ProfileViewPage /> },
]
