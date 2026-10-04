// © Janus — yashxsanjay
import { features } from '@/core/config/loader'

export function isEnabled(flag: string): boolean {
  return features[flag] === true
}
