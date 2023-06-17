//base url without port
import React, {useContext, useEffect, useRef, useState} from "react";
import {CozyImageInfo} from "./CozyImageInfo.jsx";
import {ImagesContext} from "./ImagesContext.tsx";

const baseUrl = window.location.href.split(":")[0] + ":" + window.location.href.split(":")[1]
const gradioPort = 7860



export default function CozyImage({viewPort, imageHash, index}) {

  const [showModal, setShowModal] = useState(false);
  const imgRef = useRef(null);
  const _me = useRef(null);
  const {getImage} = useContext(ImagesContext)
  const [onScreen, setOnScreen] = useState(false);

  const [image, setImage] = useState(
    getImage(imageHash)
  );

  useEffect(() => {
    setImage(getImage(imageHash));
  }, [imageHash]);

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
    const sanitizedPath = encodeURIComponent(image.path)
    return `/cozy-nest/image?path=${sanitizedPath}`;
  }

  return (

    <div id={`img_${index}`} className="image" ref={_me}>
      {onScreen ? (<>
        <div className="image-wrapper" onClick={openModal}>
          <img
            className="cozy-nest-thumbnail"
            src={getSrc()}
            alt="image"
            ref={imgRef}/>
        </div>
        <CozyImageInfo verbose={false} imageHash={imageHash}/>
        {showModal && <div className="infoModal">
          <div className="image-wrapper">
            <img
              className="cozy-nest-thumbnail"
              src={getSrc()}
              alt="image"/>
          </div>
          <CozyImageInfo verbose={true} imageHash={imageHash} closeModal={toggleModal} />
        </div>}
      </>) : (<div className="image image-placeholder"/>)}
    </div>
  );
}