//base url without port
import React, {useEffect, useRef, useState} from "react";
import {CozyImageInfo} from "./CozyImageInfo.jsx";

const baseUrl = window.location.href.split(":")[0] + ":" + window.location.href.split(":")[1]
const gradioPort = 7860



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
        <CozyImageInfo verbose={false} image={props.image} deleteImg={props.deleteImg}/>
        {showModal && <div className="infoModal">
          <div className="image-wrapper">
            <img
              className="cozy-nest-thumbnail"
              src={getSrc()}
              alt="image"/>
          </div>
          <CozyImageInfo verbose={true} image={props.image} closeModal={toggleModal} deleteImg={props.deleteImg}/>
        </div>}
      </>) : (<div className="image image-placeholder"/>)}
    </div>
  );
}