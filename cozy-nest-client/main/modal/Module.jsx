import React from "react";
import ReactDOM from "react-dom/client";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../../chakra/chakra-theme.ts";
import {CozyToast} from "./Modal.jsx";
import EventEmitter from 'eventemitter3';

class EventBusClass extends EventEmitter{
    constructor() {
        super();
    }
}
export const EventBus = new EventBusClass();

/**
 * Split Module and Modal.jsx to be able to use hmr
 */

let _ready = false;

async function prepareReactHost() {
    return new Promise((resolve, reject) => {
        _prepareReactHost(resolve);
    })
}

function _prepareReactHost(resolve) {
    // insert a div at the end of the body
    const _hostCozyToast =
        `<div id="CozyToast"/>`;

    document.body.insertAdjacentHTML("beforeend", _hostCozyToast);

    let _isReady = 0;
    let _readyNeed = 0;
    const registerReady = () => {
        _readyNeed++;
        return () => {
            _isReady++;
            if (_isReady === _readyNeed) {
                _ready = true;
                resolve();
            }
        }
    }

    ReactDOM.createRoot(document.getElementById(`CozyToast`)).render(
        <React.StrictMode>
            <ChakraProvider theme={theme} >
                <CozyToast registerReady={registerReady()}/>
            </ChakraProvider>
        </React.StrictMode>,
    )
}

let CozyModal  = {
    prepareReactHost,
    showToast: (status, title, msg, duration) => EventBus.emit('CozyToast', {status, title, msg, duration}),
};
//hook on modal event
window.ModalEventBus = EventBus;
window.CozyModal = CozyModal;
export default CozyModal