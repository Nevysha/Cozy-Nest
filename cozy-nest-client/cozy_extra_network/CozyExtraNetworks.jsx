import React from "react";
import {useEffect} from "react";
import {Loading} from "../image-browser/App.jsx";
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import './CozyExtraNetworks.css'

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

function ExtraNetworksPanel({item}) {

  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <div
      className="CozyExtraNetworksCard"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="en-preview-wrapper">
        {item.previewPath &&
          <img
            className="en-preview-thumbnail"
            src={`./sd_extra_networks/thumb?filename=${encodeURIComponent(item.previewPath)}&amp;mtime=${new Date().getTime()}`}
            loading="lazy"
            alt={item.name}
          />
        }
        {!item.previewPath &&
          <div className="en-preview-thumbnail black">
            No preview
          </div>
        }
        <div className="cozy-en-info">
          {isHovered &&
            <div className="cozy-en-actions">
              <button title="Replace preview image">R</button>
              <button title="Open model in civitai">V</button>
              <button title="Add trigger words to prompt">T</button>
              <button title="Use prompt from preview image">P</button>
            </div>
          }
          <span className="en-preview-name">{item.name || item}</span>
        </div>
      </div>

    </div>
  );
}

export function CozyExtraNetworks() {

  const [extraNetworks, setExtraNetworks] = React.useState([])
  const [ready, setReady] = React.useState(false)

  useEffect(() => {
    (async () => {
      const response = await fetch('/cozy-nest/extra_networks')
      if (response.status === 200) {
        const json = await response.json()
        setExtraNetworks(json)
        setReady(true)
      }
      else {
        CozyLogger.error('failed to fetch extra networks', response)
      }
    })()
  }, [])

  function buildExtraNetworks() {

    const EnTabs = [];
    const EnTabPanels = [];

    Object.keys(extraNetworks).forEach((network, index) => {
      EnTabs.push(
        <Tab key={index}>{network}</Tab>
      )
      EnTabPanels.push(
        <TabPanel css={nevyshaScrollbar} key={index}>
          <div className="CozyExtraNetworksPanels">
            {extraNetworks[network].map((item, index) => {
              return <ExtraNetworksPanel key={index} item={item}/>
            })}
          </div>
        </TabPanel>
      )
    })

    return {EnTabs, EnTabPanels}
  }

  const Ui = buildExtraNetworks()

  return (
    <div className="CozyExtraNetworks">
      {!ready && <Loading label="Loading Extra Networks..."/>}
      {ready &&
        <>
          <Tabs variant='nevysha'>
            <TabList style={{backgroundColor: 'var(--tab-nav-background-color)'}}>
              {Ui.EnTabs}
            </TabList>
            <TabPanels>
              {Ui.EnTabPanels}
            </TabPanels>
          </Tabs>
        </>
      }
    </div>
  )
}