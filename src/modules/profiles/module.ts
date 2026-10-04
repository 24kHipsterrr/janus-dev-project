// © Janus — yashxsanjay
import type { ModuleManifest } from '@/core/registry'
import { profileRoutes } from './routes'

export const manifest: ModuleManifest = {
  id: 'profiles',
  version: '0.1.0',
  routes: profileRoutes,
  navItems: [{ label: 'Profile', path: '/profile', icon: 'User' }],
  required: true,
  events: {
    emits: ['profile:created', 'profile:updated'],
    listens: [],
  },
}
