import React from "react";
import {Row} from "../main/Utils.jsx";
import './App.css'

export function Header (props) {
    return (
      <div className="nevysha header">
        <div className="nevysha title">
          <h2>Nevysha's Cozy Nest</h2>
          <span className="subtitle">Find your cozy spot on Auto1111's webui</span>
        </div>
        <Row className="btn-toolbar">
          <div className="btn" onClick={props.onClickClose}>Close</div>
        </Row>
        <div className="container">
          <div className="nevysha settings-nevyui-top"><p className="nevysha-reporting">Found a bug or want to ask for
            a feature ? Please <a onClick={window.gatherInfoAndShowDialog} href="_blank" target="_blank">click
              here to gather relevant info</a> then use <a href="https://www.reddit.com/r/NevyshaCozyNest/"
                                                           target="_blank">this subreddit</a> or <a
              href="https://github.com/Nevysha/Cozy-Nest" target="_blank">github</a>. You can also join this <a
              href="https://discord.gg/yppzDXjT7S" target="_blank">discord server</a> to discuss about Cozy Nest
          </p><p className="nevysha-emphasis">WARNING : Some visual settings are immediately applied but will not be
            saved until you click "Save"</p></div>
        </div>
      </div>
    );

}