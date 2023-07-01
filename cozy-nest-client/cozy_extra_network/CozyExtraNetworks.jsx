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

function ExtraNetworksPanel({items}) {
  return (
    <div className="CozyExtraNetworksPanels">
      {items.map((item, index) => {
        return (
          <div key={index}>{item}</div>
        )
      })}
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
          <ExtraNetworksPanel items={extraNetworks[network]}/>
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