import React from "react";
import './ExtraNetworks.css'
import $ from "jquery";
import {ANIMATION_SPEED} from "../main/Constants.js";

export function ExtraNetworks() {

  const [width, setWidth] = React.useState(300);
  const [isExpanded, setIsExpanded] = React.useState(false);
  const panel = React.useRef(null);

  const style = {
    marginRight: `-${width}px`,
    width: `${width}px`,
  }

  const handleClick = () => {
    if (!isExpanded) {
      $(panel).animate({"margin-right": `+=${width}`}, ANIMATION_SPEED);
    }
  }

  return (
    <>
      <button onClick={handleClick} id="extra_networks_right_button" className="nevysha lg primary gradio-button">
        <div className="main-btn-label">Extra Networks</div>
      </button>
      <div ref={panel} style={style} id="extra_networks_wrapper" className="nevysha extra-networks-wrapper">

      </div>
    </>
  );
}