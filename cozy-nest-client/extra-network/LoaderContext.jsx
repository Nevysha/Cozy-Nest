import React from 'react';
import {CozyLogger} from "../main/CozyLogger.js";
import DOM_IDS from "../main/dom_ids.js";

export const LoaderContext = React.createContext({
  ready: false,
});

function observeDivChanges(targetDiv, prefix) {
  return new Promise((resolve) => {
    let timer; // Holds the timeout reference

    const observer = new MutationObserver((mutationsList, observer) => {
      clearTimeout(timer); // Clear previous timeout
      timer = setTimeout(() => {
        observer.disconnect(); // Stop observing mutations
        resolve(); // Resolve the Promise
      }, 3000);
    });

    observer.observe(targetDiv, { attributes: true, childList: true, subtree: true });

    // If the initial state of the div is already unchanged, resolve the Promise immediately
    if (!targetDiv.hasChildNodes() && !targetDiv.attributes.length) {
      resolve();
    }
  });
}

async function requireNativeBloc(prefix, resolve) {


  const triggerButton = document.querySelector(`button#${DOM_IDS.get('extra_networks_btn')(prefix)}`)
  triggerButton.style.display = 'none'

  CozyLogger.debug('triggering extra network', prefix)

  const tabs = document.querySelector(`div#${prefix}_extra_networks`)
  tabs.style.display = 'none';

  //for txt2img we need an extra tweak because of the way the DOM / element are built in gradio
  if (prefix === 'txt2img') {
    tabs.parentNode.style.marginBottom = 'calc(var(--layout-gap) * -1)';
  }

  triggerButton.click()
  resolve()

  //setup a mutation observer to detect when the tabs are added
  await observeDivChanges(tabs, prefix)
  // triggerButton.click()
  CozyLogger.debug('tabs loaded', prefix)
}

//we use a local not hook to avoid async issues and double call
const states = {}

export function LoaderProvider({children, prefix, resolve}) {

  const [ready, setReady] = React.useState(false)

  if (!states[prefix]) {
    states[prefix] = {
      loaded: false,
      loading: false,
    }
  }

  React.useEffect(() => {
    const {ready, loading} = states[prefix];
    if (ready || loading) return;

    states[prefix] = {
      loaded: false,
      loading: true,
    };

    (async () => {
      await requireNativeBloc(prefix, resolve)
      states[prefix] = {
        loaded: true,
        loading: false,
      }
      setReady(true)
    })()

  }, [])

  const value = {
    ready,
  }

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  )
}