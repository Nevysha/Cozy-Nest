import React from "react";
import ReactDOM from "react-dom/client";
import {ChakraProvider} from "@chakra-ui/react";
import {theme} from "../../chakra/chakra-theme.ts";
import {CozyModalRich, CozyModalSimple} from "./Modal.jsx";

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

    document.body.insertAdjacentHTML("beforeend", _hostCozyModalSimple);
    document.body.insertAdjacentHTML("beforeend", _hostCozyModalRich);

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

    _ready = true;
}

let CozyModal  = {
    prepareReactHost,
};
export default CozyModal