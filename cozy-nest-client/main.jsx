import 'animate.css';
import '@fontsource-variable/caveat';
import sheet from './main/cozy-nest-style.css?inline' assert { type: 'css' };
import cozyNestModuleLoader, {fetchCozyNestConfig} from './main/nevysha-cozy-nest.js'
import SimpleTimer from "./main/SimpleTimer.js";
import {COZY_NEST_GRADIO_LOAD_DURATION} from "./main/Constants.js";
import {CozyLogger} from "./main/CozyLogger.js";
import {startCozyNestImageBrowser} from "@image-browser/main.jsx";
import startCozyNestSettings from "@settings/main.jsx";
import {
  dummyLoraCard, dummyControlNetBloc, dummySubdirs, getTheme
} from './main/cozy-utils.js';
import startCozyPrompt from "./cozy-prompt/main.jsx";
import {startExtraNetwork} from "./extra-network/main.jsx";
window.CozyTools = {
  dummyLoraCard,
  dummyControlNetBloc,
  dummySubdirs
}



export default async function cozyNestLoader()  {
  await fetchCozyNestConfig();
  await cozyNestModuleLoader(async () => {
    startCozyNestSettings();


    if (COZY_NEST_CONFIG.enable_cozy_prompt === true) {
      startCozyPrompt('txt2img_prompt', 'cozy_nest_prompt_txt2img');
      startCozyPrompt('img2img_prompt', 'cozy_nest_prompt_img2img');
    }
    if (COZY_NEST_CONFIG.enable_extra_network_tweaks === true) {
      await startExtraNetwork('txt2img')
      await startExtraNetwork('img2img')
    }

    startCozyNestImageBrowser();
  });
}

window.cozyNestLoader = cozyNestLoader;

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

  // if (getTheme() === 'dark') {
    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(sheet);
    document.adoptedStyleSheets = [styleSheet];
  // }
  // else {
  //   const {latte} = await import('./main/latte.css?inline');
  //   const styleSheet = new CSSStyleSheet();
  //   styleSheet.replaceSync(sheet);
  //   const latteSheet = new CSSStyleSheet();
  //   latteSheet.replaceSync(latte);
  //   document.adoptedStyleSheets = [styleSheet, latteSheet];
  // }


  SimpleTimer.time(COZY_NEST_GRADIO_LOAD_DURATION);

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




