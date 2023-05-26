import 'animate.css';
import '@fontsource-variable/caveat';

import sheet from './main/cozy-nest-style.css?inline' assert { type: 'css' };


import {
  dummyLoraCard, dummyControlNetBloc, dummySubdirs
} from './main/cozy-utils.js';
window.CozyTools = {
  dummyLoraCard,
  dummyControlNetBloc,
  dummySubdirs
}

import cozyNestLoader from './main/nevysha-cozy-nest.js'
import SimpleTimer from "./main/SimpleTimer.js";
import {COZY_NEST_GRADIO_LOAD_DURATION} from "./main/Constants.js";
import {CozyLogger} from "./main/CozyLogger.js";

(async () => {
  //check if the param CozyNest=No is present in the url
  const urlParams = new URLSearchParams(window.location.search);
  const cozyNestParam = urlParams.get('CozyNest');
  if (cozyNestParam === "No") {
    CozyLogger.log("Cozy Nest disabled by url param")
    //remove the css with Cozy-Nest in the url
    document.querySelectorAll('link').forEach(link => {
      if (link.href.includes("Cozy-Nest")) link.remove()
    })
    return
  }

  const styleSheet = new CSSStyleSheet();
  styleSheet.replaceSync(sheet);
  document.adoptedStyleSheets = [styleSheet];

  SimpleTimer.time(COZY_NEST_GRADIO_LOAD_DURATION);

  // Cozy-Nest-Image-Browser link
  const cozyNestImageBrowserLink = document.createElement('link');
  cozyNestImageBrowserLink.rel = 'stylesheet';
  cozyNestImageBrowserLink.type = 'text/css';
  cozyNestImageBrowserLink.href = `file=extensions/Cozy-Nest/cozy-nest-image-browser/assets/index.css?t=${Date.now()}`;

  // Append the link element to the document head
  document.head.appendChild(cozyNestImageBrowserLink);

  if (import.meta.env.VITE_CONTEXT === 'DEV') {
    CozyLogger.debug('DEV MODE');
    document.addEventListener("DOMContentLoaded", function() {
      cozyNestLoader();
    })
  }
  else {
    CozyLogger.init(false);
  }
})();




