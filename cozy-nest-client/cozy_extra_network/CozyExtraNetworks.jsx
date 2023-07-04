import React, {useContext} from "react";
import {useEffect} from "react";
import {Loading} from "../image-browser/App.jsx";
import {Checkbox, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import './CozyExtraNetworks.scss'
import {ExtraNetworksCard} from "./ExtraNetworksCard.jsx";
import {Column, Row, RowFullWidth} from "../main/Utils.jsx";
import {SvgForReact} from "../main/svg_for_react.jsx";
import {FolderTreeFilter} from "./FolderTreeFilter.jsx";

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

const indexRef = []

export function CozyExtraNetworks() {

  const [extraNetworks, setExtraNetworks] = React.useState([])
  const [folders, setFolders] = React.useState([])
  const [ready, setReady] = React.useState(false)
  const [fullyLoaded, setFullyLoaded] = React.useState(false)

  const [searchString, setSearchString] = React.useState('')
  const [displayFolderFilter, setDisplayFolderFilter] = React.useState(false)
  const [nsfwFilter, setNsfwFilter] = React.useState(false)

  const [selectedTab, setSelectedTab] = React.useState(null)

  useEffect(() => {
    (async () => {
      const response = await fetch('/cozy-nest/extra_networks')
      if (response.status !== 200) {
        CozyLogger.error('failed to fetch extra networks', response)
        return;
      }
      const _enJson = await response.json()

      const responseFolders = await fetch('/cozy-nest/extra_networks/folders')
      if (responseFolders.status !== 200) {
        CozyLogger.error('failed to fetch extra networks folders', responseFolders)
        return;
      }
      const _folders = await responseFolders.json()

      setFolders(_folders)
      setExtraNetworks(_enJson)
      setReady(true)
    })()

  }, [])

  useEffect(() => {

    if (!nsfwFilter) return;
    if (fullyLoaded) return;

    setReady(false);

    (async () => {
      const response = await fetch('/cozy-nest/extra_networks/full')
      if (response.status === 200) {
        const json = await response.json()
        setExtraNetworks(json)
        setReady(true)
        setFullyLoaded(true)
        setSelectedTab(indexRef[0])
      }
      else {
        CozyLogger.error('failed to fetch full extra networks info', response)
      }
    })()
  }, [nsfwFilter])

  function buildExtraNetworks() {

    const EnTabs = [];
    const EnTabPanels = [];

    const style = {
      border: 'none',
      height: '100%',
      borderBottom: '1px solid var(--ae-input-border-color)',
      borderTop: '1px solid var(--tab-nav-background-color-selected)',
    };

    Object.keys(extraNetworks).forEach((network, index) => {
      let tabName = String(network);
      indexRef.push(network)
      if (network === 'embeddings') {
        tabName = 'Textual Inversion'
      }
      EnTabs.push(
        <Tab key={index}>{tabName}</Tab>
      )
      EnTabPanels.push(
        <TabPanel css={nevyshaScrollbar} key={index} style={style}>
          <div className="CozyExtraNetworksPanels">
            {extraNetworks[network].map((item, index) => {
              return (
                <ExtraNetworksCard
                    key={item.path}
                    item={item}
                    searchString={searchString}
                    selectedFolder={selectedFolder}
                    nsfwFilter={nsfwFilter}/>
              )
            })}
          </div>
        </TabPanel>
      )
    })

    return {EnTabs, EnTabPanels}
  }

  function onTabSelect(index) {
    setSelectedTab(indexRef[index])
    setSelectedFolder(null)
  }

  const [selectedFolder, setSelectedFolder] = React.useState(null)
  function folderSelectHandler({element}) {
    CozyLogger.debug('folderSelectHandler', {element})

    if (element.name === 'all' || !element.metadata) {
      setSelectedFolder(null)
      return
    }
    setSelectedFolder(element.metadata.path)

  }

  const Ui = buildExtraNetworks()

  const hasSubFolders = folders[selectedTab] && !folders[selectedTab].empty

  return (
    <div className="CozyExtraNetworks">
      {!ready && <Loading label="Loading Extra Networks..."/>}
      {ready &&
        <Column style={{width: '100%'}}>
          <textarea data-testid="textbox"
                    placeholder="Search..."
                    rows="1"
                    spellCheck="false"
                    data-gramm="false"
                    style={{resize: 'none', minHeight: '35px'}}
                    onChange={(e) => setSearchString(e.target.value)}/>
          <RowFullWidth style={{margin:'3px 0'}}>
            <Checkbox
                isChecked={displayFolderFilter}
                disabled={!hasSubFolders}
                onChange={(e) => setDisplayFolderFilter(e.target.checked)}
            >Display folder filter</Checkbox>
            <div style={{flex:1}}/>
            <button
                onClick={() => setNsfwFilter(!nsfwFilter)}
                title="WARNING : this will take time as it will compute the info of all extra networks"
                className="btn-settings toggleNsfwFilter"
            >Toggle sfw filter
              <span className="sfwFilterInfo">{!nsfwFilter ? SvgForReact.eyeSlash : SvgForReact.eye }</span>
            </button>
          </RowFullWidth>
          <Row style={{height: 'calc(100% - 90px)'}}>
            {displayFolderFilter &&
                <FolderTreeFilter
                    hasSubFolders={hasSubFolders}
                    folder={folders[selectedTab]}
                    forNetwork={selectedTab}
                    selectHandler={folderSelectHandler}/>
            }
            <Tabs variant='nevysha' onChange={onTabSelect}>
              <TabList style={{backgroundColor: 'var(--tab-nav-background-color)'}}>
                {Ui.EnTabs}
              </TabList>
              <TabPanels>
                {Ui.EnTabPanels}
              </TabPanels>
            </Tabs>
          </Row>
        </Column>
      }
    </div>
  )
}