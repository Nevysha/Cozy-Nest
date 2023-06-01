import React, {useState} from "react";
import './App.css'
import {svg_magic_wand} from "../main/svg.js";
import {Header} from "./Header.jsx";
import {Column, Row} from "../main/Utils.jsx";





export function App() {

  const [isVisible, setIsVisible] = useState(true)

  const toggle = () => {
    CozyLogger.debug('toggle')
    setIsVisible(!isVisible)
  }

  return (
    <div style={{display: 'flex'}}>
      <button className="nevysha-btn-menu"
              id="nevyui_sh_options"
              title="Nevysha Cozy Nest Settings"
              dangerouslySetInnerHTML={{__html:svg_magic_wand}}
              onClick={toggle}
      />
      { isVisible &&
        <div className="App nevysha">
          <Header onClickClose={() => setIsVisible(false)}/>
          <Row>
            <button>Main Settings</button>
            <button>Image Browser Settings</button>
            <button>Others</button>
          </Row>
          <Column>
            <Row>
              <Row>
                <label>Display information dialog on Cozy Nest error</label>
                <input type="checkbox"/>
              </Row>
              <Row>
                <label>Disable waves and gradiant background animations</label>
                <input type="checkbox"/>
              </Row>
            </Row>
            <Row>
              <label>Main menu position</label>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-hide-hidden" name="radio-filter" value="all" defaultChecked/>
                <label className="cozy-radio-label" htmlFor="radio-hide-hidden">left</label>
              </Row>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-all" name="radio-filter" value="all"/>
                <label className="cozy-radio-label" htmlFor="radio-all">top</label>
              </Row>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-only-hidden" name="radio-filter" value="hidden"/>
                <label className="cozy-radio-label" htmlFor="radio-only-hidden">top centered</label>
              </Row>
            </Row>
            <Row>
              <label>Quicksettings position</label>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-hide-hidden" name="radio-filter" value="all" defaultChecked/>
                <label className="cozy-radio-label" htmlFor="radio-hide-hidden">left</label>
              </Row>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-all" name="radio-filter" value="all"/>
                <label className="cozy-radio-label" htmlFor="radio-all">split</label>
              </Row>
              <Row style={{width: 'auto', alignItems: 'center'}}>
                <input type="radio" id="radio-only-hidden" name="radio-filter" value="hidden"/>
                <label className="cozy-radio-label" htmlFor="radio-only-hidden">centered</label>
              </Row>
            </Row>
          </Column>
        </div>
      }
    </div>
  )
}