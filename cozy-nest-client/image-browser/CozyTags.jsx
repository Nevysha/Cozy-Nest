import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ImagesContext} from "./ImagesContext";
import {Row} from "../main/Utils.jsx";
import {Button} from "./App.jsx";
import {Input} from "@chakra-ui/react";
import useClickOutside from "../settings/useClickOutside.js";
import {CozyLogger} from "../main/CozyLogger.js";

export function CozyTags({imageHash, isFull}) {

    const {getImage, tags} = useContext(ImagesContext)

    const [image, setImage] = useState(
        getImage(imageHash)
    );

    const [imgTags, setImgTags] = useState([])
    const [splicedTags, setSplicedTags] = useState([])

    const [isInputVisible, setIsInputVisible] = useState(false)

    const popover = useRef();
    const close = useCallback(() => setIsInputVisible(false), []);
    useClickOutside(popover, close);

    const exifTags = image && image.metadata && image.metadata.exif && image.metadata.exif['cozy-nest-tags']

    useEffect(() => {

        if (!image) return

        if (image.metadata.exif['cozy-nest-tags']) {
            const _imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
            setImgTags([..._imgTags])
            setSplicedTags([..._imgTags])
            if (!isFull) {
                // keep only the first 3 tags
                _imgTags.splice(3)
                setSplicedTags(_imgTags)
            }

        }
        else {
            setImgTags([])
        }
    }, [imageHash,exifTags])

    useEffect(() => {
        setImage(getImage(imageHash))
    }, [imageHash])

    CozyLogger.debug('CozyTags', {imageHash, image, imgTags, exifTags})

    return (
        <div className="CozyTags">
            {splicedTags.map((tag, index) => {
                return (
                    <span key={index} className="cozy-nest-tags">
                        {tag}
                    </span>
                )
            })}
            {imgTags.length > splicedTags.length &&
              <span className="hasMore">...</span>
            }
            <Button title="edit tags" className="btn" style={{width:'10px'}} onClick={() => setIsInputVisible(!isInputVisible)}>+</Button>
            {isInputVisible &&
              <Input
                ref={popover}
                defaultValue={imgTags.join(',')}
                type="text"
                className="form-control CozyTagInput"
                placeholder="Add tag"/>
            }
        </div>
    );
}