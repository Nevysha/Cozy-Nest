import {getLuminance, getSubduedFontColor, hexToRgb} from "../cozy-utils.js";
import $ from "jquery";
import {WEBUI_SDNEXT} from "../Constants.js";

export function applyWavesColor(hexColor) {
  COZY_NEST_CONFIG.waves_color = hexColor;
  const rgbColor = hexToRgb(hexColor);
  document.querySelectorAll(".wave").forEach((wave) => {
    wave.setAttribute("style", `background: rgb(${rgbColor} / 16%)`);
  })
}

export function applyFontColor(hexColor) {
  COZY_NEST_CONFIG.font_color = hexColor;
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--nevysha-font-color', `rgb(${rgbColor})`);
  document.querySelector(':root').style.setProperty('--nevysha-font-color-subdued', getSubduedFontColor(hexColor));
}

export function applyBgGradiantColor(hexColor) {
  COZY_NEST_CONFIG.bg_gradiant_color = hexColor;
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--nevysha-gradiant-1', `rgb(${rgbColor})`);
}

export function applyAccentColor(hexColor, colorFromLuminance) {
  COZY_NEST_CONFIG.accent_color = hexColor;
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--ae-primary-color', `rgb(${rgbColor})`);
  if (getLuminance(colorFromLuminance) > 0.5) {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `black`);
  } else {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `white`);
  }
}
export function applySecondaryAccentColor(hexColor) {
  COZY_NEST_CONFIG.secondary_accent_color = hexColor;
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--secondary-accent-color', `rgb(${rgbColor})`);
  if (getLuminance(hexColor) > 0.5) {
    document.querySelector(':root').style.setProperty('--secondary-accent-color-from-luminance', `black`);
  } else {
    document.querySelector(':root').style.setProperty('--secondary-accent-color-from-luminance', `white`);
  }
}

export const applyDisabledWavesAndGradiant = (disableWavesAndGradiant) => {
  COZY_NEST_CONFIG.disable_waves_and_gradiant = disableWavesAndGradiant;
  const $waves = $('.wave');
  const $body = $('body');
  if (disableWavesAndGradiant) {
    $waves.css('animation', 'none');
    $body.css('animation', 'none');
    $body.css('background-position', '75% 75%')
  }
  else {
    $waves.css('animation', '');
    $body.css('animation', '');
    $body.css('background-position', '')
  }
}

export const applyAccentForGenerate = (checked, hexColorForAccent) => {
  COZY_NEST_CONFIG.accent_generate_button = checked;
  document.querySelectorAll('button[id$="_generate"]').forEach((btn) => {
    if (checked) {
      let txtColorAppending = "";
      if (getLuminance(hexColorForAccent)  > 0.5) {
        txtColorAppending = "color: black !important";
      }
      btn.setAttribute("style", `background: var(--ae-primary-color) !important; ${txtColorAppending}`);
    } else {
      btn.setAttribute("style", '');
    }
  })
}

export const applyFontSize = (fontSize) => {
  COZY_NEST_CONFIG.font_size = fontSize;
  document.querySelector(':root').style.setProperty('--nevysha-text-md', `${fontSize}px`);
  recalcOffsetFromMenuHeight()
}

export const setCardHeight = (cardHeight) => {
  COZY_NEST_CONFIG.card_height = cardHeight;
  document.querySelector(':root').style.setProperty('--extra-network-card-height', `${cardHeight}em`);
}

export const setCardWidth = (cardWidth) => {
  COZY_NEST_CONFIG.card_width = cardWidth;
  document.querySelector(':root').style.setProperty('--extra-network-card-width', `${cardWidth}em`);
}

export const applyMenuPosition = (position) => {
  COZY_NEST_CONFIG.main_menu_position = position;
  //top mode
  if (position === "top" || position === "top_centered") {
    document.querySelector(".nevysha.nevysha-tabnav").classList.add("menu-fix-top")
    document.querySelector(".gradio-container.app").classList.add("menu-fix-top")
    document.querySelector("#nevysha-btn-menu-wrapper")?.classList.add("menu-fix-top")
    document.querySelector(':root').style.setProperty('--nevysha-margin-left', `0`);
    document.querySelector(':root').style.setProperty('--menu-top-height', `25px`);

    //centered or not
    if (position === "top_centered") {
      document.querySelector(".nevysha.nevysha-tabnav").classList.add("center-menu-items")
    } else {
      document.querySelector(".nevysha.nevysha-tabnav").classList.remove("center-menu-items")
    }
  }
  //left mode
  else {
    document.querySelector(".nevysha.nevysha-tabnav").classList.remove("center-menu-items")
    document.querySelector(".nevysha.nevysha-tabnav").classList.remove("menu-fix-top")
    document.querySelector(".gradio-container.app").classList.remove("menu-fix-top")
    document.querySelector("#nevysha-btn-menu-wrapper")?.classList.remove("menu-fix-top")
    document.querySelector(':root').style.setProperty('--nevysha-margin-left', `175px`);
    document.querySelector(':root').style.setProperty('--menu-top-height', `1px`);
  }
  recalcOffsetFromMenuHeight()
}

export const setQuicksettingPosition = (position) => {
  COZY_NEST_CONFIG.quicksettings_position = position;
  if (position === 'split') {
    document.querySelector("#quicksettings_gap").classList.add("nevysha-quicksettings-gap")
    document.querySelector("#quicksettings").classList.remove("centered-quicksettings")
  }
  else if (position === 'centered') {
    document.querySelector("#quicksettings_gap").classList.remove("nevysha-quicksettings-gap")
    document.querySelector("#quicksettings").classList.add("centered-quicksettings")
  }
  else {
    document.querySelector("#quicksettings_gap").classList.remove("nevysha-quicksettings-gap")
    document.querySelector("#quicksettings").classList.remove("centered-quicksettings")
  }
}

export const setSfwSettings = (isSfwChecked) => {
  COZY_NEST_CONFIG.sfw_mode = isSfwChecked;
  if (isSfwChecked) {
    document.querySelector('body').classList.add("nsfw");
  }
  else {
    document.querySelector('body').classList.remove("nsfw");
  }
}

export const recalcOffsetFromMenuHeight = () => {
  let menuHeight = 0;

  const tabs = document.getElementById('tabs');

  const footer = document.querySelector('#footer #footer');
  let footerHeight;
  if (!footer) {
    if (COZY_NEST_CONFIG.webui === WEBUI_SDNEXT)
      footerHeight = 5;
    else
      footerHeight = 0;
  }
  else {
    footerHeight = footer.offsetHeight;
  }

  if (COZY_NEST_CONFIG.main_menu_position !== 'left') {
    const menu = document.querySelector('.tab-nav.nevysha-tabnav')

    menuHeight = menu.offsetHeight + 2;
    document.querySelector(':root').style.setProperty('--menu-top-height', `${menuHeight}px`);
    const $app = $('.gradio-container.app');
    $app.attr('style', `${$app.attr('style')} padding-top: ${menuHeight}px !important;`);

    const rect = tabs.getBoundingClientRect();
    const tabsTop = rect.top;

    document.querySelector(':root').style.setProperty('--main-container-height', `${window.innerHeight - (tabsTop + footerHeight)}px`);

    window.troubleshootSize = {
      menuHeight,
      footerHeight: footerHeight,
      tabsTop,
      WindowInnerHeight: window.innerHeight,
      bodyHeight: window.innerHeight - (tabsTop + footerHeight),
      'main-container-height': `${window.innerHeight - (tabsTop + footerHeight)}px`,
    }
  }
  else {
    document.querySelector(':root').style.setProperty('--menu-top-height', `1px`);

    const $app = $('.gradio-container.app');
    $app.attr('style', `${$app.attr('style')} padding-top: ${menuHeight}px !important;`);

    const rect = tabs.getBoundingClientRect();
    const tabsTop = rect.top;

    document.querySelector(':root').style.setProperty('--main-container-height', `${window.innerHeight - (tabsTop + footerHeight)}px`);

    window.troubleshootSize = {
      menuHeight,
      footerHeight: footerHeight,
      tabsTop,
      WindowInnerHeight: window.innerHeight,
      bodyHeight: window.innerHeight - (tabsTop + footerHeight),
      'main-container-height': `${window.innerHeight - (tabsTop + footerHeight)}px`,
    }
  }
}

export const wrapDataGenerationInfo = ({prefix}) => {
  // Get the generation info container
  const previewBlocks = document.querySelectorAll(`#tab_${prefix} div#${prefix}_results > *:not(#${prefix}_results)`);
  const generationInfoContainer = previewBlocks[1].querySelectorAll(`#html_info_${prefix}, #html_log_${prefix}`);

  // Create the new container element and add a class for styling
  const wrapper = document.createElement('div');
  wrapper.classList.add('preview-block-wrapper');

  // Create the show/hide button element and add a click event listener
  const toggleButton = document.createElement('button');
  toggleButton.id = 'toggleGenInfoButton';
  toggleButton.classList.add('nevysha', 'lg', 'primary', 'gradio-button', 'btn');
  toggleButton.textContent = 'Show/Hide Generation Info';
  toggleButton.addEventListener('click', () => {
    generationInfoContainer.forEach((el) => el.style.display = el.style.display === 'none' ? '' : 'none');
  });

  // Add the toggle button and generation info container to the wrapper
  wrapper.appendChild(toggleButton);
  generationInfoContainer.forEach((el) => wrapper.appendChild(el));

  // Add the wrapper container at the end of the previewBlocks[1] container
  previewBlocks[1].appendChild(wrapper);

  // Hide the generation info container by default
  generationInfoContainer.forEach((el) => el.style.display = 'none');

  // Remove the inline style from the previewBlocks[1] container
  previewBlocks[1].style = "";
}

export function wrapSettings({prefix}) {

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

  //wrap Skip and Interrupt buttons
  const skipBtn = document.getElementById(`${prefix}_skip`);
  skipBtn.classList.add('nevysha', 'skip-button');
  const interruptBtn = document.getElementById(`${prefix}_interrupt`);
  interruptBtn.classList.add('nevysha', 'interrupt-button');
  const skipInterruptWrapper = document.createElement('div');
  skipInterruptWrapper.classList.add('nevysha', 'skip-interrupt-wrapper');
  skipInterruptWrapper.appendChild(skipBtn);
  skipInterruptWrapper.appendChild(interruptBtn);
  settingsContainer.insertBefore(skipInterruptWrapper, settingsContainer.firstChild);

}

export function createVerticalLineComp() {
  const lineWrapper = document.createElement('div');
  lineWrapper.classList.add('vertical-line-wrapper');
  const line = document.createElement('div');
  line.classList.add('vertical-line');
  lineWrapper.appendChild(line)
  return lineWrapper;
}