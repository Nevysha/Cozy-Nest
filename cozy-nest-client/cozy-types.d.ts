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

export type ImagesState = Image[];

type ImageAction =
    | { type: 'add'; payload: Image }
    | { type: 'update'; payload: Image }
    | { type: 'remove'; payload: Image };

type ImagesAction =
    | { type: 'set_images'; payload: Image[] };

type DispatchImages = (action: TasksAction) => void;
export type ImagesContextType = {
  images: ImagesState,
  dispatch: DispatchImages
};