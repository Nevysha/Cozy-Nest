import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {Image} from "@main/cozy-types";
// @ts-ignore
import {CozyLogger} from "../main/CozyLogger";

interface ImagesContextType {
    images: Image[];
    setImages: React.Dispatch<React.SetStateAction<Image[]>>;
    filteredImages: Image[];
    setFilteredImages: React.Dispatch<React.SetStateAction<Image[]>>;
}

export const ImagesContext = createContext<ImagesContextType>({
    images: [],
    setImages: () => {},
    filteredImages: [],
    setFilteredImages: () => {}
});

export function ImagesProvider({ children }: { children: ReactNode[] }) {
    const [images, setImages] = useState<Image[]>([]);
    const [filteredImages, setFilteredImages] = useState<Image[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {

        const noDuplicates = [...new Set(tags)];
        if (noDuplicates.length !== tags.length) {
            setTags(noDuplicates)
        }
    }, [tags])

    const deleteImg = async (what: string, image: Image) => {

        const {path} = image

        function removeFromImages() {
            //remove from images
            const newImages = images.filter(image => image.path !== decodeURIComponent(path))
            setImages([...newImages])
        }

        if (what === 'delete') {
            const response = await fetch(`/cozy-nest/image?path=${path}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const json = await response.json()
            CozyLogger.debug('json', json)
            if (response.ok) {
                removeFromImages()
            }
        }
        else if (what === 'archive') {
            const response = await fetch(`/cozy-nest/image?path=${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({archive: true})
            })
            const json = await response.json()
            CozyLogger.debug('json', json)
            if (response.ok) {
                removeFromImages()
            }
        }
    }

    const updateExifInState = (image: Image) => {

        const {metadata: {exif}, hash} = image
        const newImages = images.map(image => {
            if (image.hash === hash) {
                image.metadata.exif = exif
            }
            return image
        })
        setImages([...newImages])
    }

    const getImage = (hash: string) => {
        return images.find(image => image.hash === hash)
    }

    const value = {
        images,
        setImages,
        filteredImages,
        setFilteredImages,
        deleteImg,
        updateExifInState,
        getImage,
        tags,
        setTags
    }

    return (
        <ImagesContext.Provider value={value}>
            {children}
        </ImagesContext.Provider>
    )
}
