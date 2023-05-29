// type for image
export type Image = {
  path: string
  metadata: {
    date: number
    exif: {
      parameters: string,
      'cozy-nest-tags'?: string
      'cozy-nest-hidden'?: string
    }
  }
}