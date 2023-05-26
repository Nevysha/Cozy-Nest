import {getLuminance, getSubduedFontColor, hexToRgb} from "../cozy-utils.js";

export function applyWavesColor(hexColor) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelectorAll(".wave").forEach((wave) => {
    wave.setAttribute("style", `background: rgb(${rgbColor} / 16%)`);
  })
}

export function applyFontColor(hexColor) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--nevysha-font-color', `rgb(${rgbColor})`);
  document.querySelector(':root').style.setProperty('--nevysha-font-color-subdued', getSubduedFontColor(hexColor));
}

export function applyBgGradiantColor(hexColor) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--nevysha-gradiant-1', `rgb(${rgbColor})`);
}

export function applyAccentColor(hexColor, colorFromLuminance) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--ae-primary-color', `rgb(${rgbColor})`);
  if (getLuminance(colorFromLuminance) > 0.5) {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `black`);
  } else {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `white`);
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