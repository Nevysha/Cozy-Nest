import
  // @ts-ignore
  React,
{useContext, useEffect, useState} from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
//@ts-ignore
import {CozyLogger} from "../main/CozyLogger";
import {ImagesContext} from "./ImagesContext.tsx";

const animatedComponents = makeAnimated();

// StylesConfig
const styles = {
  container: (state:any) => ({
    ...state,
    width: '100%',
  }),
  control: (state:any) => ({
    ...state,
    borderRadius:0,
    border: '1px solid var(--border-color-primary)',
    background: 'var(--input-background-fill)',
    width: '100%',
  }),
  option: (state:any) => ({
    ...state,
    borderRadius:0,
    color: 'var(--body-text-color)',
    background: 'var(--background-fill-primary)',
    '&:hover': {
      background: 'var(--ae-primary-color)'
    }
  }),
  menu: (state:any) => ({
    ...state,
    borderRadius:0,
    background: 'var(--background-fill-primary)',
    border: '1px solid var(--ae-input-border-color) !important'
  }),
  multiValue: (state:any) => ({
    ...state,
    borderRadius:0,
    background: 'var(--background-fill-primary)',
    color: 'var(--nevysha-font-color)',
  }),
  multiValueLabel: (styles:any) => ({
    ...styles,
    color: 'var(--nevysha-font-color)',
  }),
  multiValueRemove: (styles:any) => ({
    ...styles,
    ':hover': {
      color: 'white',
    },
  }),
  indicatorContainer: (styles:any) => ({
    ...styles,
    color: 'var(--nevysha-font-color)',
    padding: 0,
  })
}

export interface TagOption {
    label: string;
    value: string;
}

const createOption = (label: string):TagOption => ({
  label: label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

interface TagsProps {
    tags: string[];
    defaultValue?: TagOption[];
    setActiveTags: (tags: string[]) => void;
}

interface CreatableTagsProps {
  tags: string[];
  defaultValue: TagOption[];
  onChange: (tags: TagOption[]) => void;
}

export default function Tags(props: TagsProps) {

  return (
      <Select
          options={props.tags.map(tag => ({value: tag, label: tag}))}
          components={animatedComponents}
          isMulti
          placeholder={'Tags...'}
          styles={styles}
          onChange={(tags) => props.setActiveTags(tags.map(tag => tag.value))}
          value={props.defaultValue}
      />
  )
}

export function ImgTags({imageHash, onChange}: {imageHash: string}) {

  const {images, getImage, tags} = useContext(ImagesContext);
  const [image, setImage] = useState(
    getImage(imageHash)
  );

  const [imgTags, setImgTags] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const formattedOpt = tags.map(tag => ({value: tag, label: tag}));
    setOptions(tags.map(tag => ({value: tag, label: tag})));
    setImage(getImage(imageHash));

    if (image && image.metadata && image.metadata.exif && image.metadata.exif['cozy-nest-tags']) {
      const formattedTags = image.metadata.exif['cozy-nest-tags'].split(',').map(tag => ({value: tag, label: tag}));
      CozyLogger.debug('ImgTags', 'formattedTags', formattedTags, 'formattedOpt', formattedOpt);
      setImgTags([...formattedTags]);
    }
  }, [])

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    setImgTags([...imgTags, newOption]);
    onChange([...imgTags, newOption]);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (newValue: any) => {
    setImgTags(newValue);
    onChange(newValue);
  }

  return (
      <CreatableSelect
          options={options}
          components={animatedComponents}
          isMulti
          isDisabled={isLoading}
          isLoading={isLoading}
          onCreateOption={handleCreate}
          placeholder={'Tags...'}
          styles={styles}
          onChange={(tags) => handleChange(tags)}
          value={imgTags}
      />
  )
}