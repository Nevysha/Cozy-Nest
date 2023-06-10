import React, {useEffect} from "react";
import './ExtraNetworks.css'
import {LoaderContext} from "./LoaderContext.jsx";
import {CozyLogger} from "../main/CozyLogger.js";

let extraNetworksParent = null;

export function ExtraNetworks({prefix}) {

  const ref = React.useRef(null)
  const {ready} = React.useContext(LoaderContext)

  useEffect(() => {
    if (ready) {
      loadNativeElements()
    }
    return () => {
      unLoad()
    }
  }, [ready])

  function loadNativeElements() {
    if (!ref.current) return

    CozyLogger.debug('loading native elements')

    const tabs = document.querySelector(`#${prefix}_extra_tabs`)
    extraNetworksParent = tabs.parentNode

    ref.current.appendChild(tabs)
  }

  function unLoad() {
    if (!ref.current || !extraNetworksParent) return

    CozyLogger.debug('unloading native elements')

    const tabs = document.querySelector(`#${prefix}_extra_tabs`)

    extraNetworksParent.appendChild(tabs)
  }

  return (
    <div ref={ref} style={{height:'100%'}} />
  );
}