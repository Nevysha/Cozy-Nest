import React from "react";
import ReactDOM from "react-dom/client";
import {theme} from "../../chakra/chakra-theme.ts";
import {ChakraProvider} from "@chakra-ui/react";

const _ready = false;

function CozyModalSimple() {
    return (
        <div className="CozyModalSimple">
        </div>
    )
}

function CozyModalRich() {
    return (
        <div className="CozyModalRich">
        </div>
    )
}

function prepareReactHost() {
    // insert a div at the end of the body
    const _host =
        `<div id="CozyModalSimple"/>
        <div id="CozyModalRich"/>`;
    document.body.insertAdjacentHTML("beforeend", _host);

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
}

let CozyModal  = {
    prepareReactHost,
};
export default CozyModal
