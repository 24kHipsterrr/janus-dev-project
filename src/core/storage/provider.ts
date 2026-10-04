// © Janus — yashxsanjay

export interface UploadResult {
  url: string
  path: string
}

export interface StorageProvider {
  upload(bucket: string, path: string, file: File): Promise<UploadResult>
  getPublicUrl(bucket: string, path: string): string
  delete(bucket: string, path: string): Promise<void>
}
