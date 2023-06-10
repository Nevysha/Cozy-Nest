import React from 'react';
import {CozyLogger} from "../main/CozyLogger.js";

export const LoaderContext = React.createContext({
  loaded: false,
});

function observeDivChanges(targetDiv) {
  return new Promise((resolve, reject) => {
    let timer; // Holds the timeout reference

    const observer = new MutationObserver((mutationsList, observer) => {
      clearTimeout(timer); // Clear previous timeout
      timer = setTimeout(() => {
        observer.disconnect(); // Stop observing mutations
        resolve(); // Resolve the Promise
      }, 1000);
    });

    observer.observe(targetDiv, { attributes: true, childList: true, subtree: true });

    // If the initial state of the div is already unchanged, resolve the Promise immediately
    if (!targetDiv.hasChildNodes() && !targetDiv.attributes.length) {
      resolve();
    }
  });
}

let loading = false
let loaded = false

async function requireNativeBloc(prefix) {
  const triggerButton = document.querySelector(`button#${prefix}_extra_networks`)

  triggerButton.click()

  const tabs = document.querySelector(`#${prefix}_extra_tabs`)

  //setup a mutation observer to detect when the tabs are added
  await observeDivChanges(tabs)
  CozyLogger.debug('tabs loaded')
  loading = false
  loaded = true
}

export function LoaderProvider({children, prefix}) {

  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    if (loaded || loading) return

    loading = true

    load().then(_=>_)

  }, [])

  const load = async () => {
    await requireNativeBloc(prefix)
    setReady(true)
  }

  const state = {
    loaded,
    ready,
  }

  return (
    <LoaderContext.Provider value={state}>
      {children}
    </LoaderContext.Provider>
  )
}