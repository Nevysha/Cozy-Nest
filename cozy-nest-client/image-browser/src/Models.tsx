import {createContext, ReactNode, useReducer} from "react";
import {ImageAction, ImagesContextType, ImagesState} from "../../cozy-types";

export const ImagesContext = createContext<ImagesContextType | null>(null)

const initialImages: ImagesState = []

export function ImagesProvider({ children }: { children: ReactNode[] }) {
  const [images, dispatch] = useReducer(
      imagesReducer,
      initialImages
  )

  return (
    <ImagesContext.Provider value={{images, dispatch}}>
        {children}
    </ImagesContext.Provider>
  )
}

export function imagesReducer(images: ImagesState, action: ImageAction): ImagesState {
  return [...images, action.payload]
}

export function imageReducer(images: ImagesState, action: ImageAction) {
  switch (action.type) {
    case 'add':
      return [...images, action.payload]
    case 'remove':
      return images.filter(image => image.path !== action.payload.path)
    case 'update':
      return images.map(image => {
        if (image.path === action.payload.path) {
          return action.payload
        }
        return image
      })
    default:
      return images
  }
}
