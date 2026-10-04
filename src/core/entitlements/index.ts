// © Janus — yashxsanjay
import { plans } from '@/core/config/loader'

interface Actor {
  planId?: string
}

export function can(actor: Actor | null, feature: string): boolean {
  if (!actor) return false
  const planId = actor.planId ?? 'free'
  const plan = plans.find((p) => p.id === planId)
  if (!plan) return false
  return Boolean((plan.features as Record<string, unknown>)[feature])
}
