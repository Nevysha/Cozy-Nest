import React, {useEffect, useState, useCallback, useRef} from 'react'
import './App.css'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Browser from "./Browser.jsx";
import {MockImageBrowser} from "./MockImageBrowser.jsx";
import {CozyLogger} from "../../main/CozyLogger.js";
import Tags from "./Tags.tsx";
import Loader from "react-spinners/HashLoader";

//component to wrap flex row
export function Row(props) {

  // if props.className is set, append flex-row to it
  // otherwise, set className to flex-row
  const className = props.className ? props.className + ' flex-row' : 'flex-row'

  return <div
    {...props}
    className={className}>
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


function Loading(props) {

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
  const [tags, setTags] = useState([])
  const [activeTags, setActiveTags] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [searchStr, setSearchStr] = useState('');
  const [emptyFetch, setEmptyFetch] = useState(false);
  const [visibilityFilter, setVisibilityFilter] = useState('radio-hide-hidden');
  const [isLoading, setIsLoading] = useState(true);


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

  function filterVisibility() {
    return image => {
      if (visibilityFilter === 'radio-hide-hidden') {
        if (image.metadata.exif['cozy-nest-hidden'] === 'True') {
          return false;
        } else return true;
      } else if (visibilityFilter === 'radio-only-hidden') {
        if (!image.metadata.exif['cozy-nest-hidden'] || image.metadata.exif['cozy-nest-hidden'] !== 'True') {
          return false;
        } else return true;
      } else return true;
    };
  }

  function applyActiveFilter() {
    return images
        .filter(filterVisibility())
        .filter(image => {
          if (activeTags.length === 0) {
              return true;
          }
          else {
              if (image.metadata.exif['cozy-nest-tags']) {
                const imgTags = image.metadata.exif['cozy-nest-tags'].split(',')
                const intersection = imgTags.filter(tag => activeTags.includes(tag))
                if (intersection.length > 0) {
                    return true;
                }
                else return false;
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

  //if images is empty, load images
  useEffect(() => {
    if (images.length === 0 && readyState === ReadyState.OPEN && !emptyFetch) {
      askForImages()
    }
    else {
      setFilteredImages(applyActiveFilter())
    }
  }, [images, readyState])

  //if searchStr is not empty, filter images
  useEffect(() => {

    if (searchStr !== '') {
      const _filteredImages = applyActiveFilter().filter(image => {
        if (JSON.stringify(image.metadata.exif).includes(searchStr)) {
          return true;
        }
        else return false;
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
    setTags([...new Set(_tags)])
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
      CozyLogger.debug('json', json)
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
      CozyLogger.debug('json', json)
      if (response.ok) {
        removeFromImages()
      }
    }
  }

  const updateExifInState = (path, exif) => {
    //TODO use reducer
    const newImages = images.map(image => {
      if (image.path === path) {
        image.metadata.exif = exif
      }
      return image
    })
    setImages([...newImages])
  }
  
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
          <Tags tags={tags} setActiveTags={setActiveTags} />
        </Row>
        <Row>
          <textarea data-testid="textbox"
                    placeholder="Search anything : Prompt, Size, Model, ..."
                    rows="1"
                    spellCheck="false"
                    data-gramm="false"
                    onChange={(e) => setSearchStr(e.target.value)}/>
        </Row>

      </Column>
      {!isLoading && <Browser key={0} filteredImages={filteredImages} images={images} updateExifInState={updateExifInState}
                deleteImg={deleteImg}/>}
      {isLoading && <Loading label="building Index..."/>}
    </>
  )
}

export default App
