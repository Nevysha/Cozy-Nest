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

const CIVITAI_URL = {
  "modelPage":"https://civitai.com/models/",
  "modelId": "https://civitai.com/api/v1/models/",
  "modelVersionId": "https://civitai.com/api/v1/model-versions/",
  "hash": "https://civitai.com/api/v1/model-versions/by-hash/"
}

function ExtraNetworksPanel({item}) {

  const [isHovered, setIsHovered] = React.useState(false)
  const [infoLoaded, setInfoLoaded] = React.useState(false)
  const [info, setInfo] = React.useState({})
  const [validInfo, setValidInfo] = React.useState(false)

  useEffect(() => {
    if (infoLoaded || !isHovered) return

    (async () => {
      const response = await fetch(`/cozy-nest/extra_network?path=${encodeURIComponent(item.path)}`)
      if (response.status !== 200) {
        CozyLogger.error('Failed to fetch extra network info', response)
        return
      }
      const info = await response.json()
      setInfo(info)
      setInfoLoaded(true)
      setValidInfo(info !== null)
    })();

  }, [isHovered])

  function addTriggerWordsToPrompt() {

    if (info.trainedWords.length === 0) return

    const currentTab = get_uiCurrentTabContent().id

    let textarea = null
    if (currentTab.includes('txt2img')) {
      textarea = document.querySelector(`#txt2img_prompt label textarea`)
    }
    else if (currentTab.includes('img2txt')) {
      textarea = document.querySelector(`#img2img_prompt label textarea`)
    }

    textarea.value = `${textarea.value}\n${info.trainedWords.join(', ')}`

    //trigger input event
    const event = new Event('input')
    textarea.dispatchEvent(event)
  }

  function openCivitai() {

    if (!info.modelId) return

    const url = `${CIVITAI_URL.modelPage}/${info.modelId}`
    window.open(url, '_blank')
  }

  const hasTriggerWords = info.trainedWords && info.trainedWords.length > 0;
  const hasModelId = info.modelId !== undefined;

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
          {isHovered && infoLoaded && validInfo &&
            <div className="cozy-en-actions">
              <button
                title="Replace preview image"
              >
                R
              </button>
              {hasModelId && <button
                title="Open model in civitai"
                onClick={openCivitai}
              >
                V
              </button>}
              {hasTriggerWords && <button
                title="Add trigger words to prompt"
                onClick={addTriggerWordsToPrompt}
              >
                T
              </button>}
              <button
                title="Use prompt from preview image"
              >
                P
              </button>
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