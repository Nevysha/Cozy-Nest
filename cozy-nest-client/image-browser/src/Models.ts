import {createContext} from "react";
import {Image, Action} from "../../cozy-types";

export const ImagesContext = createContext([])
export const ImageContext = createContext(null)


export function reduceImage(images: Image[], action: Action) {
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
