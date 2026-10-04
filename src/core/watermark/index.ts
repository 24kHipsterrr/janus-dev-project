// © Janus — yashxsanjay
import brandConfig from '@config/brand.json'

export const MARK_ID: string = brandConfig.markId
export const WATERMARK_META_NAME: string = brandConfig.watermarkMetaName

// Layer B: zero-width encoding for fixed UI strings and email templates only.
// Never use in user-copyable, searchable, or user-visible text.
export function encodeMarkId(): string {
  return MARK_ID.split('')
    .map((c) => c + '​')
    .join('')
}
