// © Janus — yashxsanjay
import type { RouteObject } from 'react-router-dom'
import { isEnabled } from '@/core/flags'

export interface NavItem {
  label: string
  path: string
  icon?: string
}

export interface ModuleManifest {
  id: string
  version: string
  routes: RouteObject[]
  navItems: NavItem[]
  required: boolean
  events: {
    emits: string[]
    listens: string[]
  }
}

class ModuleRegistry {
  private readonly modules: ModuleManifest[] = []

  register(manifest: ModuleManifest): void {
    if (this.modules.some((m) => m.id === manifest.id)) {
      console.warn(`[registry] Module "${manifest.id}" already registered — skipping.`)
      return
    }
    this.modules.push(manifest)
  }

  getEnabledModules(): ModuleManifest[] {
    return this.modules.filter((m) => m.required || isEnabled(`${m.id}.enabled`))
  }

  getRoutes(): RouteObject[] {
    return this.getEnabledModules().flatMap((m) => m.routes)
  }

  getNavItems(): NavItem[] {
    return this.getEnabledModules().flatMap((m) => m.navItems)
  }
}

export const registry = new ModuleRegistry()
