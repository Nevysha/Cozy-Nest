import React, {useEffect} from "react";
import './ExtraNetworks.css'
import {LoaderContext} from "./LoaderContext.jsx";
import {CozyLogger} from "../main/CozyLogger.js";
import {Loading} from "../image-browser/App.jsx";

let extraNetworksParent = null;
let hasCivitaiHelper = false;

export function ExtraNetworks({prefix}) {

  const nativeCivitaiHelperRefreshId = `civitai-helper-refresh-${prefix}`;

  const ref = React.useRef(null)
  const {ready} = React.useContext(LoaderContext)
  const [civitaiRefreshing, setCivitaiRefreshing] = React.useState(false)

  useEffect(() => {
    if (ready) {
      loadNativeElements()
    }
    return () => {
      unLoad()
    }
  }, [ready])

  function loadNativeElements() {
    if (!ref.current) return

    CozyLogger.debug('loading native elements', prefix)

    const tabs = document.querySelector(`#${prefix}_extra_tabs`)
    extraNetworksParent = tabs.parentNode

    const triggerButton = document.querySelector(`button#${prefix}_extra_networks`)
    triggerButton.style.display = 'none'

    const extraN = document.querySelector(`div#${prefix}_extra_networks`)
    extraN.style.display = 'none';

    //for txt2img we need an extra tweak because of the way the DOM / element are built in gradio
    let civitaiHelperRefresh = document.querySelector(`#civitai-helper-refresh-${prefix}`)

    if (!civitaiHelperRefresh) {
      civitaiHelperRefresh = document.querySelector(`#${prefix}_extra_tabs > .tab-nav`).lastChild

      if (civitaiHelperRefresh.textContent === '🔁') {
        civitaiHelperRefresh.style.display = 'none'
        //clone the button to avoid breaking the original one
        const civitaiHelperRefreshClone = civitaiHelperRefresh.cloneNode(true)
        civitaiHelperRefreshClone.textContent = '🔁'
        civitaiHelperRefreshClone.style.display = 'block'
        civitaiHelperRefreshClone.id = `nevysha-civitai-helper-refresh-${prefix}`
        civitaiHelperRefreshClone.onclick = () => {
          civitaiHelperTweak()
        }
        civitaiHelperRefresh.parentNode.appendChild(civitaiHelperRefreshClone)
        if (!civitaiHelperRefresh.id || civitaiHelperRefresh.id === '') {
          civitaiHelperRefresh.id = nativeCivitaiHelperRefreshId
        }
        else if (civitaiHelperRefresh.id && civitaiHelperRefresh.id !== nativeCivitaiHelperRefreshId) {
          console.error('civitai refresh button has an ID in this probably newer version. You should maybe tell Nevysha because it will likely break extra network tweaks :)')
        }
        hasCivitaiHelper = true
      }
    }

    ref.current.appendChild(tabs)
  }

  function unLoad(strong) {
    if (!ref.current || !extraNetworksParent) return

    strong = strong || false

    CozyLogger.debug('unloading native elements', prefix)

    const tabs = document.querySelector(`#${prefix}_extra_tabs`)

    if (strong) {
      const triggerButton = document.querySelector(`button#${prefix}_extra_networks`)
      triggerButton.style.display = 'block'

      const extraN = document.querySelector(`div#${prefix}_extra_networks`)
      extraN.style.display = 'block';

      if (hasCivitaiHelper) {
        const civitaiHelperRefresh = document.querySelector(`#civitai-helper-refresh-${prefix}`)
        civitaiHelperRefresh.style.display = 'block'
      }
    }


    extraNetworksParent.appendChild(tabs)
  }

  function civitaiHelperTweak() {
    if (!ref.current) return

    CozyLogger.debug('civitai helper tweak', prefix)

    setCivitaiRefreshing(true)

    unLoad()

    const civitaiHelperRefresh = document.querySelector(`#${nativeCivitaiHelperRefreshId}`)
    civitaiHelperRefresh.click()

    setTimeout(() => {
      setCivitaiRefreshing(false)
      loadNativeElements()
    }, 1000)
  }

  return (
    <>
      {(!ready || civitaiRefreshing) && <Loading label="Loading Extra Networks..."/>}
      <div ref={ref} style={{height:'100%'}} />
    </>
  );
}