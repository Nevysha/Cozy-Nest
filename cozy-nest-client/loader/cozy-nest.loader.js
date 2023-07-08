/**
 * This file is not part of the Vite build process.
 * It's bundled separately using rollup.
 * It MUST NOT import global js file and only small standalone.
 * This way we can partially load Cozy Nest without impacting the main app.
 *  to check from some environments before starting CozyNest.
 */

import { jsDynamicLoad, isDevMode, hasCozyNestNo } from "../main/cozy-utils-standalone.js";

(() => {

  //check if url contains cozy-nest-client. If yes, stop here cause we are in dev mode
  if (isDevMode()) {
    console.log("CozyNest: extension loader in dev mode")
    return
  }

  if (hasCozyNestNo()) {
    console.log("CozyNest: disabled by url param")
    return;
  }

  document.addEventListener("DOMContentLoaded", async function() {
    try {

      // Create a new link element and set its attributes
      const cozyNestCss = document.createElement('link');
      cozyNestCss.rel = 'stylesheet';
      cozyNestCss.type = 'text/css';
      cozyNestCss.href = `/cozy-nest-client/assets/index.css?t=${Date.now()}`;

      // Append the link element to the document head
      document.head.appendChild(cozyNestCss);

      //loading js file outside of the bundle to avoid impacting the main app if Cozy Nest is disabled
      await jsDynamicLoad(`/cozy-nest-client/assets/index.js?t=${Date.now()}`);
      cozyNestLoader().then(_ => _);
    }
    catch (err) {
      console.error("Failed to load Cozy Nest", err);
    }
  });
})();

