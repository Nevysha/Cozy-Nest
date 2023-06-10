import React, {useEffect} from "react";
import './ExtraNetworks.css'
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";


const nevyshaScrollbar = {
  '&::-webkit-scrollbar': {
    width: '5px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'var(--ae-primary-color)',
    borderRadius: '20px',
  },
}

function ExtraNetworkTab({nativeElement}) {

  const ref = React.useRef(null)

  useEffect(() => {
    if (!ref.current) return

    while (ref.current.firstChild) {
      ref.current.removeChild(ref.current.firstChild);
    }

    ref.current.appendChild(nativeElement)
  })

  return (
    <TabPanel css={nevyshaScrollbar}>
      <div className="ExtraNetworkTab" ref={ref} />
    </TabPanel>
  )
}

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