import {Row} from "../main/Utils.jsx";
import {Controls} from "./Controls.jsx";
import React, {useContext, useEffect, useState} from "react";
import Exif from "./editor/ExifEditor.jsx";
import {ImagesContext} from "./ImagesContext.tsx";
import {CozyLogger} from "../main/CozyLogger.js";
import {CozyTags} from "./CozyTags.jsx";

const tryCatch = (fn) => {
  try {
    return fn()
  } catch (ignored) {
    return 'Error parsing metadata'
  }
}

export function CozyImageInfo({verbose, imageHash, closeModal}) {

  const {images, updateExifInState, getImage} = useContext(ImagesContext)

  const [image, setImage] = useState(
    getImage(imageHash)
  );

  const [formattedExif, setFormattedExif] = useState({
    date: 0,
    model: '',
    size: '',
    seed: '',
    steps: '',
    sampler: '',
    modelHash: '',
    formattedAll: ''
  })
  const isVerbose = verbose;



  useEffect(() => {
    setImage(getImage(imageHash));
  }, [images, imageHash]);

  useEffect(() => {
    if (!image) return
    if (!image.metadata) return
    if (!image.metadata.exif) return
    if (!image.metadata.exif.parameters) return

    setFormattedExif({
      date: tryCatch(() => new Date(image.metadata.date * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')),
      model: tryCatch(() => image.metadata.exif.parameters.split("Model: ")[1].split(",")[0]),
      size: tryCatch(() => image.metadata.exif.parameters.split("Size: ")[1].split(",")[0]),
      seed: tryCatch(() => image.metadata.exif.parameters.split("Seed: ")[1].split(",")[0]),
      steps: tryCatch(() => image.metadata.exif.parameters.split("Steps: ")[1].split(",")[0]),
      sampler: tryCatch(() => image.metadata.exif.parameters.split("Sampler: ")[1].split(",")[0]),
      modelHash: tryCatch(() => image.metadata.exif.parameters.split("Model hash: ")[1].split(",")[0]),
      formattedAll: tryCatch(() => image.metadata.exif.parameters.replace(/\n/g, "<br>"))
    })
  }, [image])

  const close = async () => {
    closeModal()
  }

  if (!image) return (<div className="image-info">No image selected</div>)

  return (
    <div className="image-info">
      {isVerbose &&
        <>
          <button
            className="nevysha lg primary gradio-button btn"
            onClick={close}>
            Close
          </button>
        </>
      }
      <CozyTags imageHash={imageHash} isFull={isVerbose}/>
      <table>
        <tbody>
        <tr><td>Date: </td><td>{formattedExif?.date}</td></tr>
        <tr><td>Model: </td><td>{formattedExif?.model}</td></tr>
        {isVerbose && <tr>
          <td>Model Hash:</td>
          <td>{formattedExif?.modelHash}</td>
        </tr>}
        <tr><td>Size: </td><td>{formattedExif?.size}</td></tr>
        <tr><td>Seed: </td><td>{formattedExif?.seed}</td></tr>
        <tr><td>Steps: </td><td>{formattedExif?.steps}</td></tr>
        <tr><td>Sampler: </td><td>{formattedExif?.sampler}</td></tr>
        </tbody>
      </table>
      {isVerbose && <div className="blocInfo" dangerouslySetInnerHTML={{__html: formattedExif?.formattedAll}}/>}
      <Controls imageHash={imageHash}/>
    </div>
  );
}