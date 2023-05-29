import {Row} from "./App.jsx";
import {ImgTags} from "./Tags.tsx";
import {Controls} from "./Controls.jsx";
import React, {useEffect, useState} from "react";
import {CozyLogger} from "../../main/CozyLogger.js";
import {saveExif} from "./editor/ExifEditor.jsx";

const safeExifSplit = (fn) => {
  try {
    return fn()
  } catch (ignored) {
    return 'Error parsing metadata'
  }
}

export function CozyImageInfo(props) {

  //format date to human readable eg 1683694961.5761478 to yyyy-mm-dd HH:MM:SS
  const date = new Date(props.image.metadata.date * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')

  const isVerbose = props.verbose;

  const model =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Model: ")[1].split(",")[0]);
  const size =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Size: ")[1].split(",")[0]);
  const seed =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Seed: ")[1].split(",")[0]);
  const steps =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Steps: ")[1].split(",")[0]);
  const sampler =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Sampler: ")[1].split(",")[0]);
  const modelHash =
    safeExifSplit(() => props.image.metadata.exif.parameters.split("Model hash: ")[1].split(",")[0]);

  let formattedAll = props.image.metadata.exif.parameters

  try {
    formattedAll = formattedAll.replace(/\n/g, "<br>")
  }
  catch (ignored) {
    formattedAll = 'No metadata found'
  }

  const [tags, setTags] = useState([])
  const [imgTags, setImgTags] = useState([])

  useEffect(() => {
    if (props.image.metadata.exif['cozy-nest-tags']) {
      const _imgTags = props.image.metadata.exif['cozy-nest-tags'].split(',')
          .map(tag => {
            return {label: tag, value: tag}
          })
      setImgTags([..._imgTags])
    }
  }, [])

  useEffect(() => {
    const _tags = []
    props.images
      .forEach(image => {
        if (image.metadata.exif['cozy-nest-tags']) {
          const imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
          _tags.push(...imgTags)
        }
    })
    setTags([...new Set(_tags)])
  }, [props.images])

  const onTagsChange = (tags) => {
    setImgTags(tags)
  }

  const close = async () => {
    props.closeModal()
    props.image.metadata.exif['cozy-nest-tags'] = imgTags.map(tag => tag.value).join(',')
    await saveExif(props.image.path, props.image.metadata.exif)
    props.updateExifInState(props.image.path, props.image.metadata.exif)
  }

  return (
    <div className="image-info">
      {isVerbose &&
        <>
          <button
            className="nevysha lg primary gradio-button btn"
            onClick={close}>
            Close
          </button>
          <Row>
            <ImgTags tags={tags} defaultValue={imgTags} onChange={onTagsChange}/>
          </Row>
        </>
      }
      <table>
        <tbody>
        <tr><td>Date: </td><td>{date}</td></tr>
        <tr><td>Model: </td><td>{model}</td></tr>
        {isVerbose && <tr>
          <td>Model Hash:</td>
          <td>{modelHash}</td>
        </tr>}
        <tr><td>Size: </td><td>{size}</td></tr>
        <tr><td>Seed: </td><td>{seed}</td></tr>
        <tr><td>Steps: </td><td>{steps}</td></tr>
        <tr><td>Sampler: </td><td>{sampler}</td></tr>
        </tbody>
      </table>
      {isVerbose && <div className="blocInfo" dangerouslySetInnerHTML={{__html: formattedAll}}/>}
      <Controls image={props.image} updateExifInState={props.updateExifInState} deleteImg={props.deleteImg}/>
    </div>
  );
}