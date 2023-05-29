import
  // @ts-ignore
  React,
{useEffect, useState} from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';

// @ts-ignore
import {CozyLogger} from "../../main/CozyLogger";

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

interface TagOption {
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

export function ImgTags(props: CreatableTagsProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions]
      = useState(props.tags.map(tag => ({value: tag, label: tag})));
  const [value, setValue] = useState(props.defaultValue);

  useEffect(() => {
    setOptions(props.tags.map(tag => ({value: tag, label: tag})));
    setValue(props.defaultValue);
  }, [props.tags, props.defaultValue])

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    const newOption = createOption(inputValue);
    setOptions((prev) => [...prev, newOption]);
    setValue([...value, newOption]);
    props.onChange([...value, newOption]);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleChange = (newValue: any) => {
    setValue(newValue);
    props.onChange(newValue);
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
          value={value}
      />
  )
}