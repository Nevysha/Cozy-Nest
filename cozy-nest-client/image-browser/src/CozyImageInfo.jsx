import {Row} from "./App.jsx";
import {ImgTags} from "./Tags.tsx";
import {Controls} from "./Controls.jsx";
import React, {useContext, useEffect, useState} from "react";
import Exif from "./editor/ExifEditor.jsx";
import {ImageContext, ImagesContext} from "./ImagesContext.tsx";

const safeExifSplit = (fn) => {
  try {
    return fn()
  } catch (ignored) {
    return 'Error parsing metadata'
  }
}

export function CozyImageInfo(props) {

  const {images, updateExifInState} = useContext(ImagesContext)
  const {image, setImage} = useContext(ImageContext)

  //format date to human readable eg 1683694961.5761478 to yyyy-mm-dd HH:MM:SS
  const date = new Date(image.metadata.date * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')

  const isVerbose = props.verbose;

  const model =
    safeExifSplit(() => image.metadata.exif.parameters.split("Model: ")[1].split(",")[0]);
  const size =
    safeExifSplit(() => image.metadata.exif.parameters.split("Size: ")[1].split(",")[0]);
  const seed =
    safeExifSplit(() => image.metadata.exif.parameters.split("Seed: ")[1].split(",")[0]);
  const steps =
    safeExifSplit(() => image.metadata.exif.parameters.split("Steps: ")[1].split(",")[0]);
  const sampler =
    safeExifSplit(() => image.metadata.exif.parameters.split("Sampler: ")[1].split(",")[0]);
  const modelHash =
    safeExifSplit(() => image.metadata.exif.parameters.split("Model hash: ")[1].split(",")[0]);

  let formattedAll = image.metadata.exif.parameters

  try {
    formattedAll = formattedAll.replace(/\n/g, "<br>")
  }
  catch (ignored) {
    formattedAll = 'No metadata found'
  }

  const [tags, setTags] = useState([])
  const [imgTags, setImgTags] = useState([])

  useEffect(() => {
    if (image.metadata.exif['cozy-nest-tags']) {
      const _imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
          .map(tag => {
            return {label: tag, value: tag}
          })
      setImgTags([..._imgTags])
    }
  }, [])

  useEffect(() => {
    const _tags = []
    images
      .forEach(image => {
        if (image.metadata.exif['cozy-nest-tags']) {
          const imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
          _tags.push(...imgTags)
        }
    })
    setTags([...new Set(_tags)])
  }, [images])

  const onTagsChange = (tags) => {
    setImgTags(tags)
  }

  async function saveExif() {
    image.metadata.exif['cozy-nest-tags'] = imgTags.map(tag => tag.value).join(',')
    await Exif.save(image.path, image.metadata.exif)
    updateExifInState(image)
    setImage(image)
  }

  const close = async () => {
    props.closeModal()
    await saveExif();
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
      <Controls />
    </div>
  );
}