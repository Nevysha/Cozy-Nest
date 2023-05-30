import React, {useContext, useEffect, useRef, useState} from "react";
import CozyImage from "./CozyImage.jsx";
import {ImageProvider, ImagesContext} from "./ImagesContext.tsx";

const _LAZY_LOAD_MARGIN = 300

export default function Browser(props) {

  const {filteredImages} = useContext(ImagesContext)

  const _me = useRef(null)
  const [page, setPage] = useState(0)
  const [imagesLoaded, setImagesLoaded] = useState([])

  const [viewPort, setViewPort] = useState({
    top: 0,
    bottom: window.innerHeight + _LAZY_LOAD_MARGIN
  })

  //when imagesRef changes, reset imagesLoaded
  useEffect(() => {
    setImagesLoaded(filteredImages.slice(0, Math.min(page*20+20, filteredImages.length)))
  }, [filteredImages])


  //load 20 images on mount when imagesRef is set
  if (filteredImages.length > 0 && imagesLoaded.length === 0) {
    setImagesLoaded(filteredImages.slice(0, Math.min(20, filteredImages.length)))
  }

  const scrollHandler = () => {
    maybeLoadMore()

    let _page = Math.floor(imagesLoaded.length / 20)
    if (_page !== page) {
      setPage(_page)
    }

    const _viewPort = {
      top: (_me.current.scrollTop - _LAZY_LOAD_MARGIN) > 0 ? (_me.current.scrollTop - _LAZY_LOAD_MARGIN) : 0,
      bottom: _me.current.scrollTop + _me.current.clientHeight + _LAZY_LOAD_MARGIN
    }
    setViewPort(_viewPort)
  }

  const maybeLoadMore = () => {
    //check if loadMoreThreshold is visible
    const loadMoreThreshold = document.getElementById("loadMoreThreshold")
    if (loadMoreThreshold.getBoundingClientRect().top < window.innerHeight) {
      //load 20 more images
      setImagesLoaded(imagesLoaded.concat(filteredImages.slice(page*20, page*20+20)))
    }
  }

  return <div className="browser nevysha nevysha-scrollable" onScroll={() => scrollHandler()} ref={_me}>
    {imagesLoaded.map((image, index) => {
      return (

          <CozyImage
              key={index}
              image={image}
              index={index}
              viewPort={viewPort}/>
      )
    })}
    <div id="loadMoreThreshold" className="hackyOffPageElement"/>
  </div>;
}