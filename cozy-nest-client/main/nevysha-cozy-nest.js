import showdown from 'showdown/dist/showdown.js';
import $ from "jquery";
window.$ = window.jQuery = $;

import SimpleTimer from "./SimpleTimer.js";
import {getTheme, isUpToDate, getLuminance, findNearestParent} from './cozy-utils.js';
import {
  COZY_NEST_DOM_TWEAK_LOAD_DURATION,
  COZY_NEST_GRADIO_LOAD_DURATION,
  SETTINGS_MIN_WIDTH,
  RESULT_MIN_WIDTH,
  ANIMATION_SPEED,
  WEBUI_UNKNOWN, WEBUI_SDNEXT, WEBUI_A1111
} from "./Constants.js";
import Loading from "./Loading.js";

import {waves, svg_update_info} from "./svg.js";
import {
  wrapDataGenerationInfo, wrapSettings, createVerticalLineComp, recalcOffsetFromMenuHeight
} from "./tweaks/various-tweaks.js";
import {
  setupPopupInstanceInfo,
  populateInstanceInfoDialog,
  showInstanceInfoDialog
} from "./tweaks/troubleshot-dialog.js";
import {CozyLogger} from "./CozyLogger.js";
import clearGeneratedImage from './tweaks/clear-generated-image.js'
import {createAlertDiv, showAlert} from "./tweaks/cozy-alert.js";
import DOM_IDS from "./dom_ids.js";
import CozyNestEventBus from "@main/CozyNestEventBus.js";


const addDraggable = ({prefix}) => {

  const settings = document.getElementById(`${prefix}_settings`);

  //change min-width to min(420px, 100%)
  settings.style.minWidth = `min(${SETTINGS_MIN_WIDTH}px, 100%)`

  // Create a new vertical line element
  const lineWrapper = createVerticalLineComp();

  // Insert the line element after the settings element
  settings.insertAdjacentElement('afterend', lineWrapper);

  const container = settings.parentElement;
  container.classList.add('nevysha', 'resizable-children-container');
  const results = document.getElementById(`${prefix}_results`);

  //change min-width to 320px
  settings.style.minWidth = `min(${RESULT_MIN_WIDTH}px, 100%)`;

  //get linePosition from local storage
  let linePosition = localStorage.getItem(`${prefix}_linePosition`);
  if (!linePosition) {
    linePosition = 50;
    localStorage.setItem(`${prefix}_linePosition`, `${linePosition}`);
  }
  settings.style.flexBasis = `${linePosition}%`;
  results.style.flexBasis = `${100 - linePosition}%`;

  let isDragging = false;

  lineWrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    //calc the offset of the tab
    const tab = document.querySelector(`#tab_${prefix}`);
    let offsetX = tab.offsetLeft;
    let parent = tab.offsetParent;

    while (parent) {
      offsetX += parent.offsetLeft;
      parent = parent.offsetParent;
    }

    const containerWidth = container.offsetWidth;
    const mouseX = event.clientX;
    const linePosition = ((mouseX - offsetX) / containerWidth) * 100;

    //if settings width is min, return
    if (linePosition <= SETTINGS_MIN_WIDTH / containerWidth * 100) {
      return;
    }
    //if results width is min, return
    if (linePosition >= (1 - RESULT_MIN_WIDTH / containerWidth) * 100) {
      return;
    }

    //save linePosition to local storage
    localStorage.setItem(`${prefix}_linePosition`, `${linePosition}`);

    settings.style.flexBasis = `${linePosition}%`;
    results.style.flexBasis = `${100 - linePosition}%`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

const tweakButtonsIcons = () => {
  document.querySelectorAll('button').forEach((button) => {
    if (button.textContent.includes('📂')) {
      // Add SVG element to the SVG container here
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z"/></svg>';
    }
    if (button.textContent.includes('🔄')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M142.9 142.9c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5c0 0 0 0 0 0H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5c7.7-21.8 20.2-42.3 37.8-59.8zM16 312v7.6 .7V440c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l41.6-41.6c87.6 86.5 228.7 86.2 315.8-1c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.2 62.2-162.7 62.5-225.3 1L185 329c6.9-6.9 8.9-17.2 5.2-26.2s-12.5-14.8-22.2-14.8H48.4h-.7H40c-13.3 0-24 10.7-24 24z"/></svg>';
    }
    if (button.textContent.includes('↙️')) {
      button.innerHTML = '<svg class="nevysha svg-icon rotate" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>';
    }
    if (button.textContent.includes('🗑️')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>';
    }
    if (button.textContent.includes('🎴')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>';
    }
    if (button.textContent.includes('📋')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>';
    }
    if (button.textContent.includes('💾')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M48 96V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V170.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H309.5c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8V184c0 13.3-10.7 24-24 24H104c-13.3 0-24-10.7-24-24V80H64c-8.8 0-16 7.2-16 16zm80-16v80H272V80H128zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"/></svg>';
    }
    if (button.textContent.includes('🎲️')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M592 192H473.26c12.69 29.59 7.12 65.2-17 89.32L320 417.58V464c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48V240c0-26.51-21.49-48-48-48zM480 376c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm-46.37-186.7L258.7 14.37c-19.16-19.16-50.23-19.16-69.39 0L14.37 189.3c-19.16 19.16-19.16 50.23 0 69.39L189.3 433.63c19.16 19.16 50.23 19.16 69.39 0L433.63 258.7c19.16-19.17 19.16-50.24 0-69.4zM96 248c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm0-128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24zm128 128c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"/></svg>';
    }
    if (button.textContent.includes('♻️')) {
      button.innerHTML = '<svg class="nevysha svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M174.7 45.1C192.2 17 223 0 256 0s63.8 17 81.3 45.1l38.6 61.7 27-15.6c8.4-4.9 18.9-4.2 26.6 1.7s11.1 15.9 8.6 25.3l-23.4 87.4c-3.4 12.8-16.6 20.4-29.4 17l-87.4-23.4c-9.4-2.5-16.3-10.4-17.6-20s3.4-19.1 11.8-23.9l28.4-16.4L283 79c-5.8-9.3-16-15-27-15s-21.2 5.7-27 15l-17.5 28c-9.2 14.8-28.6 19.5-43.6 10.5c-15.3-9.2-20.2-29.2-10.7-44.4l17.5-28zM429.5 251.9c15-9 34.4-4.3 43.6 10.5l24.4 39.1c9.4 15.1 14.4 32.4 14.6 50.2c.3 53.1-42.7 96.4-95.8 96.4L320 448v32c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-64-64c-9.4-9.4-9.4-24.6 0-33.9l64-64c6.9-6.9 17.2-8.9 26.2-5.2s14.8 12.5 14.8 22.2v32l96.2 0c17.6 0 31.9-14.4 31.8-32c0-5.9-1.7-11.7-4.8-16.7l-24.4-39.1c-9.5-15.2-4.7-35.2 10.7-44.4zm-364.6-31L36 204.2c-8.4-4.9-13.1-14.3-11.8-23.9s8.2-17.5 17.6-20l87.4-23.4c12.8-3.4 26 4.2 29.4 17L182 241.2c2.5 9.4-.9 19.3-8.6 25.3s-18.2 6.6-26.6 1.7l-26.5-15.3L68.8 335.3c-3.1 5-4.8 10.8-4.8 16.7c-.1 17.6 14.2 32 31.8 32l32.2 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-32.2 0C42.7 448-.3 404.8 0 351.6c.1-17.8 5.1-35.1 14.6-50.2l50.3-80.5z"/></svg>';
    }
  });
}

function tweakInpainting() {

  //expend button
  const img2maskimg = document.getElementById("img2maskimg")
  const expendBtn = document.createElement("button")
  expendBtn.setAttribute("id", "expendBtn")
  expendBtn.setAttribute("class", "nevysha lg primary gradio-button btn")
  expendBtn.textContent = "Expand"
  img2maskimg.insertAdjacentElement("beforeend", expendBtn)

  const inpaintTab = document.getElementById("img2maskimg");
  let defaultStyle = inpaintTab.getAttribute("style");
  let nodesCanvasData = []
  let expended = false;
  expendBtn.addEventListener("click", () => {

    if (!document.querySelectorAll("canvas")) {
      return;
    }

    if (!expended) {
      expendBtn.textContent = "Reduce"
      expendBtn.style.position = "fixed";
      inpaintTab.style.position = "fixed";
      inpaintTab.style.zIndex = 999
      inpaintTab.style.top = "5px";
      inpaintTab.style.left = "5px";
      inpaintTab.style.width = "calc(100vw - 10px)";
      inpaintTab.style.height = "calc(100vh - 10px)";
      inpaintTab.style.overflow = "";

      //hide button to delete image
      //this button is inside #img2maskimg > .image-container
      //it's the third button
      document.querySelector('#img2maskimg > .image-container').querySelector("button:nth-child(3)").style.display = "none"

      //apply to canvas
      const nodesCanvas = document.querySelectorAll("canvas")
      nodesCanvasData = [];
      nodesCanvas.forEach((canvas) => {
        let canvasId = `nevysha-${canvas.getAttribute("key")}-canvas`;
        canvas.setAttribute('id',canvasId)
        canvas.classList.add("nevysha")
        nodesCanvasData.push({
          id: canvasId,
          defaultStyle: canvas.getAttribute("style"),
        })

        canvas.style.maxWidth = "calc(100vw - 20px)";
        canvas.style.width = "";
        canvas.style.maxHeight = "calc(100vh - 20px)";
        canvas.style.height = "";
      })

    } else {
      expendBtn.textContent = "Expand"
      expendBtn.style.position = "absolute";
      inpaintTab.setAttribute("style", defaultStyle);

      document.querySelector('#img2maskimg > .image-container').querySelector("button:nth-child(3)").style.display = "block"

      //revert canvas
      nodesCanvasData.forEach((canvasData) => {
        const canvas = document.getElementById(canvasData.id)
        canvas.setAttribute("style", canvasData.defaultStyle);
      })
    }
    expended = !expended;

  })
}

function addScrollable(bundle) {
  document.getElementById(`${bundle.prefix}_gallery_container`).classList.add("nevysha","nevysha-scrollable")
}

function tweakAWQ() {

  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const addedNodes = Array.from(mutation.addedNodes);
        const targetNode = addedNodes.find(node => node.id === 'AWQ-container');
        if (targetNode) {
          observer.disconnect();
          closure();
          break;
        }
      }
    }
  });

  const observerConfig = {
    childList: true,
    subtree: true
  };

  observer.observe(document.documentElement, observerConfig);

  const closure = () => {
    const awqContainer = document.querySelector("#AWQ-container")

    //create a wrapper div
    const awqWrapper = document.createElement("div")
    awqWrapper.id = "nevysha_awq_wrapper"
    awqWrapper.style.zIndex = "9999"
    awqWrapper.style.display = "none"
    awqWrapper.style.position = "fixed"
    awqWrapper.style.bottom = "30px"
    document.body.appendChild(awqWrapper)

    //bush awqContainer into wrapper
    awqWrapper.appendChild(awqContainer)

    const btnAWQ = document.createElement("button")
    btnAWQ.classList.add("nevysha-btn-menu", "nevysha-btn-menu-awq", "gradio-button", "primary", "nevysha")
    btnAWQ.id = "nevyui_awq_btn"
    btnAWQ.innerHTML = 'Show/Hide AWQ'
    btnAWQ.title = "Show/Hide AWQ"
    btnAWQ.setAttribute("style", "position: fixed; bottom: 0; left: calc(50% - 75px); width: 150px;")

    document.querySelector('div.app').insertAdjacentElement('beforeend', btnAWQ)
    btnAWQ.addEventListener("click", () => {
      if (awqWrapper.style.display === "none") {
        awqWrapper.style.display = "block"
      } else {
        awqWrapper.style.display = "none"
      }
    });
  }
}

const addCozyNestCustomBtn = () => {
  //create a wrapper div
  const nevySettingstabMenuWrapper = document.createElement("div");
  nevySettingstabMenuWrapper.classList.add("nevysha-btn-menu-wrapper");
  nevySettingstabMenuWrapper.id = "nevysha-btn-menu-wrapper";

  //add a new button in the tabnav
  const updateInfoBtn = `<button class="nevysha-btn-menu" id="nevyui_update_info" title="Nevysha Cozy Nest Update Info">${svg_update_info}</button>`;
  nevySettingstabMenuWrapper.insertAdjacentHTML('beforeend', updateInfoBtn);
  //add the wrapper div in the tabnav
  document.querySelector("#tabs > div.tab-nav").insertAdjacentElement('beforeend', nevySettingstabMenuWrapper);

  //create a div that will contain a dialog
  //create a wrapper div
  const updateTab = document.createElement("div");
  updateTab.classList.add("nevysha-update-tab", "nevysha", "nevysha-tab", "nevysha-tab-settings");
  updateTab.id = "nevyui_update_info_panel";
  updateTab.style = "display: none;";
  document.querySelector("#tabs").insertAdjacentElement("beforeend", updateTab)

  // add click event to the new update info button
  function listenerClosure() {
    let shown = false;
    document.querySelector("#nevyui_update_info").addEventListener("click", (e) => {
      //cancel event
      e.preventDefault();
      e.stopPropagation();

      //show tab_nevyui by default to bypass gradio hidding tabs
      document.querySelector("#tab_nevyui").style.display = "block";

      //toggle the panel with a slide animation using jquery
      if (shown) {
        $("#nevyui_update_info_panel").slideUp(ANIMATION_SPEED);
      } else {
        $("#nevyui_update_info_panel").slideDown(ANIMATION_SPEED);
      }
      shown = !shown;
    });
  }
  listenerClosure();

  //fetch version_data.json
  loadVersionData().then(ignored => ignored)
}

async function loadVersionData() {

  const current_version_data = await (await fetch(`file=extensions/Cozy-Nest/version_data.json?${new Date()}`)).json()
  const remote_version_data = await (await fetch(`https://raw.githubusercontent.com/Nevysha/Cozy-Nest/main/version_data.json?${new Date()}`)).json()

  let remote_patchnote = await (await fetch(`https://raw.githubusercontent.com/Nevysha/Cozy-Nest/main/PATCHNOTE.md?t=${new Date()}`)).text();
  //insert "Patchnote" title div
  let patchnoteTitle = `<div class="nevysha-tabnav nevysha-tabnav-settings"><h2 class="nevysha-tabnav-title">Patchnote [${remote_version_data.version}]</h2></div>`;
  //if local version si higher than remote version, fetch from local file (for dev purpose)
  if (import.meta.env.VITE_CONTEXT === 'DEV' && isUpToDate(current_version_data.version, remote_version_data.version)) {
    remote_patchnote = await (await fetch(`file=extensions/Cozy-Nest/PATCHNOTE.md?t=${new Date()}`)).text();
    patchnoteTitle = `<div class="nevysha-tabnav nevysha-tabnav-settings"><h2 class="nevysha-tabnav-title">Patchnote [${current_version_data.version}_DEV]</h2></div>`;
  }

  document.querySelector("#nevyui_update_info_panel").insertAdjacentHTML('beforeend', patchnoteTitle);

  //regex to replace [x] with a checkmark
  const regex = /\[x\]/g;
  remote_patchnote = remote_patchnote.replace(regex, ""); //TODO NEVYSHA add icon ?

  //regex to replace [ ] with a cross
  const regex2 = /\[ \]/g;
  remote_patchnote = remote_patchnote.replace(regex2, ""); //TODO NEVYSHA add icon ?


  const converter = new showdown.Converter();

  const article = `<article class="markdown-body nevysha nevysha-scrollable">${converter.makeHtml(remote_patchnote)}</article>`
  document.querySelector('#nevyui_update_info_panel').insertAdjacentHTML('beforeend', article)

  //create a div that will contain info related to version compliance
  const versionInfo = document.createElement("div");
  versionInfo.classList.add("nevysha-version-info", "nevysha-emphasis");
  versionInfo.id = "nevysha-version-info";
  //add div to the beginning of the updateTab
  document.querySelector('#nevyui_update_info_panel').insertAdjacentElement('afterbegin', versionInfo)

  //add a button to update the extension
  const updateBtn =
      `<button class="nevysha-btn-menu lg primary gradio-button nevysha generate-button" id="nevyui_update_btn" title="Update Cozy Nest">Update</button>`;
  document.querySelector('#nevysha-version-info').insertAdjacentHTML('beforeend', updateBtn)
  document.querySelector('#nevyui_update_btn').addEventListener('click', (e) => {
    //prevent default behavior
    e.preventDefault();
    e.stopPropagation();

    //trigger click on nevyui_sh_options_update button
    document.querySelector('#nevyui_sh_options_update').click()
    //wait for 5s and trigger reloadUI by clicking settings_restart_gradio button
    //change nevyui_update_btn to Update in progress
    document.querySelector('#nevyui_update_btn').innerHTML = "Update in progress..."
    setTimeout(() => {
        document.querySelector('#settings_restart_gradio').click()
    }, 5000);
  });

  //compare versions and display info
  if (isUpToDate(current_version_data.version, remote_version_data.version)) {
    //versions are the same
    const p = `<p class="nevysha-version-info-text">You are up to date! (installed: v${current_version_data.version})</p>`
    //add p to the beginning of nevysha-version-info
    document.querySelector('#nevysha-version-info').insertAdjacentHTML('afterbegin', p)
    //hide update button
    document.querySelector('#nevyui_update_btn').style.display = "none";
    //add version info to the bottom-right corner (no update available)
    document.getElementsByClassName("versions")[0].innerHTML += '⠀•⠀Cozy Nest: <a href="https://github.com/Nevysha/Cozy-Nest" target="_blank">⠀v' + current_version_data.version + '</a>';
  }
  else {
    //local version is older than remote version
    const p = `<p class="nevysha-version-info-text">An update is available! (installed: v${current_version_data.version}, new : v${remote_version_data.version})</p>`
    //add p to the end of nevysha-version-info
    document.querySelector('#nevysha-version-info').insertAdjacentHTML('afterbegin', p)

    //set fill color of .nevysha-btn-menu-wrapper > button > svg to red
    document.querySelector('#nevyui_update_info > svg').style.fill = "red";

    //add version info to the bottom-right corner with a notice about an update
    document.getElementsByClassName("versions")[0].innerHTML += '⠀•⠀Cozy Nest:⠀<span style="color: #f9e02d; text-decoration: underline;" title="Nevysha\'s Cozy Nest Update Available! Latest version: v' + remote_version_data.version + '.\nView update info in the top-right corner for more details.">v' + current_version_data.version + '</span>';
  }

  //add close button
  const closeBtn = `<button class="nevysha-btn-menu lg primary gradio-button nevysha generate-button" id="nevyui_update_info_close_btn" title="Close">Close</button>`;
  document.querySelector('#nevysha-version-info').insertAdjacentHTML('afterbegin', closeBtn)
  document.querySelector('#nevyui_update_info_close_btn').addEventListener('click', (e) => {
    //prevent default behavior
    e.preventDefault();
    e.stopPropagation();

    document.querySelector('#nevyui_update_info').click();
  });

}

const addTabWrapper = () => {
  const tabWrapper = document.createElement('button');
  //add tabWrapper after the gradio tab
  const gradioTab = document.querySelector(`div#tabs > .tab-nav`);

  tabWrapper.setAttribute('id', `nevysha_tab_wrapper`);
  tabWrapper.classList.add('nevysha', 'tab-wrapper',);

  //retrive the svelte random class from the gradioTab.firstChild css class. it start with "svelte-"
  gradioTab.querySelector('button').classList.forEach((className) => {
    if (className.startsWith('svelte-')) {
      tabWrapper.classList.add(className);
    }
  })

  tabWrapper.innerHTML = `Others`;

  //insert before nevysha-btn-menu-wrapper
  gradioTab.insertBefore(tabWrapper, gradioTab.lastChild);

  //create a div that will hold the other tabs
  const otherTabs = document.createElement('div');
  otherTabs.setAttribute('id', `nevysha_other_tabs`);
  otherTabs.classList.add('nevysha', 'other-tabs',);
  otherTabs.style.display = 'none';
  //add at the end of div#tabs
  tabWrapper.appendChild(otherTabs);


  //show floating div when click on tabWrapper
  let shown = false;
  tabWrapper.addEventListener('click', (e) => {
    //cancel event
    e.preventDefault();
    e.stopPropagation();

    //toggle the display of the floating div
    //toggle the panel with a slide animation using jquery
    if (shown) {
      $("#nevysha_other_tabs").slideUp(100);
    } else {
      $("#nevysha_other_tabs").slideDown(200);
    }
    shown = !shown;
  });

  //go through all the tabs button in gradioTab and add a drag event listener
  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  function dragEnd(event) {
    //add tab in moved tab array in local storage
    const movedTabs = JSON.parse(localStorage.getItem('nevysha_moved_tabs')) || [];
    //check if the tab is already in the array
    if (!movedTabs.includes(event.target.id)) {
      movedTabs.push(event.target.id);
      localStorage.setItem('nevysha_moved_tabs', JSON.stringify(movedTabs));
    }
  }

  function dragOver(event) {
    event.preventDefault();
  }

  function cloneAndPush(tab) {

    //check if the tab is not already in the otherTabs
    if (otherTabs.querySelector(`button #${tab.id}`)) {
      return;
    }

    const newTab = document.createElement('button');
    newTab.setAttribute('id', tab.id);
    newTab.classList.add('nevysha', 'tab-nav', 'nevysha-other-tab');
    // newTab.innerHTML = `<span id="remove-${tab.id}" class="remove-nevysha-other-tab">X</span><span class="nevysha-other-tab-text">${tab.innerHTML}</span>`;
    newTab.setAttribute('draggable', true);
    newTab.addEventListener("dragstart", dragStart);
    newTab.addEventListener("dragend", dragEnd);
    newTab.addEventListener("click", (e) => {
      //cancel event
      e.preventDefault();
      e.stopPropagation();

      document.querySelector(`div#tabs > .tab-nav > #${tab.id}`).click();
      //hide the floating div
      $("#nevysha_other_tabs").slideUp();
      shown = !shown;
    });
    tab.style.display = 'none';
    //add the new tab to the otherTabs
    otherTabs.appendChild(newTab);
    const removeBtn = document.createElement('span');
    removeBtn.setAttribute('id', `remove-${tab.id}`);
    removeBtn.classList.add('remove-nevysha-other-tab');
    removeBtn.innerHTML = 'X';
    removeBtn.addEventListener('click', (e) => {
      //cancel event
      e.preventDefault();
      e.stopPropagation();

      //remove the tab from the otherTabs
      otherTabs.removeChild(newTab);
      //show the original tab
      document.querySelector(`div#tabs > .tab-nav > #${tab.id}`).style.display = 'block';
      //remove the tab from the moved tab array in local storage
      const movedTabs = JSON.parse(localStorage.getItem('nevysha_moved_tabs')) || [];
      const index = movedTabs.indexOf(tab.id);
      if (index > -1) {
          movedTabs.splice(index, 1);
      }
      localStorage.setItem('nevysha_moved_tabs', JSON.stringify(movedTabs));
    });
    newTab.appendChild(removeBtn);
    const tabText = document.createElement('span');
    tabText.classList.add('nevysha-other-tab-text');
    tabText.innerHTML = tab.innerHTML;
    newTab.appendChild(tabText);
  }

  function drop(event) {
    event.preventDefault();

    //create a new tab with the same content as the original tab and hide the original tab
    const tab = document.querySelector(`button#${event.dataTransfer.getData("text/plain")}`);
    cloneAndPush(tab);
    shown = !shown;
  }

  otherTabs.addEventListener("dragover", dragOver);
  otherTabs.addEventListener("drop", drop);

  const tabs = gradioTab.querySelectorAll('button');

  function addHandlerToTab(tab) {
    //skip the tabWrapper
    if (tab.id
      // below : some tabs have no inner text, skip them
      || !tab.innerText) {
      return;
    }

    // set an id for the tab from its text
    tab.id =
      tab.innerText.toLowerCase()
        //remove all non-alphanumeric characters
        .replace(/\s/g, '_')
        //remove numbers
        .replace(/[0-9]/g, '')

    //set draggable to true
    tab.setAttribute('draggable', true);

    tab.addEventListener("dragstart", dragStart);
    tab.addEventListener("dragend", dragEnd);
  }

  tabs.forEach((tab) => {
    addHandlerToTab(tab);
    //check if tab is marked as moved in local storage
    const movedTabs = JSON.parse(localStorage.getItem('nevysha_moved_tabs')) || [];
    if (movedTabs.includes(tab.id)) {
      cloneAndPush(tab)
    }
  });

  //add a MutableObserver on gradioTab to handle gradio deleting and recreating the tab when it is clicked
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type !== 'childList') return
      if (mutation.addedNodes.length === 0) return

      const tab = mutation.addedNodes[0];
      addHandlerToTab(tab);

      //check if tab is marked as moved in local storage
      const movedTabs = JSON.parse(localStorage.getItem('nevysha_moved_tabs')) || [];
      if (movedTabs.includes(tab.id)) {
        tab.style.display = 'none';
        cloneAndPush(tab)
      }
    });
  });
  //observe on added nodes
  const config = { attributes: false, childList: true, subtree: false };
  observer.observe(gradioTab, config);

}

function buildRightSlidePanelFor(label, buttonLabel, rightPanBtnWrapper, tab, prefix) {
  const cozyImgBrowserBtn = document.createElement('button');
  cozyImgBrowserBtn.setAttribute('id', `${label}_right_button`);
  cozyImgBrowserBtn.classList.add('nevysha', 'lg', 'primary', 'gradio-button');
  cozyImgBrowserBtn.innerHTML = `<div>${buttonLabel}</div>`;
  rightPanBtnWrapper.appendChild(cozyImgBrowserBtn);

  //create a panel to display Cozy Image Browser
  const cozyImgBrowserPanel =
    `<div id="${label}_panel" class="nevysha slide-right-browser-panel" style="display: none">
      <div class="nevysha slide-right-browser-panel-container nevysha-scrollable ${label}_panel_inner">
        <div class="nevysha" id="${label}-react"/>
      </div>
    </div>`;
  //add the panel to the end of the tab
  tab.insertAdjacentHTML('beforeend', cozyImgBrowserPanel);

  // Create a vertical line component
  const lineWrapper = createVerticalLineComp();
  const cozyImgBrowserPanelWrapper = document.querySelector(`#${label}_panel`);
  //set cozyImgBrowserPanelWrapper.style.width from local storage value if it exists
  const cozyImgBrowserPanelWidth = localStorage.getItem(`${label}_panelWidth`);
  if (cozyImgBrowserPanelWidth) {
    cozyImgBrowserPanelWrapper.style.width = cozyImgBrowserPanelWidth;
  }
  else {
    //get window width
    const width = window.innerWidth;
    cozyImgBrowserPanelWrapper.style.width = `${Math.round(width / 2)}px`;
  }
  cozyImgBrowserPanelWrapper.appendChild(lineWrapper)

  //add a close button inside the line
  const closeCozyImgBrowser = document.createElement('button');
  closeCozyImgBrowser.setAttribute('id', `floating_close_${label}__panel_button`);
  //add button class
  closeCozyImgBrowser.classList.add('nevysha', 'lg', 'primary', 'gradio-button', 'nevysha-extra-network-floating-btn');
  closeCozyImgBrowser.innerHTML = '<div>Close</div>';
  //click the original button to close the extra network
  closeCozyImgBrowser.addEventListener('click', (e) => {
    cozyImgBrowserBtn.click();
  });
  //add the button at the begining of the div
  lineWrapper.insertBefore(closeCozyImgBrowser, lineWrapper.firstChild);
  //Add an event listener to the resizer element to track mouse movement
  lineWrapper.addEventListener('mousedown', function (e) {
    e.preventDefault();

    // Set the initial values for the width and height of the container
    let width = cozyImgBrowserPanelWrapper.offsetWidth;

    // Set the initial mouse position
    let x = e.clientX;

    // Track mouse movement while dragging
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function drag(e) {
      // Calculate the difference in mouse position
      const diffX = e.clientX - x;

      // Update the container's width
      cozyImgBrowserPanelWrapper.style.width = (width - diffX) + 'px';
    }

    function stopDrag() {

      //save the new width in local storage
      localStorage.setItem(`${label}_panelWidth`, cozyImgBrowserPanelWrapper.style.width);

      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }
  });

  function toggle() {
    const panel = document.querySelector(`#${label}_panel`);
    if (panel.style.display === 'none') {
      panel.style.display = 'flex'
      panel.style.marginRight = `-${panel.offsetWidth}px`;
      $(panel).animate({"margin-right": `+=${panel.offsetWidth}`}, ANIMATION_SPEED);
    } else {
      $(panel).animate({"margin-right": `-=${panel.offsetWidth}`}, ANIMATION_SPEED, () => {
        panel.style.display = 'none'
      });
    }
  }
  function close() {
    const panel = document.querySelector(`#${label}_panel`);
    if (panel.style.display !== 'none') {
      $(panel).animate({"margin-right": `-=${panel.offsetWidth}`}, 150, () => {
        panel.style.display = 'none'
      });
    }
  }
  function isOpen() {
    const panel = document.querySelector(`#${label}_panel`);
    return panel.style.display !== 'none';
  }

  rightPanelsHandler[label] = {
    toggle,
    close,
    isOpen
  };

  //add listener to open or close the panel using jquery animate
  cozyImgBrowserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    CozyNestEventBus.emit(`extra_network-open:${prefix}`, prefix);
    toggle();
  })
}

let rightPanelsHandler = {};

function createRightWrapperDiv() {

  rightPanelsHandler = {};

  const tab = document.querySelector(`div#tabs`);

  //create wrapper div for the button
  const rightPanBtnWrapper = document.createElement('div');
  rightPanBtnWrapper.setAttribute('id', `right_button_wrapper`);
  rightPanBtnWrapper.classList.add('nevysha', 'nevysha-right-button-wrapper');
  //add button to the begining of the tab
  tab.insertAdjacentElement('beforeend', rightPanBtnWrapper);

  if (COZY_NEST_CONFIG.enable_extra_network_tweaks === true) {
    buildRightSlidePanelFor('cozy-txt2img-extra-network', 'Extra Networks'
      , rightPanBtnWrapper, tab, 'txt2img');
    document.getElementById('cozy-txt2img-extra-network-react').classList.add('cozy-extra-network')

    buildRightSlidePanelFor('cozy-img2img-extra-network', 'Extra Network'
      , rightPanBtnWrapper, tab, 'img2img');
    document.getElementById('cozy-img2img-extra-network-react').classList.add('cozy-extra-network')
    document.querySelector(`#cozy-img2img-extra-network_right_button`).style.display = 'none';
  }
  if (COZY_NEST_CONFIG.enable_cozy_extra_networks === true) {
    //Cozy Nest reimplementation of extra networks
    //if both are enabled, we use the Cozy Extra Networks label
    const buttonLabel = COZY_NEST_CONFIG.enable_extra_network_tweaks ? 'Cozy Extra Networks' : 'Extra Networks';
    buildRightSlidePanelFor('cozy-extra-network', buttonLabel, rightPanBtnWrapper, tab);
  }
  if (COZY_NEST_CONFIG.disable_image_browser !== true) {
    buildRightSlidePanelFor('cozy-img-browser', 'Cozy Image Browser', rightPanBtnWrapper, tab);
  }

  //close all panels if one is open when user press escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      Object.values(rightPanelsHandler).forEach((handler) => {
        if (handler.isOpen()) {
          e.preventDefault();
          e.stopPropagation();
          handler.close();
        }
      })
    }
  })
}

function setButtonVisibilityFromCurrentTab(id) {
  CozyLogger.debug(`setButtonVisibilityFromCurrentTab(${id})`);

  document.querySelector(`#cozy-txt2img-extra-network_right_button`).style.display = 'none';
  document.querySelector(`#cozy-img2img-extra-network_right_button`).style.display = 'none';

  if (id === 'tab_txt2img') {
    document.querySelector(`#cozy-txt2img-extra-network_right_button`).style.display = 'flex';
  }
  else if (id === 'tab_img2img') {
    document.querySelector(`#cozy-img2img-extra-network_right_button`).style.display = 'flex';
  }
}

function errorPipe(data) {
  populateInstanceInfoDialog();
  document.querySelector('#cozy_nest_error_handling_display').innerHTML = `An error in socket handler`;
  document.querySelector('#cozy_nest_error_handling_display_stack').innerHTML = data.error;
  document.querySelector('#cozy_nest_error_handling_display_stack').setAttribute('style', 'display: block;');
  showInstanceInfoDialog();
}
window.errorPipe = errorPipe;

async function sendToPipe(where, elemImgFrom) {

  class FakeDataTransfer {
    constructor(imgFromBlob) {
      this.files = [imgFromBlob];
    }
  }

  // let elemImgFrom = document.querySelector("#cozy-img-browser-react > div.browser.nevysha.nevysha-scrollable > div:nth-child(1) > div.image-wrapper > img");
  let inputTo = document.querySelector("#nevysha-send-to > #nevysha_pnginfo_image > div.image-container > div")

  //get image file from elemImgFrom.src
  const blob = await fetch(elemImgFrom.src).then(r => r.blob());

  // Create a new drop event
  let dropEvent = new DragEvent("drop", {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(dropEvent, 'dataTransfer', {
    value: new FakeDataTransfer(blob)
  });

  // Dispatch the drop event on the target element
  inputTo.dispatchEvent(dropEvent);

  //ensure navigation to the dedicated tab
  if (where === 'txt2img') {
    document.querySelector('#tabs > div.tab-nav').querySelector('#txtimg').click();
  }
  else if (where === 'img2img') {
    document.querySelector('#tabs > div.tab-nav').querySelector('#imgimg').click();
    document.querySelectorAll('#mode_img2img > div > button')[0].click();
  }
  else if (where === 'inpainting') {
    document.querySelector('#tabs > div.tab-nav').querySelector('#imgimg').click();
    document.querySelectorAll('#mode_img2img > div > button')[2].click();
  }

  //wait a bit for the gradio loading to end and click #nevysha-send-to-button > button#txt2img_tab
  setTimeout(() => {
    let clicker;
    if (where === 'txt2img') {
      clicker = document.querySelector("#nevysha-send-to-button > button#txt2img_tab")
    }
    else if (where === 'img2img') {
      clicker = document.querySelector("#nevysha-send-to-button > button#img2img_tab")
    }
    else if (where === 'inpainting') {
      clicker = document.querySelector("#nevysha-send-to-button > button#inpaint_tab")
    }
    clicker.click()
  }, 1000)
}
window.sendToPipe = sendToPipe;

window.troubleshootSize = {}

function addOptionsObserver() {
  // Select the target node
  const targetNode = document.body;

  function recalcOptionsMaxHeight(addedNode) {
    const options = addedNode;

    options.style.position = 'fixed';

    //look for a parent with class "gradio-dropdown"
    const parent = options.parentElement;

    options.style.width = parent.offsetWidth + 'px';

    //check if the parent is near the top or bottom of the window
    const parentRect = parent.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate the distance of the element from the top and bottom of the window
    const distanceFromTop = parentRect.top;
    const distanceFromBottom = windowHeight - parentRect.bottom;

    // Compare the distances and determine the position
    if (distanceFromTop < distanceFromBottom) {
      //closer to the top
      options.style.top = (parentRect.top + parentRect.height) + 'px';

    } else {
      //closer to the bottom
      options.style.bottom = (window.innerHeight - parentRect.top) + 'px';

    }
  }

  // Create a function to be called when mutations are observed
  const mutationCallback = function (mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if a new element with class "options" is added
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === 1 && addedNode.classList.contains('options')) {
            // Call your desired function when a new element is added
            recalcOptionsMaxHeight(addedNode);
          }
        }
      }
    }
  };

  // Create a new observer instance
  const observer = new MutationObserver(mutationCallback);

  // Configure the observer to only look for childList changes
  const config = { childList: true, subtree: true };

  // Start observing the target node for mutations
  observer.observe(targetNode, config);
}

const onloadSafe = (done, error) => {
  try {
    onLoad(done, error);
  } catch (e) {
    console.error("Failed to init Cozy Nest", e);
    error();
  }
}

function addAccordionClickHandler() {
  const accordions = document.querySelectorAll('.gradio-accordion > .label-wrap');

  accordions.forEach(accordion => {
    accordion.addEventListener('click', () => {
      const isOpen = accordion.classList.contains('open');
      if (isOpen) {
        accordion.parentElement.classList.add('nevysha-accordion-open')
        accordion.parentElement
          .setAttribute("style"
            , `${accordion.parentElement.getAttribute("style")} border-width: 2px 2px 0px !important;`);
      } else {
        accordion.parentElement.classList.remove('nevysha-accordion-open')
        accordion.parentElement.setAttribute("style",
          `${accordion.parentElement.getAttribute("style").replace('border-width: 2px 2px 0px !important;', '')}`)
      }
    });
  })

}

function addScriptSelectionHandler() {
  const scriptSelects = document.querySelectorAll('#script_list');

  scriptSelects.forEach(input => {

    //border-width: 2px 2px 0px !important;
    input.setAttribute("style", `${input.getAttribute("style")} border-width: 2px 2px 0px !important;`)

    // add nevysha-scripts class to all next siblings until there is no more
    let nextSibling = input.parentElement.nextElementSibling;

    while (nextSibling !== null) {
      nextSibling.classList.add('nevysha-scripts');
      nextSibling = nextSibling.nextElementSibling;
    }
  })

  // Create a Mutation Observer
  const observer = new MutationObserver(mutations => {

    mutations.forEach(mutation => {

      if (mutation.type === 'subtree') {
        CozyLogger.debug(`subtree mutation: ${mutation.removedNodes}`)
      }

      if (mutation.type === 'attributes') {
        let changedInput = mutation.target;
        if (!mutation.target instanceof HTMLInputElement) {
          changedInput = mutation.target.querySelector('input');
        }
        if (!changedInput) {
          return;
        }
        const newValue = changedInput.value;

        if (newValue && newValue !== 'None' && newValue.length > 0) {
          CozyLogger.debug('script: newValue', newValue);
          findNearestParent(changedInput, '#script_list')?.classList.add('nevysha-script-selected');
        } else if (newValue === 'None'){
          CozyLogger.debug('script deselected');
          findNearestParent(changedInput, '#script_list')?.classList.remove('nevysha-script-selected');
        }
      }
    });
  });

  // Configure and start the observer
  scriptSelects.forEach(input => {
    observer.observe(input, { attributes: true, childList: true, subtree: true });
  });
}

const onLoad = (done, error) => {

  let gradioApp = window.gradioApp;
  if (typeof gradioApp !== "function") {
    setTimeout(() => onloadSafe(done, error), 200);
    return
  }


  const quicksettings = gradioApp().getElementById("quicksettings")

  if (!quicksettings) {
    setTimeout(() => onloadSafe(done, error), 200);
    return
  }

  // log time for onLoad execution after gradio has loaded
  SimpleTimer.time(COZY_NEST_DOM_TWEAK_LOAD_DURATION);

  //add quicksettings_gap after checkpoint reload button
  // Select the target element
  const refresh_sd_model_checkpoint = document.querySelector('#refresh_sd_model_checkpoint');

  // Create a new div element
  const quicksettings_gap = "<div id='quicksettings_gap' class='nevysha' />"

  // Insert the new div after the target element
  refresh_sd_model_checkpoint.insertAdjacentHTML('afterend', quicksettings_gap);

  //get body from DOM
  const body = document.querySelector("body")
  //remove default body style
  body.style = ""

  //add triple wave div to the end of body for uwuness
  body.insertAdjacentHTML('beforeend', waves);

  const tabs = document.querySelectorAll('#tabs > .tabitem')
  //add nevysha css class to each main tab for easier css
  tabs.forEach(tab => tab.setAttribute('class', `${tab.getAttribute('class')} nevysha`))
  //add nevysha css class to tabnav
  document.querySelectorAll('#tabs > div.tab-nav').forEach(tabnav => tabnav.setAttribute('class', `${tabnav.getAttribute('class')} nevysha nevysha-tabnav`))
  document.querySelectorAll('input[type="number"]').forEach(input => input.setAttribute('class', `${input.getAttribute('class')} nevysha`))
  //add .nevysha-scrollable to some elem
  document.querySelectorAll('.extra-network-cards').forEach(elem => elem.setAttribute('class', `${elem.getAttribute('class')} nevysha nevysha-scrollable`))
  document.querySelectorAll('#cozy_nest_settings_tabs > .tabitem').forEach(elem => elem.classList.add('nevysha', 'nevysha-scrollable'))


  //hide "send to" panel in settings
  //this panel is used to transfert image data into tab
  document.querySelector('#nevysha-send-to').setAttribute('style', 'display: none;')

  //create a wrapper div on the right for slidable panels
  createRightWrapperDiv();

  let lastTab = get_uiCurrentTabContent().id;
  onUiTabChange(() => {
    CozyLogger.debug(`onUiTabChange newTab:${get_uiCurrentTabContent().id}, lastTab:${lastTab}`);

    if (lastTab === "tab_txt2img") {
      rightPanelsHandler['cozy-txt2img-extra-network'].close();
    }
    else if (lastTab === "tab_img2img") {
      rightPanelsHandler['cozy-img2img-extra-network'].close();
    }

    if (COZY_NEST_CONFIG.enable_extra_network_tweaks) {
      setButtonVisibilityFromCurrentTab(get_uiCurrentTabContent().id);
    }

    lastTab = get_uiCurrentTabContent().id;
  });

  //manage text2img tab
  const nevysha_magic = (bundle) => {
    wrapSettings(bundle);
    wrapDataGenerationInfo(bundle);
    addDraggable(bundle);
    addScrollable(bundle);

    //add a clear button to generated image
    clearGeneratedImage(bundle);
  }

  nevysha_magic({prefix: "txt2img"});
  nevysha_magic({prefix: "img2img"});
  clearGeneratedImage({prefix: "extras"});


  //general
  tweakButtonsIcons();


  const img2imgtoolsParent = document.querySelector(`#${DOM_IDS.get('clear_prompt')('img2img')}`).parentElement;
  img2imgtoolsParent.classList.add('nevysha', 'nevysha-prompt-tools')
  const txt2imgtoolsParent = document.querySelector(`#${DOM_IDS.get('clear_prompt')('txt2img')}`).parentElement;
  txt2imgtoolsParent.classList.add('nevysha', 'nevysha-prompt-tools')
  const postponeMove = []

  //inline _styles_row
  const stylesRowTxt2img = document.querySelector('#txt2img_styles_row');
  const stylesRowImg2img = document.querySelector('#img2img_styles_row');
  postponeMove.push(
    () => {
      //add stylesRowTxt2img to begin of txt2imgtoolsParent
      txt2imgtoolsParent.insertBefore(stylesRowTxt2img, txt2imgtoolsParent.firstChild)
      img2imgtoolsParent.insertBefore(stylesRowImg2img, img2imgtoolsParent.firstChild)
    })

  //inline interrogate / deepdanbooru with tool button
  const interrogateParent = document.querySelector('#interrogate').parentElement;
  for (const child of interrogateParent.children) {
    //do not move child while iterating over parent children
    postponeMove.push(
      () => {
        //max-width: 50px;
        child.classList.add('nevysha', 'nevysha-interrogate-btn')
        if (child.id === 'interrogate') {
          child.innerHTML = 'CLIP'
        }
        else if (child.id === 'deepbooru') {
          child.innerHTML = 'DeepBooru'
        }
        img2imgtoolsParent.appendChild(child)
      }
    )
  }
  postponeMove.forEach(f => f())

  //add expend to inpainting
  tweakInpainting();

  addCozyNestCustomBtn();

  //load settings
  recalcOffsetFromMenuHeight();

  //add click handler on .gradio-accordion > .label-wrap to change border top
  addAccordionClickHandler();

  //add script selection handler
  addScriptSelectionHandler();

  //add tab wrapper
  addTabWrapper();

  //add observer for .options resize
  addOptionsObserver();

  /* --------------- TWEAK SOME EXTENSION --------------- */
  //if AWQ-container is present in COZY_NEST_CONFIG.extensions array from localStorage, tweak AWQ
  if (COZY_NEST_CONFIG.extensions
      && COZY_NEST_CONFIG.extensions.length > 0
      && COZY_NEST_CONFIG.extensions.includes("SDAtom-WebUi-client-queue-ext")) {
    tweakAWQ();
  }

  done();
};

export async function saveCozyNestConfig(config) {

  config = config || COZY_NEST_CONFIG;

  await fetch('/cozy-nest/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  })
}

async function detectWebuiContext() {
  // we try to determine the webui. This should have been made during startup, but we need a fallback
  // because this function is not available before a recent commit of sd.next
  if (COZY_NEST_CONFIG.webui === WEBUI_UNKNOWN) {
    CozyLogger.debug("webui is UNKNOWN. Trying to detect it.")
    //check for meta tag to verify if we are in SD.Next
    const metaTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
    if (metaTitle && metaTitle === WEBUI_SDNEXT) {
      COZY_NEST_CONFIG.webui = WEBUI_SDNEXT;
      shouldDisplaySDNextWarning = true;
    }
    else {
      COZY_NEST_CONFIG.webui = WEBUI_A1111;
    }

    await saveCozyNestConfig();
  }
  CozyLogger.debug(`webui is ${COZY_NEST_CONFIG.webui}`)
}


/**
 * Need to be called after the page and the script is loaded
 * either from main.js for Dev or from the loader in the extension folder
 * @returns {Promise<void>}
 */
export default async function cozyNestModuleLoader(extraCozyNestModulesLoader) {

  //check if the param CozyNest=No is present in the url
  const urlParams = new URLSearchParams(window.location.search);
  const cozyNestParam = urlParams.get('CozyNest');
  if (cozyNestParam === "No") {
    CozyLogger.log("disabled by url param")
    //remove the css with Cozy-Nest in the url
    document.querySelectorAll('link').forEach(link => {
      if (link.href.includes("Cozy-Nest")) link.remove()
    })
    return
  }

  // fetch file=extensions/Cozy-Nest/nevyui_settings.json. add Date to avoid cache
  await fetchCozyNestConfig();
  await detectWebuiContext();

  Loading.start();

  createAlertDiv();
  setupPopupInstanceInfo();
  setupErrorHandling();

  // wrap onloadSafe in Promise
  return new Promise(resolve => {
    onloadSafe(async () => {

      await extraCozyNestModulesLoader();

      //remove #nevysha-loading from DOM
      Loading.stop();
      CozyLogger.log(`running.`);

      SimpleTimer.end(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
      SimpleTimer.end(COZY_NEST_GRADIO_LOAD_DURATION);

      if (shouldDisplaySDNextWarning)
        showAlert(
            "Warning",
            "Cozy Nest detected that you are using SD.Next and running Cozy Nest for the first time. To ensure compatibility, please restart the server."
        )
      resolve();
    },
    () => {

      CozyLogger.error(`ERROR loading CozyNest.`);

      try {
        //remove #nevysha-loading from DOM
        Loading.stop();

        SimpleTimer.end(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
        SimpleTimer.end(COZY_NEST_GRADIO_LOAD_DURATION);
      }
      catch (ignored) {}

      showAlert(
        "Error",
        "There was an error while loading Cozy Nest. Ui will fallback to default.",
        //reload by adding ?CozyNest=No to the url
        () => {
          window.location.replace(`${window.location.href}#CozyNest=No`)
          window.location.reload()
        }
      )

      resolve();
    });
  })
};


function setupErrorHandling() {

  let isLoading = false;
  CozyNestEventBus.on('cozy-nest-loaded', () => {
    isLoading = false;
  })

  //set a global error handler
  window.addEventListener('error', function ({message, filename , lineno, colno, error }) {

    if (!isLoading) {
      CozyLogger.error(error);
      return;
    }

    //if filename does not contains Cozy-Nest, ignore
    if (!filename.toLowerCase().includes('cozy-nest')) return;

    try {
      //remove #nevysha-loading from DOM
      Loading.stop();
      SimpleTimer.end(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
      SimpleTimer.end(COZY_NEST_GRADIO_LOAD_DURATION);
    }
    catch (ignored) {}

    showAlert(
      "Error",
      "There was an error while loading Cozy Nest. Ui will fallback to default.",
      //reload by adding ?CozyNest=No to the url
      () => {
        window.location.replace(`${window.location.href}#CozyNest=No`)
        window.location.reload()
      }
    )
  });
}

let COZY_NEST_CONFIG;
let shouldDisplaySDNextWarning = false;

export async function fetchCozyNestConfig() {
  const response = await fetch(`file=extensions/Cozy-Nest/nevyui_settings.json?t=${Date.now()}`);
  if (response.ok) {
    COZY_NEST_CONFIG = await response.json();

    //save in local storage
    localStorage.setItem('COZY_NEST_CONFIG', JSON.stringify(COZY_NEST_CONFIG));
    window.COZY_NEST_CONFIG = COZY_NEST_CONFIG;
  }
}


