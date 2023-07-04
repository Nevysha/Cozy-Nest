import React from "react";
import ReactDOM from "react-dom/client";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../../chakra/chakra-theme.ts";
import {CozyModalRich, CozyModalSimple, CozyToast} from "./Modal.jsx";
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

function prepareReactHost() {
    // insert a div at the end of the body
    const _hostCozyModalSimple =
        `<div id="CozyModalSimple"/>`;
    const _hostCozyModalRich =
        `<div id="CozyModalRich"/>`;
    const _hostCozyToast =
        `<div id="CozyToast"/>`;

    document.body.insertAdjacentHTML("beforeend", _hostCozyModalSimple);
    document.body.insertAdjacentHTML("beforeend", _hostCozyModalRich);
    document.body.insertAdjacentHTML("beforeend", _hostCozyToast);

    ReactDOM.createRoot(document.getElementById(`CozyModalSimple`)).render(
        <React.StrictMode>
            <ChakraProvider theme={theme} >
                <CozyModalSimple />
            </ChakraProvider>
        </React.StrictMode>,
    )

    ReactDOM.createRoot(document.getElementById(`CozyModalRich`)).render(
        <React.StrictMode>
            <ChakraProvider theme={theme} >
                <CozyModalRich />
            </ChakraProvider>
        </React.StrictMode>,
    )

    ReactDOM.createRoot(document.getElementById(`CozyToast`)).render(
        <React.StrictMode>
            <ChakraProvider theme={theme} >
                <CozyToast />
            </ChakraProvider>
        </React.StrictMode>,
    )

    _ready = true;
}

let CozyModal  = {
    prepareReactHost,
    showModalSimple: (msg) => EventBus.emit('CozyModalSimple', {msg}),
    showModalRich: () => EventBus.emit('CozyModalRich'),
    showToast: (status, title, msg) => EventBus.emit('CozyToast', {status, title, msg}),
};
//hook on modal event
window.ModalEventBus = EventBus;
window.CozyModal = CozyModal;
export default CozyModal