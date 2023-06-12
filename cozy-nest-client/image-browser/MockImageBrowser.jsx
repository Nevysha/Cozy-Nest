import {ReadyState} from "react-use-websocket";
import React from 'react'
import Browser from "./Browser.jsx";
import {Column, Row} from "../main/Utils.jsx";

export function MockImageBrowser() {
    return (
        <>
            <Column>
                <h1 className="cnib-title">Cozy Nest Image Browser <span className="beta-emphasis">beta</span></h1>
                <Row>
                    <span>The WebSocket is currently <span className="connexionStatus" style={{color:'red'}}>Closed</span></span>
                    <button
                        className="nevysha lg primary gradio-button btn"
                        style={{marginLeft: '20px', width: '410px'}}
                        disabled={true}
                    >
                        Image browser is disabled. To enable it, go to the CozyNest settings.
                    </button>
                </Row>

                <textarea data-testid="textbox"
                          placeholder="Search anything : Prompt, Size, Model, ..."
                          rows="1"
                          spellCheck="false"
                          data-gramm="false"
                          disabled={true}/>


            </Column>
            <Browser key={0} imagesRef={[]}/>
        </>
    );
}