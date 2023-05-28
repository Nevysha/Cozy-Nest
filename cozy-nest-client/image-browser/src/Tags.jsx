import React, {useEffect, useState} from "react";
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

  // const [activeTags,] = useState(props.activeTags)
  //
  // useEffect(() => {
  //   props.setActiveTags(activeTags)
  //   console.log('activeTags', activeTags)
  // }, [props.tags])

  console.log('props.defaultValue', props.defaultValue)

  return (
    <div style={{width: '300px'}}>
      <Select
        options={props.tags.map(tag => ({value: tag, label: tag}))}
        components={animatedComponents}
        isMulti
        placeholder={'Tags...'}
        styles={styles}
        onChange={(tags) => props.setActiveTags(tags.map(tag => tag.value))}
        defaultValue={props.defaultValue}
      />
    </div>
  )
}