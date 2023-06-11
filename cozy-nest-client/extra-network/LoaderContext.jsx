import React from 'react';
import {CozyLogger} from "../main/CozyLogger.js";

export const LoaderContext = React.createContext({
  ready: false,
});

function observeDivChanges(targetDiv) {
  return new Promise((resolve) => {
    let timer; // Holds the timeout reference

    const observer = new MutationObserver((mutationsList, observer) => {
      clearTimeout(timer); // Clear previous timeout
      timer = setTimeout(() => {
        observer.disconnect(); // Stop observing mutations
        resolve(); // Resolve the Promise
      }, 200);
    });

    observer.observe(targetDiv, { attributes: true, childList: true, subtree: true });

    // If the initial state of the div is already unchanged, resolve the Promise immediately
    if (!targetDiv.hasChildNodes() && !targetDiv.attributes.length) {
      resolve();
    }
  });
}

async function requireNativeBloc(prefix) {

  const triggerButton = document.querySelector(`button#${prefix}_extra_networks`)

  CozyLogger.debug('triggering extra network', prefix)

  triggerButton.style.display = 'none'

  triggerButton.click()

  const tabs = document.querySelector(`#${prefix}_extra_tabs`)

  //setup a mutation observer to detect when the tabs are added
  await observeDivChanges(tabs)
  triggerButton.click()
  CozyLogger.debug('tabs loaded', prefix)
}

//we use a local not hook to avoid async issues and double call
const states = {}

export function LoaderProvider({children, prefix}) {

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
      await requireNativeBloc(prefix)
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