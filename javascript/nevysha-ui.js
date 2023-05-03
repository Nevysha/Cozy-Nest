console.log("nevysha-ui.js")

const getTheme = () => {
  const gradioURL = window.location.href
  if (!gradioURL.includes('?__theme=')) {
    return 'dark'
  }
  return gradioURL.split('?__theme=')[1];
}

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r} ${g} ${b}`;
}

const wrapDataGenerationInfo = ({prefix}) => {
  // Get the generation info container
  const previewBlocks = document.querySelectorAll(`#tab_${prefix} div#${prefix}_results > *:not(#${prefix}_results)`);
  const generationInfoContainer = previewBlocks[1].children[2];

  // Create the new container element and add a class for styling
  const wrapper = document.createElement('div');
  wrapper.classList.add('preview-block-wrapper');

  // Create the show/hide button element and add a click event listener
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggleGenInfoButton';
  toggleButton.classList.add('nevysha', 'lg', 'primary', 'gradio-button', 'btn');
  toggleButton.textContent = 'Show/Hide Generation Info';
  toggleButton.addEventListener('click', () => {
    generationInfoContainer.style.display = generationInfoContainer.style.display === 'none' ? '' : 'none';
  });

  // Add the toggle button and generation info container to the wrapper
  wrapper.appendChild(toggleButton);
  wrapper.appendChild(generationInfoContainer);

  // Add the wrapper container at the end of the previewBlocks[1] container
  previewBlocks[1].appendChild(wrapper);

  // Hide the generation info container by default
  generationInfoContainer.style.display = 'none';

  // Remove the inline style from the previewBlocks[1] container
  previewBlocks[1].style = "";
}

function wrapSettings({prefix}) {

  const settingsContainer = document.getElementById(`${prefix}_settings`);
  settingsContainer.parentElement.classList.add('nevysha', 'settings-gradio-parent');
  const topRow = document.getElementById(`${prefix}_toprow`);
  const generateBtn = document.getElementById(`${prefix}_generate`);

  // Get its children elements
  const settingsChildren = settingsContainer.querySelectorAll(`:scope > :not(#${prefix}_toprow)`);

  // Create the new container element and add a class for styling
  const wrapperSettings = document.createElement('div');
  wrapperSettings.classList.add('nevysha', 'settings-wrapper');

  // Loop through the children elements starting from the second one
  for (let child of settingsChildren) {

    //add a selector to each child
    child.classList.add('nevysha', 'settings-child');

    // Move each child into the new wrapper container
    wrapperSettings.appendChild(child);
  }

  // Insert the wrapper container after the original container
  settingsContainer.appendChild(wrapperSettings);

  //move toprow
  wrapperSettings.insertBefore(topRow, wrapperSettings.firstChild);

  //move generate button to the top
  generateBtn.classList.add('nevysha', 'generate-button')
  settingsContainer.insertBefore(generateBtn, settingsContainer.firstChild);
}

const SETTINGS_MIN_WIDTH = 420;
const RESULT_MIN_WIDTH = 320;
const addDraggable = ({prefix}) => {
  const settings = document.getElementById(`${prefix}_settings`);

  //change min-width to min(420px, 100%)
  settings.style.minWidth = `min(${SETTINGS_MIN_WIDTH}px, 100%)`

  // Create a new vertical line element
  const lineWrapper = document.createElement('div');
  lineWrapper.classList.add('vertical-line-wrapper');
  const line = document.createElement('div');
  line.classList.add('vertical-line');
  lineWrapper.appendChild(line)

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
  const defaultStyle = inpaintTab.style;
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
      inpaintTab.style = defaultStyle;

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

function getHexColorForAccent() {
  return document.querySelector("#setting_nevyui_accentColor").querySelector("input").value;
}

function loadSettings() {

  const root = document.querySelector(':root');

  //waves
  const setWaveColor = () => {
    const hexColor = document.querySelector("#setting_nevyui_waveColor").querySelector("input").value;
    const rgbColor = hexToRgb(hexColor);
    document.querySelectorAll(".wave").forEach((wave) => {
      wave.setAttribute("style", `background: rgb(${rgbColor} / 16%)`);
    })
  }
  setWaveColor()
  document.querySelector("#setting_nevyui_waveColor").querySelector("input").addEventListener("change", setWaveColor)

  //background gradient
  const setGradientColor = () => {
    const hexColor = document.querySelector("#setting_nevyui_bgGradiantColor").querySelector("input").value;
    const rgbColor = hexToRgb(hexColor);
    root.style.setProperty('--nevysha-gradiant-1', `rgb(${rgbColor})`);
  }
  setGradientColor()
  document.querySelector("#setting_nevyui_bgGradiantColor").querySelector("input").addEventListener("change", setGradientColor)

  //background gradient
  const setAccentColor = () => {
    const hexColor = getHexColorForAccent();
    const rgbColor = hexToRgb(hexColor);
    root.style.setProperty('--ae-primary-color', `rgb(${rgbColor})`);
    if (getLuminance(getHexColorForAccent())  > 0.5) {
      root.style.setProperty('--nevysha-color-from-luminance', `black`);
    }
    else {
      root.style.setProperty('--nevysha-color-from-luminance', `white`);
    }
  }
  //accent generate button
  const setAccentForGenerate = () => {
    const checked = document.querySelector("#setting_nevyui_accentGenerateButton").querySelector("input").checked;
    document.querySelectorAll('button[id$="_generate"]').forEach((btn) => {
      if (checked) {
        let txtColorAppending = "";
        if (getLuminance(getHexColorForAccent())  > 0.5) {
          txtColorAppending = "color: black !important";
        }
        btn.setAttribute("style", `background: var(--ae-primary-color) !important; ${txtColorAppending}`);
      } else {
        btn.setAttribute("style", '');
      }
    })
  }

  setAccentColor()
  document.querySelector("#setting_nevyui_accentColor").querySelector("input").addEventListener("change", setAccentColor)
  document.querySelector("#setting_nevyui_accentColor").querySelector("input").addEventListener("change", setAccentForGenerate)


  setAccentForGenerate()
  document.querySelector("#setting_nevyui_accentGenerateButton").querySelector("input").addEventListener("change", setAccentForGenerate);

  //font size
  const setFontSize = () => {
    const fontSize = document.querySelector("#setting_nevyui_fontSize").querySelector("input[type=number]").value;
    root.style.setProperty('--nevysha-text-md', `${fontSize}px`);
  }
  setFontSize()
  document.querySelector("#setting_nevyui_fontSize").querySelector("input[type=number]").addEventListener("change", setFontSize)
  document.querySelector("#setting_nevyui_fontSize").querySelector("input[type=range]").addEventListener("change", setFontSize)


  //check if menu is in left or top mode
  const menuPosition = () => {
    const isLeftChecked = document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=left]").checked;

    //top mode
    if (!isLeftChecked) {
      document.querySelector(".nevysha.nevysha-tabnav").classList.add("menu-fix-top")
      document.querySelector(".gradio-container.app").classList.add("menu-fix-top")
      document.querySelector("#nevyui_sh_options")?.classList.add("menu-fix-top")
      root.style.setProperty('--nevysha-margin-left', `0`);
      root.style.setProperty('--nevysha-menu-fix-top-height-less', `25px`);
    }
    //left mode
    else {
      document.querySelector(".nevysha.nevysha-tabnav").classList.remove("menu-fix-top")
      document.querySelector(".gradio-container.app").classList.remove("menu-fix-top")
      document.querySelector("#nevyui_sh_options")?.classList.remove("menu-fix-top")
      root.style.setProperty('--nevysha-margin-left', `175px`);
      root.style.setProperty('--nevysha-menu-fix-top-height-less', `1px`);
    }
  }
  menuPosition()
  document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=left]").addEventListener("change", menuPosition)
  document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=top]").addEventListener("change", menuPosition)


}
const getLuminance = (hexcolor) => {
  // remove # character from hex color string
  const hex = hexcolor.replace('#', '');

  // convert hex color to RGB values
  const r = parseInt(hex.substr(0,2),16);
  const g = parseInt(hex.substr(2,2),16);
  const b = parseInt(hex.substr(4,2),16);

  // calculate the relative luminance of the color
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

function tweakNevyUiSettings() {
  // select button element with "Nevysha Comfy UI" as its content
  const nevySettingstabMenu = $('#tabs > div > button:contains("Nevysha Comfy UI")');
  // hide the button
  nevySettingstabMenu.hide();

  //add a new button in the tabnav
  const nevySettingstabMenu2 = `<button id="nevyui_sh_options"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg></button>`;
  document.querySelector("#tabs > div.tab-nav").insertAdjacentHTML('beforeend', nevySettingstabMenu2);

  ///create an hideable right side panel
  const nevySettingstab = `<div id="nevyui_sh_options_panel" class="nevysha nevysha-tab nevysha-tab-settings" style="display: none;">`;
  document.querySelector("#tabs").insertAdjacentHTML('beforeend', nevySettingstab);
  //put tab_nevyui inside the panel
  document.querySelector("#nevyui_sh_options_panel").appendChild(document.querySelector("#tab_nevyui"));
  //show tab_nevyui by default to bypass gradio
  document.querySelector("#tab_nevyui").style.display = "block";

  //add click event to the new button
  let shown = false;
  document.querySelector("#nevyui_sh_options").addEventListener("click", (e) => {
    //cancel event
    e.preventDefault();
    e.stopPropagation();
    //toggle the panel with a slide animation using jquery
    if (shown) {
      $("#nevyui_sh_options_panel").slideUp();
    } else {
      $("#nevyui_sh_options_panel").slideDown();
    }
    shown = !shown;
  });
  //when shown is true, hide it on click outside
  document.addEventListener("click", (e) => {
    if (shown && !e.target.closest("#nevyui_sh_options_panel") && !e.target.closest("#nevyui_sh_options")) {
      //cancel event
      e.preventDefault();
      e.stopPropagation();
      $("#nevyui_sh_options_panel").slideUp();
      shown = false;
    }
  });
}

const onload = () => {

  let gradioApp = window.gradioApp;
  if (typeof gradioApp !== "function") {
    console.log("not ready")
    setTimeout(onload, 2000);
    return
  }


  const quicksettings = gradioApp().getElementById("quicksettings")

  if (!quicksettings) {
    console.log("not ready")
    setTimeout(onload, 2000);
    return
  }

  //add flex1 after checkpoint reload button
  // Select the target element
  const refresh_sd_model_checkpoint = document.querySelector('#refresh_sd_model_checkpoint');

  // Create a new div element
  const flex1b = "<div class='nevysha flex1' />"

  // Insert the new div after the target element
  refresh_sd_model_checkpoint.insertAdjacentHTML('afterend', flex1b);

  //get body from DOM
  const body = document.querySelector("body")
  //remove default body style
  body.style = ""

  //add triple wave div to the end of body for uwuness
  const waves = "<div><div class='wave'></div> <div class='wave'></div><div class='wave'></div></div>"
  body.insertAdjacentHTML('beforeend', waves);

  const tabs = document.querySelectorAll('#tabs > .tabitem')
  //add nevysha css class to each main tab for easier css
  tabs.forEach(tab => tab.setAttribute('class', `${tab.getAttribute('class')} nevysha`))
  //add nevysha css class to tabnav
  document.querySelectorAll('#tabs > div.tab-nav').forEach(tabnav => tabnav.setAttribute('class', `${tabnav.getAttribute('class')} nevysha nevysha-tabnav`))
  document.querySelectorAll('input[type="number"]').forEach(input => input.setAttribute('class', `${input.getAttribute('class')} nevysha`))


  //manage text2img tab
  const nevysha_magic = (bundle) => {
    wrapSettings(bundle);
    wrapDataGenerationInfo(bundle);
    addDraggable(bundle);
    addScrollable(bundle);
  }

  nevysha_magic({prefix: "txt2img"});
  nevysha_magic({prefix: "img2img"});


  //general
  tweakButtonsIcons();

  //style tweak to be MORE IMPORTANT than important
  gradioApp().querySelector('.tabs').querySelectorAll(".block.padded:not(.gradio-accordion, .gradio-dropdown, #nevyui_sh_options)").forEach(elem => elem.setAttribute("style", `${elem.getAttribute("style")} padding: 10px !important;`))
  gradioApp().querySelectorAll('#quicksettings > div.block').forEach(elem => elem.style.padding = "0 !important")

  //add expend to inpainting
  tweakInpainting();

  //tweak webui setting page for nevysha comfy ui directly with JS because... gradio blblblbl
  tweakNevyUiSettings();

  //load settings
  loadSettings();

  //apply theme
  if (getTheme() === "light") {
    document.querySelector("body").classList.add("nevysha-light")
    document.querySelectorAll('.gradio-accordion').forEach(elem => elem.setAttribute("style", `${elem.getAttribute("style")} box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3) !important;`))
  }
  else {
    document.querySelector("body").classList.remove("nevysha-light")
  }


  console.log("nevysha-ui.js: DOMContentLoaded");
};

document.addEventListener("DOMContentLoaded", async () => {

  try {
    // dynamically import jQuery library
    await import('https://code.jquery.com/jquery-3.6.4.min.js')

    // jQuery is now loaded and ready to use
    console.log("jQuery library loaded successfully");
  }
  catch (err) {
    // handle any errors that occur during the import process
    console.error("Failed to load jQuery library", err);
  }

  onload();
});