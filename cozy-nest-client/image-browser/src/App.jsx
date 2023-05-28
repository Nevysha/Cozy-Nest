import React, {useEffect, useState, useCallback, useRef} from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Browser from "./Browser.jsx";
import {MockImageBrowser} from "./MockImageBrowser.jsx";
import {CozyLogger} from "../../main/CozyLogger.js";
import Tags from "./Tags.jsx";

//component to wrap flex row
export function Row(props) {
  return <div
    {...props}
    className="flex-row">
    {props.children}
  </div>
}

//component to wrap flex column
export function Column(props) {
  return <div
    {...props}
    className="flex-column">
    {props.children}
  </div>
}

export function Button(props) {
  return <button
      {...props}
      className="nevysha lg primary gradio-button btn cnib-button"
      >{props.children}</button>
}

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



function App() {

  if (disable_image_browser) {
    return (
        <>
          <MockImageBrowser/>
        </>
    )
  }

  const [socketUrl, setSocketUrl] = useState(`ws://localhost:${serverPort}`);
  const [messageHistory, setMessageHistory] = useState([]);
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [searchStr, setSearchStr] = useState('');
  const [emptyFetch, setEmptyFetch] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState('radio-hide-hidden');


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

    // get the #nevyui_sh_options_start_socket button from main gradio app and click it
    const button = document.querySelector('#nevyui_sh_options_start_socket');
    button.click();

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
      }
      if (data.what === 'dispatch_on_image_saved') {
        //add at the beginning of the array
        setImages(prev => [data.data, ...prev])
      }
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage, setMessageHistory]);

  //if images is empty, load images
  useEffect(() => {
    if (images.length === 0 && readyState === ReadyState.OPEN && !emptyFetch) {
      askForImages()
    }
    else {
      setFilteredImages([...images])
    }
  }, [images, readyState])

  //if searchStr is not empty, filter images
  useEffect(() => {

    function applyActiveFilter() {
      return images.filter(image => {
        if (visibilityFilter === 'radio-hide-hidden') {
          if (image.metadata.exif['cozy-nest-hidden'] === 'True') {
            return false;
          }
          else return true;
        }
        else if (visibilityFilter === 'radio-only-hidden') {
          if (!image.metadata.exif['cozy-nest-hidden'] || image.metadata.exif['cozy-nest-hidden'] !== 'True') {
            return false;
          }
          else return true;
        }
        else return true;
      })
    }

    if (searchStr !== '') {
      const filteredImages = applyActiveFilter().filter(image => {
        if (JSON.stringify(image.metadata.exif).includes(searchStr)) {
          return true;
        }
        else return false;
      })
      setFilteredImages(filteredImages)
    }
    else {
      setFilteredImages(applyActiveFilter())
    }
  }, [searchStr, visibilityFilter])

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
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

  const deleteImg = async (what, path) => {

    function removeFromImages() {
      //remove from images
      const newImages = images.filter(image => image.path !== decodeURIComponent(path))
      setImages([...newImages])
    }

    if (what === 'delete') {
      const response = await fetch(`/cozy-nest/image?path=${path}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const json = await response.json()
      CozyLogger.log('json', json)
      if (response.ok) {
        removeFromImages()
      }
    }
    else if (what === 'archive') {
      const response = await fetch(`/cozy-nest/image?path=${path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({archive: true})
      })
      const json = await response.json()
      CozyLogger.log('json', json)
      if (response.ok) {
        removeFromImages()
      }
    }

  }

  return (
    <>
      <Column>
        <Row>
          <Row>
            <h1 className="cnib-title">Cozy Nest Image Browser <span className="beta-emphasis">beta</span></h1>
          </Row>
          <Row style={{width: 'auto'}}>
            <span>The WebSocket is currently <span className="connexionStatus" style={connexionStatusStyle}>{connectionStatus}</span></span>
            <button
              className="nevysha lg primary gradio-button btn"
              style={{marginLeft: '20px', width: '100px'}}
              onClick={reconnect}
              disabled={readyState === ReadyState.OPEN}
            >
              Connect
            </button>
          </Row>
        </Row>

        <Row style={{gap:'10px', marginBottom: '2px'}} onChange={(e) => setVisibilityFilter(e.target.id)}>
          {/*radio button for filter : Hide hidden, All, Only hidden*/}
          <Row style={{width: 'auto', alignItems: 'center'}}>
            <input type="radio" id="radio-hide-hidden" name="radio-filter" value="all" defaultChecked/>
            <label htmlFor="radio-hide-hidden">Hide hidden</label>
          </Row>
          <Row style={{width: 'auto', alignItems: 'center'}}>
            <input type="radio" id="radio-all" name="radio-filter" value="all"/>
            <label htmlFor="radio-all">All</label>
          </Row>
          <Row style={{width: 'auto', alignItems: 'center'}}>
            <input type="radio" id="radio-only-hidden" name="radio-filter" value="hidden"/>
            <label htmlFor="radio-only-hidden">Only hidden</label>
          </Row>


        </Row>

        <Row>
          <textarea data-testid="textbox"
                    placeholder="Search anything : Prompt, Size, Model, ..."
                    rows="1"
                    spellCheck="false"
                    data-gramm="false"
                    onChange={(e) => setSearchStr(e.target.value)}/>
          <Tags />
        </Row>

      </Column>
      <Browser key={0} imagesRef={filteredImages} deleteImg={deleteImg}/>
    </>
  )
}

export default App
