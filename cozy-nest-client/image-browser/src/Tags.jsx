import React, {useState} from "react";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';

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
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'var(--nevysha-font-color)',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: data.color,
    ':hover': {
      backgroundColor: data.color,
      color: 'white',
    },
  }),
}

export default function Tags(props) {
  const [tags, setTags] = useState(
    [
      { value: 'favorite', label: 'Favorite' },
      { value: 'save_for_later', label: 'Save for later' },

    ]
  )

  return (
    <Select
      options={tags}
      components={animatedComponents}
      isMulti
      placeholder={'Tags...'}
      styles={styles}
    />
  )
}