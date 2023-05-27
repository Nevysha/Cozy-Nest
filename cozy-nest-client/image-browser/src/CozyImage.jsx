//base url without port
import React, {useEffect, useRef, useState} from "react";
import {Button, Column, Row} from "./App.jsx";
import Tags from "./Tags.jsx";
import * as PropTypes from "prop-types";
import {CozyLogger} from "../../main/CozyLogger.js";
import {Controls} from "./Controls.jsx";

const baseUrl = window.location.href.split(":")[0] + ":" + window.location.href.split(":")[1]
const gradioPort = 7860

const safeExifSplit = (fn) => {
    try {
        return fn()
    } catch (ignored) {
      return 'Error parsing metadata'
    }
}

function CozyImageInfo(props) {

  //format date to human readable eg 1683694961.5761478 to yyyy-mm-dd HH:MM:SS
  const date = new Date(props.image.metadata.date * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')

  const model =
      safeExifSplit(() => props.image.metadata.exif.split("Model: ")[1].split(",")[0]);
  const size =
      safeExifSplit(() => props.image.metadata.exif.split("Size: ")[1].split(",")[0]);
  const seed =
      safeExifSplit(() => props.image.metadata.exif.split("Seed: ")[1].split(",")[0]);
  const steps =
      safeExifSplit(() => props.image.metadata.exif.split("Steps: ")[1].split(",")[0]);
  const sampler =
      safeExifSplit(() => props.image.metadata.exif.split("Sampler: ")[1].split(",")[0]);

  return (
    <div className="image-info">
      <table>
        <tbody>
        <tr>
          <td>Date:</td>
          <td>{date}</td>
        </tr>
        <tr>
          <td>Model:</td>
          <td>{model}</td>
        </tr>
        <tr>
          <td>Size:</td>
          <td>{size}</td>
        </tr>
        <tr>
          <td>Seed:</td>
          <td>{seed}</td>
        </tr>
        <tr>
          <td>Steps:</td>
          <td>{steps}</td>
        </tr>
        <tr>
          <td>Sampler:</td>
          <td>{sampler}</td>
        </tr>
        </tbody>
      </table>
      <Controls imgRef={props.imgRef}/>
    </div>
  );
}

function CozyFullImageInfo(props) {

  //format date to human readable eg 1683694961.5761478 to yyyy-mm-dd HH:MM:SS
  const date = new Date(props.image.metadata.date * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')

  //extra data from image.metadata.exif.parameters
  /*
  "(masterpiece, best quality, ultra-detailed, best shadow), (detailed background), (beautiful detailed face), high contrast, (best illumination, an extremely delicate and beautiful), ((cinematic light)), colorful, hyper detail, dramatic light, intricate details,
  a Environmental portrait
  of a sexy girl, 1girl, thick eyelashes,
  with brown hair,
  crop top, hoodie, crop top hoodie, Off-the-shoulder top,
  high-waisted shorts, high-waisted shorts,
  brown eyes,
  dutch angle,
  hairband,
  thigh strap
  A cityscape with skyscrapers and busy streets
  thick,  (cyberpunk:1.5),  <lora:hugeAssAndBoobs_v1:0.7>
  Negative prompt: (worst quality, low quality:1.4), (monochrome), zombie, easynegative, bad-hands-5,
  Steps: 20, Sampler: DPM++ 2M Karras v2, CFG scale: 7, Seed: 1397741187, Size: 512x512, Model hash: 4199bcdd14, Model: revAnimated_v122, Clip skip: 2"
  */
  const model =
      safeExifSplit(() => props.image.metadata.exif.split("Model: ")[1].split(",")[0]);
  const size =
      safeExifSplit(() => props.image.metadata.exif.split("Size: ")[1].split(",")[0]);
  const seed =
      safeExifSplit(() => props.image.metadata.exif.split("Seed: ")[1].split(",")[0]);
  const steps =
      safeExifSplit(() => props.image.metadata.exif.split("Steps: ")[1].split(",")[0]);
  const sampler =
      safeExifSplit(() => props.image.metadata.exif.split("Sampler: ")[1].split(",")[0]);
  const modelHash =
      safeExifSplit(() => props.image.metadata.exif.split("Model hash: ")[1].split(",")[0]);

  let formattedAll = props.image.metadata.exif

  try {
    formattedAll = formattedAll.replace(/\n/g, "<br>")
  }
  catch (ignored) {
    formattedAll = 'No metadata found'
  }


  return (
    <div className="image-info">
      <button
        className="nevysha lg primary gradio-button btn"
        onClick={() => props.closeModal()}>
        Close
      </button>
      <Row>
        <Tags/>
      </Row>
      <table>
        <tbody>
        <tr><td>Date: </td><td>{date}</td></tr>
        <tr><td>Model: </td><td>{model}</td></tr>
        <tr><td>Model Hash: </td><td>{modelHash}</td></tr>
        <tr><td>Size: </td><td>{size}</td></tr>
        <tr><td>Seed: </td><td>{seed}</td></tr>
        <tr><td>Steps: </td><td>{steps}</td></tr>
        <tr><td>Sampler: </td><td>{sampler}</td></tr>
        </tbody>
      </table>
      <div className="blocInfo" dangerouslySetInnerHTML={{__html: formattedAll}} />
      <Controls imgRef={props.imgRef}/>
    </div>
  );
}

export default function CozyImage(props) {

  const viewPort = props.viewPort

  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const _me = useRef(null);

  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {

    const top = _me.current.offsetTop
    const isOnScreen =
      top >= viewPort.top && top <= (viewPort.bottom + _me.current.offsetHeight) ||
      (top + _me.current.offsetHeight) >= viewPort.top && (top + _me.current.offsetHeight) <= viewPort.bottom

    if (isOnScreen) {
      setOnScreen(true)
    }
    else {
      setOnScreen(false)
    }
  }, [viewPort])

  function toggleModal() {
    setShowModal(!showModal)
  }
  function openModal() {
    if (showModal) return
    setShowModal(true)
  }

  function getSrc() {
    // url encode path
    const sanitizedPath = encodeURIComponent(props.image.path)
    return `${baseUrl}:${gradioPort}/cozy-nest/image?path=${sanitizedPath}`;
  }

  return (
    <div id={`img_${props.index}`} className="image" ref={_me}>
      {onScreen ? (<>
        <div className="image-wrapper" onClick={openModal}>
          <img
            className="cozy-nest-thumbnail"
            src={getSrc()}
            alt="image"
            ref={imgRef}/>
        </div>
        <CozyImageInfo image={props.image} imgRef={imgRef}/>
        {showModal && <div className="infoModal">
          <div className="image-wrapper">
            <img
              className="cozy-nest-thumbnail"
              src={getSrc()}
              alt="image"/>
          </div>
          <CozyFullImageInfo image={props.image} closeModal={toggleModal} imgRef={imgRef}/>
        </div>}
      </>) : (<div className="image image-placeholder"/>)}
    </div>
  );
}