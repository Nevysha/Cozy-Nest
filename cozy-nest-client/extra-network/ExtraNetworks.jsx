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

  const [virtualExtraNetworksContainer, setVirtualExtraNetworksContainer] = React.useState([])
  const [tabNames, setTabNames] = React.useState([])

  function loadNativeElements() {
    const tabs = document.querySelectorAll('#txt2img_extra_tabs > .tabitem > div > div')

    const build = []

    tabs.forEach((item, index) => {
      build.push(<ExtraNetworkTab key={index} nativeElement={item}/>)
    })

    setVirtualExtraNetworksContainer(build)

    const buttons = document.querySelectorAll('#txt2img_extra_tabs > div > button:not(.gradio-button)');
    const names = []
    buttons.forEach((item, index) => {
      names.push(item.innerText)
    })
    setTabNames(names)
  }

  if (!virtualExtraNetworksContainer || virtualExtraNetworksContainer.length === 0) {
    return (
      <>
        <button onClick={() => loadNativeElements()}>load</button>
        <div>loading...</div>
      </>
    )
  }

  return (
    <>
        <Tabs variant='nevyshaExtraNetwork'>
          <TabList style={{backgroundColor: 'var(--tab-nav-background-color)'}}>
            {tabNames.map((item, index) => {
              return <Tab key={index}>{item}</Tab>
            } )}
          </TabList>

          <TabPanels>
            {virtualExtraNetworksContainer}
          </TabPanels>
        </Tabs>
    </>
  );
}