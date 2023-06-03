// type for image
export type Image = {
  path: string
  metadata: {
    hash: string
    date: number
    exif: {
      parameters: string,
      'cozy-nest-tags'?: string
      'cozy-nest-hidden'?: string
    }
  }
}