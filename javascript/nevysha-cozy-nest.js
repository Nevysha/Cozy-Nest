(() => {

  //check if url contains cozy-nest-client. If yes, stop here cause we are in dev mode
  if (window.location.href.includes("cozy-nest-client")) {
    console.log("CozyNest: a1111 loader in dev mode")
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

  // Create a new link element and set its attributes
  const cozyNestCss = document.createElement('link');
  cozyNestCss.rel = 'stylesheet';
  cozyNestCss.type = 'text/css';
  cozyNestCss.href = `/cozy-nest-client/assets/index.css?t=${Date.now()}`;

// Append the link element to the document head
  document.head.appendChild(cozyNestCss);

  document.addEventListener("DOMContentLoaded", async function() {
    try {
      await jsDynamicLoad(`/cozy-nest-client/assets/index.js?t=${Date.now()}`);
      cozyNestLoader();
    }
    catch (err) {
      console.error("Failed to load Cozy Nest", err);
    }
  });
})();

