/**
 * This file is not part of the Vite build process.
 * It MUST NOT use any ES6+ features.
 */

(() => {

  //check if url contains cozy-nest-client. If yes, stop here cause we are in dev mode
  if (window.location.href.includes("cozy-nest-client")) {
    console.log("CozyNest: extension loader in dev mode")
    return
  }

  function jsDynamicLoad(src) {
    return new Promise(function(resolve, reject) {
      const script = document.createElement('script');
      script.type = 'module';
      script.crossorigin = 'crossorigin';
      script.src = src;

      script.onload = function() {
        resolve();
      };

      script.onerror = function() {
        reject(new Error('Failed to load Cozy Nest'));
      };

      document.head.appendChild(script);
    });
  }

  document.addEventListener("DOMContentLoaded", async function() {
    try {

      //check if the param CozyNest=No is present in the url
      const urlParams = new URLSearchParams(window.location.search);
      const cozyNestParam = urlParams.get('CozyNest');
      //if the param is present and set to No,
      // or if url contains #CozyNest=No
      // disable Cozy Nest
      if (cozyNestParam === "No" || window.location.hash.includes("CozyNest=No")) {
        console.log("CozyNest: disabled by url param")
        return;
      }

      // Create a new link element and set its attributes
      const cozyNestCss = document.createElement('link');
      cozyNestCss.rel = 'stylesheet';
      cozyNestCss.type = 'text/css';
      cozyNestCss.href = `/cozy-nest-client/assets/index.css?t=${Date.now()}`;

      // Append the link element to the document head
      document.head.appendChild(cozyNestCss);

      await jsDynamicLoad(`/cozy-nest-client/assets/index.js?t=${Date.now()}`);
      cozyNestLoader();
    }
    catch (err) {
      console.error("Failed to load Cozy Nest", err);
    }
  });
})();

