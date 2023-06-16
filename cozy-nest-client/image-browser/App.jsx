import React, {useEffect, useState, useCallback, useContext} from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Browser from "./Browser.jsx";
import {MockImageBrowser} from "./MockImageBrowser.jsx";
import {CozyLogger} from "../main/CozyLogger.js";
import Loader from "react-spinners/HashLoader";
import {ImagesContext} from "./ImagesContext.tsx";
import {Column, Row} from "../main/Utils.jsx";
import {CozyTagsSelect} from "./CozyTags.jsx";



export function Button(props) {
  return <button
      {...props}
      className="nevysha lg primary gradio-button btn cnib-button"
      >{props.children}</button>
}


export function Loading(props) {

  const config = JSON.parse(localStorage.getItem('COZY_NEST_CONFIG'))

  const color = config['accent_color'] || '#36d7b7'
  const label = props.label || ''

  return (
      <div className='cozy-nest-loading'>
        <div>{label}</div>
        <Loader color={color} />
      </div>
  )
}

function App() {

  const config = JSON.parse(localStorage.getItem('COZY_NEST_CONFIG'))
  const disable_image_browser =
    config['disable_image_browser']

  const serverPort = (() => {
    try {
      return config.server_default_port
    }
    catch (e) {
      CozyLogger.debug('cnib_socket_server_port not found in main gradio app')
      return 3333;
    }
  })();

  if (disable_image_browser) {
    return (
        <>
          <MockImageBrowser/>
        </>
    )
  }

  const {
    images,
    setImages,
    setFilteredImages,
    setTags,
  } = useContext(ImagesContext)

  const [socketUrl, setSocketUrl] = useState(`ws://localhost:${serverPort}`);
  const [, setMessageHistory] = useState([]);
  const [activeTags, setActiveTags] = useState([])
  const [searchStr, setSearchStr] = useState('');
  const [emptyFetch, setEmptyFetch] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState('radio-hide-hidden');
  const [isLoading, setIsLoading] = useState(true);
  const [warnForJpeg, setWarnForJpeg] = useState(false);


  const { sendMessage, lastMessage, readyState, getWebSocket }
    = useWebSocket(
      socketUrl,
      {
        shouldReconnect: () => disable_image_browser,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
      }
    );

  //cheat to get the websocket object
  window.ws = getWebSocket();

  const askForImages = useCallback(() => sendMessage(
    JSON.stringify({what: "images"})), [sendMessage]
  );

  const reconnect = () => {

    if (readyState === ReadyState.OPEN) {
      return;
    }

    // force a dummy url change
    setSocketUrl(socketUrl + '?t=' + Date.now())

  }

  function applyActiveFilter() {
    return images
        .filter(image => {
          if (visibilityFilter === 'radio-hide-hidden') {
            return image.metadata.exif['cozy-nest-hidden'] !== 'True';
          } else if (visibilityFilter === 'radio-only-hidden') {
            return !(!image.metadata.exif['cozy-nest-hidden'] || image.metadata.exif['cozy-nest-hidden'] !== 'True');
          } else return true;
        })
        .filter(image => {
          if (activeTags.length === 0) {
              return true;
          }
          else {
              if (image.metadata.exif['cozy-nest-tags']) {
                const imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
                const intersection = imgTags.filter(tag => activeTags.includes(tag))
                return intersection.length > 0;
              }
              else return false;
          }
        })
  }

  //get images from server and set state
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data)
      if (data.error) {
        if (window.errorPipe) {
          window.errorPipe(data)
        }
      }
      if (data.what === 'images') {
        if (data.images.length === 0) {
          CozyLogger.debug('Received empty images array from socket')
          //disable images fetch loop
          setEmptyFetch(true)
        }
        setImages(data.images)
        setIsLoading(false)
      }
      if (data.what === 'dispatch_on_image_saved') {
        //add at the beginning of the array
        setImages(prev => [data.data, ...prev])
      }
      if (data.what === 'dispatch_on_index_built') {
        setImages([...data.data])
        setIsLoading(false)
      }
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  function checkForJpeg() {
    if (images.length > 0) {
      const jpeg = images.find(image => image.path.indexOf('jpeg') !== -1 || image.path.indexOf('jpg') !== -1)
      if (jpeg) {
        CozyLogger.debug('Found jpeg in images array')
        setWarnForJpeg(true)
      }
    }
  }

  //if images is empty, load images
  useEffect(() => {
    if (images.length === 0 && readyState === ReadyState.OPEN && !emptyFetch) {
      askForImages()
    }
    else {
      setFilteredImages(applyActiveFilter())
    }
    checkForJpeg()
  }, [images, readyState])

  //if searchStr is not empty, filter images
  useEffect(() => {

    if (searchStr !== '') {
      const _filteredImages = applyActiveFilter().filter(image => {
        return JSON.stringify(image.metadata.exif).includes(searchStr);
      })
      setFilteredImages(_filteredImages)
    }
    else {
      setFilteredImages(applyActiveFilter())
    }
  }, [searchStr, visibilityFilter, activeTags, images])

  useEffect(() => {
    const _tags = []
    images.forEach(image => {
        if (image.metadata.exif['cozy-nest-tags']) {
          const imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
          _tags.push(...imgTags)
        }
      })
    setTags([..._tags])
  }, [images, visibilityFilter])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const connexionStatusStyle = {
    color:
      readyState === ReadyState.OPEN
        ? 'green'
        : readyState === ReadyState.CONNECTING
          ? 'orange'
          : 'red',
  };
  
  const rebuildIndex = async () => {
    //fetch to @app.delete("/cozy-nest/index")
    const res = await fetch('/cozy-nest/index', {
        method: 'DELETE',
    })
    if (res.ok) {
      setImages([])
      setIsLoading(true)
    }
  }

  return (
    <>
      <Column>
        <Row>
          <Row>
            <h1 className="cnib-title"><span className="beta-emphasis">beta</span></h1>
            <button
                className="nevysha lg primary gradio-button btn"
                style={{width: '100px'}}
                onClick={rebuildIndex}
            >
              Rebuild Index
            </button>
            {warnForJpeg && <span style={{marginLeft: '20px', color: 'orange'}}>Warning: jpeg found in output folder. Jpeg images are not supported</span>}
          </Row>
          <Row style={{width: 'auto'}} className='cozy-websocket-status'>
            <span>WebSocket status <span className="connexionStatus" style={connexionStatusStyle}>{connectionStatus}</span></span>
            {readyState !== ReadyState.OPEN && <button
              className="nevysha lg primary gradio-button btn"
              style={{marginLeft: '20px', width: '100px'}}
              onClick={reconnect}
            >
              Connect
            </button>}
          </Row>
        </Row>

        <Row>
          <Row style={{gap:'10px', marginRight: '2px', width:'fit-content'}} onChange={(e) => setVisibilityFilter(e.target.id)}>
            {/*radio button for filter : Hide hidden, All, Only hidden*/}
            <Row style={{width: 'auto', alignItems: 'center'}}>
              <input type="radio" id="radio-hide-hidden" name="radio-filter" value="all" defaultChecked/>
              <label className="cozy-radio-label" htmlFor="radio-hide-hidden">Hide hidden</label>
            </Row>
            <Row style={{width: 'auto', alignItems: 'center'}}>
              <input type="radio" id="radio-all" name="radio-filter" value="all"/>
              <label className="cozy-radio-label" htmlFor="radio-all">All</label>
            </Row>
            <Row style={{width: 'auto', alignItems: 'center'}}>
              <input type="radio" id="radio-only-hidden" name="radio-filter" value="hidden"/>
              <label className="cozy-radio-label" htmlFor="radio-only-hidden">Only hidden</label>
            </Row>

          </Row>
        </Row>
        <Row>
          <textarea data-testid="textbox"
                    placeholder="Search anything : Tags, Prompt, Size, Model, ..."
                    rows="1"
                    spellCheck="false"
                    data-gramm="false"
                    onChange={(e) => setSearchStr(e.target.value)}/>
          <CozyTagsSelect setActiveTags={setActiveTags} />
        </Row>

      </Column>
      {!isLoading &&

        <Browser />

      }
      {isLoading && <Loading label="building Index..."/>}
    </>
  )
}

export default App
