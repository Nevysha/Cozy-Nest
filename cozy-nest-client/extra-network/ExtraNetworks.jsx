import React, {useEffect} from "react";
import './ExtraNetworks.css'

export function ExtraNetworks() {

  const [loaded, setLoaded] = React.useState(false)
  const ref = React.useRef(null)

  function loadNativeElements() {
    if (!ref.current) return

    const tabs = document.querySelector('#txt2img_extra_tabs')

    ref.current.appendChild(tabs)
    setLoaded(true)
  }

  return (
    <div ref={ref} style={{height:'100%'}}>
      <button onClick={() => loadNativeElements()}>load</button>
    </div>
  );
}