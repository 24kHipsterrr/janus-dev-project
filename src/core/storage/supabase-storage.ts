// © Janus — yashxsanjay
import { supabase } from '@/core/supabase/client'
import type { StorageProvider, UploadResult } from './provider'

const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'image/jpeg',
  'image/png',
  'image/webp',
])

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25 MB

class SupabaseStorageProvider implements StorageProvider {
  async upload(bucket: string, path: string, file: File): Promise<UploadResult> {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      throw new Error(`File type "${file.type}" is not allowed.`)
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error('File exceeds the 25 MB limit.')
    }

    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: false,
      contentType: file.type,
    })
    if (error) throw new Error(`Upload failed: ${error.message}`)

    return { url: this.getPublicUrl(bucket, path), path }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  async delete(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw new Error(`Delete failed: ${error.message}`)
  }
}

export const storage: StorageProvider = new SupabaseStorageProvider()
