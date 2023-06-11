import React from 'react';
import {CozyLogger} from "../main/CozyLogger.js";

export const LoaderContext = React.createContext({
  ready: false,
  loading: false,
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

  triggerButton.click()

  const tabs = document.querySelector(`#${prefix}_extra_tabs`)

  //setup a mutation observer to detect when the tabs are added
  await observeDivChanges(tabs)
  CozyLogger.debug('tabs loaded', prefix)
}

export function LoaderProvider({children, prefix}) {

  const [state, setState] = React.useState({
    loading: false,
    ready: false,
  })

  React.useEffect(() => {
    const {ready, loading} = state;
    if (ready || loading) return;

    setState({
      loading: true,
      ready: false,
    });

    (async () => {
      await requireNativeBloc(prefix, setState)
      setState({
        ready: true,
        loading: false,
      })
    })()

  }, [])

  return (
    <LoaderContext.Provider value={state}>
      {children}
    </LoaderContext.Provider>
  )
}