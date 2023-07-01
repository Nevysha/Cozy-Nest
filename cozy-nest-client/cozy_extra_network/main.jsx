import React from "react";
import ReactDOM from "react-dom/client";
import {CozyLogger} from "../main/CozyLogger.js";
import {CozyExtraNetworks} from "./CozyExtraNetworks.jsx";

export function startCozyExtraNetwork() {
    return new Promise((resolve, reject) => {
        _startExtraNetwork(resolve)
    })
}

function _startExtraNetwork(resolve) {

    CozyLogger.debug('startExtraNetwork')

    if (!document.getElementById(`cozy-extra-network-react`)) {
        CozyLogger.debug('waiting for extra network react')
        setTimeout(() => _startExtraNetwork(), 200)
        return
    }
    resolve()

    ReactDOM.createRoot(document.getElementById(`cozy-extra-network-react`)).render(
        <React.StrictMode>
            <CozyExtraNetworks />
        </React.StrictMode>,
    )
}