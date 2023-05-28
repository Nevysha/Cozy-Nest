// type for action
export interface Action {
  type: string
  payload: any
}

// type for image
export interface Image {
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