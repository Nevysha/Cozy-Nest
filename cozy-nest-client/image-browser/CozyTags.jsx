import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {ImagesContext} from "./ImagesContext";
import makeAnimated from 'react-select/animated';
import CreatableSelect from "react-select/creatable";

import ExifEditor from "./editor/ExifEditor.jsx";
import {CozyLogger} from "../main/CozyLogger.js";
const saveExif = ExifEditor.save;


const animatedComponents = makeAnimated();

// StylesConfig
const styles = {
    container: (state) => ({
        ...state,
        width: '100%',
    }),
    control: (state) => ({
        ...state,
        borderRadius:0,
        border: '1px solid var(--border-color-primary)',
        background: 'var(--input-background-fill)',
        width: '100%',
    }),
    option: (state) => ({
        ...state,
        borderRadius:0,
        color: 'var(--body-text-color)',
        background: 'var(--background-fill-primary)',
        '&:hover': {
            background: 'var(--ae-primary-color)'
        }
    }),
    menu: (state) => ({
        ...state,
        borderRadius:0,
        background: 'var(--background-fill-primary)',
        border: '1px solid var(--ae-input-border-color) !important'
    }),
    multiValue: (state) => ({
        ...state,
        borderRadius:0,
        background: 'var(--background-fill-primary)',
        color: 'var(--nevysha-font-color)',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: 'var(--nevysha-font-color)',
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        ':hover': {
            color: 'white',
        },
    }),
    indicatorContainer: (styles) => ({
        ...styles,
        color: 'var(--nevysha-font-color)',
        padding: 0,
    })
}


export function CozyTags({imageHash, isFull}) {

    const {getImage, tags, setTags} = useContext(ImagesContext)

    const [image, setImage] = useState(
        getImage(imageHash)
    );

    const [imgTags, setImgTags] = useState([])
    const [splicedTags, setSplicedTags] = useState([])

    const [isLoading, setIsLoading] = useState(false);

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

    const handleCreate = (inputValue) => {
        setIsLoading(true);
        setTags([...tags, inputValue])
        setImgTags([...imgTags, inputValue])
        setTimeout(() => {
            setIsLoading(false);
            handleSave([...imgTags, inputValue]).then(_ => _)
        }, 1000);
    };

    const handleChange = (newValue) => {
        const _newValue = newValue.map(tag => tag.value)
        setImgTags(_newValue);
        handleSave(_newValue).then(_ => _)
    }

    const handleSave = async (newTags) => {

        const exif = image.metadata.exif
        exif['cozy-nest-tags'] = newTags.join(',')
        CozyLogger.debug('Saving tags', exif)
        await saveExif(image.path, exif)
    }

    return (
      <>
        <CreatableSelect
          placeholder={'Tags...'}
          styles={styles}
          isMulti
          options={tags.map(tag => ({value: tag, label: tag}))}
          onCreateOption={handleCreate}
          isDisabled={isLoading}
          isLoading={isLoading}
          value={imgTags.map(tag => ({value: tag, label: tag}))}
          onChange={(tags) => handleChange(tags)}
        />
      </>
    );
}