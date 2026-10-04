// © Janus — yashxsanjay
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'

// Register modules before router is created
import { registry } from '@/core/registry'
import { manifest as profilesManifest } from '@/modules/profiles/module'
registry.register(profilesManifest)

import App from './App'
import '@/styles/globals.css'

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY as string, {
    api_host: (import.meta.env.VITE_POSTHOG_HOST as string) ?? 'https://app.posthog.com',
    persistence: 'memory',
    capture_pageview: false,
  })
}

const root = document.getElementById('root')
if (!root) throw new Error('[janus] Root element #root not found.')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
