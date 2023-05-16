const waves = "<div id='nevy_waves'><div class='wave'></div> <div class='wave'></div><div class='wave'></div></div>";
const svg_magic_wand = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>`;
const svg_update_info = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128H144zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39V184c0-13.3-10.7-24-24-24s-24 10.7-24 24V318.1l-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"/></svg>`;
const loading_roll = `<div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`
const svg_draggable_anchor = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8h32v96H128V192c0-12.9-7.8-24.6-19.8-29.6s-25.7-2.2-34.9 6.9l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V288h96v96H192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8H288V288h96v32c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6v32H288V128h32c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-64-64z"/></svg>`

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

const SETTINGS_MIN_WIDTH = 420;
const RESULT_MIN_WIDTH = 320;

function createVerticalLineComp() {
  const lineWrapper = document.createElement('div');
  lineWrapper.classList.add('vertical-line-wrapper');
  const line = document.createElement('div');
  line.classList.add('vertical-line');
  lineWrapper.appendChild(line)
  return lineWrapper;
}

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

function getHexColorForAccent() {
  return document.querySelector("#setting_nevyui_accentColor").querySelector("input").value;
}

function applyWavesColor(hexColor) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelectorAll(".wave").forEach((wave) => {
    wave.setAttribute("style", `background: rgb(${rgbColor} / 16%)`);
  })
}

function applyBgGradiantColor(hexColor) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--nevysha-gradiant-1', `rgb(${rgbColor})`);
}

function applyAccentColor(hexColor, colorFromLuminance) {
  const rgbColor = hexToRgb(hexColor);
  document.querySelector(':root').style.setProperty('--ae-primary-color', `rgb(${rgbColor})`);
  if (getLuminance(colorFromLuminance) > 0.5) {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `black`);
  } else {
    document.querySelector(':root').style.setProperty('--nevysha-color-from-luminance', `white`);
  }
}

function applyCozyNestConfig() {

  //waves
  const setWaveColor = () => {
    const hexColor = document.querySelector("#setting_nevyui_waveColor").querySelector("input").value;
    applyWavesColor(hexColor);
  }
  setWaveColor()
  document.querySelector("#setting_nevyui_waveColor").querySelector("input").addEventListener("change", setWaveColor)

  //background gradient
  const setGradientColor = () => {
    const hexColor = document.querySelector("#setting_nevyui_bgGradiantColor").querySelector("input").value;
    applyBgGradiantColor(hexColor);
  }
  setGradientColor()
  document.querySelector("#setting_nevyui_bgGradiantColor").querySelector("input").addEventListener("change", setGradientColor)

  //disable waves and gradiant
  const setDisabledWavesAndGradiant = () => {
    const disableWavesAndGradiant = document.querySelector("#setting_nevyui_disableWavesAndGradiant").querySelector("input").checked;
    const $waves = $('.wave');
    const $body = $('body');
    if (disableWavesAndGradiant) {
      $waves.css('display', 'none');
      $waves.css('animation', 'none');
      $body.css('background', 'var(--nevysha-gradiant-2)');
      $body.css('animation', 'none');
    }
    else {
      $waves.css('display', '');
      $waves.css('animation', '');
      $body.css('background', '');
      $body.css('animation', '');
    }

  }
  setDisabledWavesAndGradiant()
  document.querySelector("#setting_nevyui_disableWavesAndGradiant").querySelector("input").addEventListener("change", setDisabledWavesAndGradiant)

  //background gradient
  const setAccentColor = () => {
    const hexColor = getHexColorForAccent();
    applyAccentColor(hexColor, getHexColorForAccent());
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
    document.querySelector(':root').style.setProperty('--nevysha-text-md', `${fontSize}px`);
  }
  setFontSize()
  document.querySelector("#setting_nevyui_fontSize").querySelector("input[type=number]").addEventListener("change", setFontSize)
  document.querySelector("#setting_nevyui_fontSize").querySelector("input[type=range]").addEventListener("change", setFontSize)

  //card height
  const setCardHeight = () => {
    const cardHeight = document.querySelector("#setting_nevyui_cardHeight").querySelector("input[type=number]").value;
    document.querySelector(':root').style.setProperty('--extra-network-card-height', `${cardHeight}em`);
  }
  setCardHeight()
  document.querySelector("#setting_nevyui_cardHeight").querySelector("input[type=number]").addEventListener("change", setCardHeight)
  document.querySelector("#setting_nevyui_cardHeight").querySelector("input[type=range]").addEventListener("change", setCardHeight)

  //card width
  const setCardWidth = () => {
      const cardWidth = document.querySelector("#setting_nevyui_cardWidth").querySelector("input[type=number]").value;
    document.querySelector(':root').style.setProperty('--extra-network-card-width', `${cardWidth}em`);
  }
  setCardWidth()
  document.querySelector("#setting_nevyui_cardWidth").querySelector("input[type=number]").addEventListener("change", setCardWidth)
  document.querySelector("#setting_nevyui_cardWidth").querySelector("input[type=range]").addEventListener("change", setCardWidth)

  //check if menu is in left or top mode
  const menuPosition = () => {
    const isLeftChecked = document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=left]").checked;

    //top mode
    if (!isLeftChecked) {
      document.querySelector(".nevysha.nevysha-tabnav").classList.add("menu-fix-top")
      document.querySelector(".gradio-container.app").classList.add("menu-fix-top")
      document.querySelector("#nevysha-btn-menu-wrapper")?.classList.add("menu-fix-top")
      document.querySelector(':root').style.setProperty('--nevysha-margin-left', `0`);
      document.querySelector(':root').style.setProperty('--nevysha-menu-fix-top-height-less', `25px`);

      recalcOffsetFromMenuHeight();

      //centered or not
      const isCenteredChecked = document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=top_centered]").checked;
      if (isCenteredChecked) {
        document.querySelector(".nevysha.nevysha-tabnav").classList.add("center-menu-items")
      } else {
        document.querySelector(".nevysha.nevysha-tabnav").classList.remove("center-menu-items")
      }
    }
    //left mode
    else {
      document.querySelector(".nevysha.nevysha-tabnav").classList.remove("menu-fix-top")
      document.querySelector(".gradio-container.app").classList.remove("menu-fix-top")
      document.querySelector("#nevysha-btn-menu-wrapper")?.classList.remove("menu-fix-top")
      document.querySelector(':root').style.setProperty('--nevysha-margin-left', `175px`);
      document.querySelector(':root').style.setProperty('--nevysha-menu-fix-top-height-less', `1px`);
    }
  }
  menuPosition()
  document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=left]").addEventListener("change", menuPosition)
  document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=top]").addEventListener("change", menuPosition)
  document.querySelector("#setting_nevyui_menuPosition").querySelector("input[value=top_centered]").addEventListener("change", menuPosition)

  //quicksetting gap
  const setQuicksettingPosition = () => {
    const position = document.querySelector("#setting_nevyui_quicksettingsPosition")
        .querySelector("input[type=radio]:checked").value;
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
  setQuicksettingPosition()
  document.querySelector("#setting_nevyui_quicksettingsPosition")
      .querySelectorAll("input[type=radio]").forEach((input) => input.addEventListener("change", setQuicksettingPosition))

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
  const nevySettingstabMenu2 = `<button class="nevysha-btn-menu" id="nevyui_sh_options" title="Nevysha Cozy Nest Settings">${svg_magic_wand}</button>`;
  nevySettingstabMenuWrapper.insertAdjacentHTML('beforeend', nevySettingstabMenu2);
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

  //add kofi image :blush:
  const kofiImg = document.createElement('button')
  kofiImg.id = 'kofi_nevysha_support'
  kofiImg.innerHTML = `<img height="15" src="file=extensions/Cozy-Nest/assets/kofi-cup-border.png" alt="Consider a donation on ko-fi! :3">`
  kofiImg.title = "Consider a donation on ko-fi! :3"
  nevySettingstabMenuWrapper.insertAdjacentElement('beforeend', kofiImg);

  //create a div that will contain a dialog to display the iframe
  const kofiTab = document.createElement("div");
  kofiTab.classList.add("nevysha-kofi-tab", "nevysha", "nevysha-tab", "nevysha-tab-settings");
  kofiTab.id = "nevyui_kofi_panel";
  kofiTab.style = "display: none;";
  // kofiTab.innerHTML = `<iframe id='kofiframe' src='https://ko-fi.com/nevysha/?hidefeed=true&widget=true&embed=true&preview=true' style='border:none;width:100%;padding:4px;background:#f9f9f9;' height='712' title='nevysha'></iframe>`
  document.querySelector("#tabs").insertAdjacentElement("beforeend", kofiTab)

  let kofiImgIsVisible = false

  function toggleKofiPanel() {

    //tmp : open kofi link in a new tab
    window.open("https://ko-fi.com/nevysha", "_blank")

    // if (!kofiImgIsVisible) {
    //   $(kofiTab).slideDown(200)
    // } else {
    //   $(kofiTab).slideUp(200)
    // }
    // kofiImgIsVisible = !kofiImgIsVisible
  }

  //add event listener to the button
  kofiImg.addEventListener("click", () => {
    toggleKofiPanel();
  });
  //close the panel when clicking outside
  document.addEventListener("click", (e) => {
    if (kofiImgIsVisible && !e.target.closest("#kofi_nevysha_support")) {
        toggleKofiPanel();
    }
  });

  //fetch version_data.json
  loadVersionData().then(ignored => ignored)
}

async function loadVersionData() {

  const current_version_data = await (await fetch(`file=extensions/Cozy-Nest/version_data.json?${new Date()}`)).json()
  const remote_version_data = await (await fetch(`https://raw.githubusercontent.com/Nevysha/Cozy-Nest/main/version_data.json?${new Date()}`)).json()

  //in current_version_data.version and remote_version_data.version, replace string version to int
  current_version_data.number = parseInt(current_version_data.version.replace(/\./g, ''))
  remote_version_data.number = parseInt(remote_version_data.version.replace(/\./g, ''))

  let remote_patchnote = await (await fetch(`https://raw.githubusercontent.com/Nevysha/Cozy-Nest/main/PATCHNOTE.md?t=${new Date()}`)).text();
  //insert "Patchnote" title div
  let patchnoteTitle = `<div class="nevysha-tabnav nevysha-tabnav-settings"><h2 class="nevysha-tabnav-title">Patchnote [${remote_version_data.version}]</h2></div>`;
  //if local version si higher than remote version, fetch from local file (for dev purpose)
  if (current_version_data.number > remote_version_data.number) {
    remote_patchnote = await (await fetch(`file=extensions/Cozy-Nest/PATCHNOTE.md?t=${new Date()}`)).text();
    patchnoteTitle = `<div class="nevysha-tabnav nevysha-tabnav-settings"><h2 class="nevysha-tabnav-title">Patchnote [${current_version_data.version}_DEV]</h2></div>`;
  }


  document.querySelector("#nevyui_update_info_panel").insertAdjacentHTML('beforeend', patchnoteTitle);



  //regex to replace [x] with a checkmark
  const regex = /\[x\]/g;
  remote_patchnote = remote_patchnote.replace(regex, ""); //TODO add icon ?

  //regex to replace [ ] with a cross
  const regex2 = /\[ \]/g;
  remote_patchnote = remote_patchnote.replace(regex2, ""); //TODO add icon ?


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

  //in current_version_data.version and remote_version_data.version, replace string version to int
  current_version_data.number = parseInt(current_version_data.version.replace(/\./g, ''))
  remote_version_data.number = parseInt(remote_version_data.version.replace(/\./g, ''))
  //compare versions and display info
  if (current_version_data.number >= remote_version_data.number) {
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

}

const tweakNevyUiSettings = () => {
  // select button element with "Nevysha Cozy Nest" as its content
  const nevySettingstabMenu = $('#tabs > div > button:contains("Nevysha Cozy Nest")');
  // hide the button
  nevySettingstabMenu.hide();

  addCozyNestCustomBtn();

  ///create an hideable right side panel
  const nevySettingstab = `<div id="nevyui_sh_options_panel" class="nevysha nevysha-tab nevysha-tab-settings" style="display: none;">`;
  document.querySelector("#tabs").insertAdjacentHTML('beforeend', nevySettingstab);
  //put tab_nevyui inside the panel
  document.querySelector("#nevyui_sh_options_panel").appendChild(document.querySelector("#tab_nevyui"));

  //add an event listener on #nevyui_sh_options_submit to briefly show a message when the user clicks on it
  document.querySelector("#nevyui_sh_options_submit").addEventListener("click", (e) => {
    //cancel event
    e.preventDefault();
    e.stopPropagation();

    //show the message with a smooth animation using jquery
    $("#nevysha-saved-feedback").fadeIn();
    //hide the message after 1.5 second
    setTimeout(() => {
          $("#nevysha-saved-feedback").fadeOut();

        //save new settings in localStorage
        (() => fetchCozyNestConfig())() //ignore async warn
    }, 1500);
  });

  //add an event listener on #nevyui_sh_options_submit to briefly show a message when the user clicks on it
  document.querySelector("#nevyui_sh_options_reset").addEventListener("click", (e) => {
    //cancel event
    e.preventDefault();
    e.stopPropagation();

    //show the message with a smooth animation using jquery
    $("#nevysha-reset-feedback").fadeIn();
    //hide the message after 1.5 second
    setTimeout(() => {
      $("#nevysha-reset-feedback").fadeOut();

      //save new settings in localStorage
      (() => fetchCozyNestConfig())() //ignore async warn
    }, 1500);
  });


  //show tab_nevyui by default to bypass gradio
  document.querySelector("#tab_nevyui").style.display = "block";

  //add click event to the new settings button
  (function closure() {
    let shown = false;
    document.querySelector("#nevyui_sh_options").addEventListener("click", (e) => {
      //cancel event
      e.preventDefault();
      e.stopPropagation();

      //show tab_nevyui by default to bypass gradio hidding tabs
      document.querySelector("#tab_nevyui").style.display = "block";

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
  })();


  //add click event to the new update info button
  (function closure() {
    let shown = false;
    document.querySelector("#nevyui_update_info").addEventListener("click", (e) => {
      //cancel event
      e.preventDefault();
      e.stopPropagation();

      //show tab_nevyui by default to bypass gradio hidding tabs
      document.querySelector("#tab_nevyui").style.display = "block";

      //toggle the panel with a slide animation using jquery
      if (shown) {
        $("#nevyui_update_info_panel").slideUp();
      } else {
        $("#nevyui_update_info_panel").slideDown();
      }
      shown = !shown;
    });
    //when shown is true, hide it on click outside
    document.addEventListener("click", (e) => {
      if (shown && !e.target.closest("#nevyui_update_info_panel") && !e.target.closest("#nevyui_update_info") && !e.target.id === "#nevyui_sh_options_update") {
        //cancel event
        e.preventDefault();
        e.stopPropagation();
        $("#nevyui_update_info_panel").slideUp();
        shown = false;
      }
    });
  })();

}

const makeSettingsDraggable = () => {
  // Get a reference to the draggable div element
  const draggableSettings = document.querySelector('#nevyui_sh_options_panel');

  // Define variables to keep track of the mouse position and offset
  let isDragging = false;
  let mouseX = 0;
  let mouseY = 0;
  let offsetX = 0;
  let offsetY = 0;

  // create draggable icon
  const draggableAnchorIcon = document.createElement('div');
  draggableAnchorIcon.classList.add('nevysha-draggable-anchor-icon', 'nevysha-button');
  //add a drag icon
  draggableAnchorIcon.innerHTML = svg_draggable_anchor;
  // add the anchor to the start of the draggable div
  draggableSettings.insertBefore(draggableAnchorIcon, draggableSettings.firstChild);
  // create a blank div above the svg icon to catch for mousedown events
  const draggableAnchor = document.createElement('div');
  draggableAnchor.classList.add('nevysha-draggable-anchor', 'nevysha-button');
  // add the anchor to the start of the draggable div
  draggableSettings.insertBefore(draggableAnchor, draggableSettings.firstChild);

  //add close button
  const settingCloseButton = document.createElement('div');
  settingCloseButton.classList.add('nevysha-draggable-anchor', 'nevysha-draggable-anchor-icon', 'nevysha-setting-close-button', 'nevysha-button');
  settingCloseButton.innerHTML = 'Close';
  settingCloseButton.style.left = '50px';
  settingCloseButton.style.top = '2px';
  draggableSettings.appendChild(settingCloseButton);
  settingCloseButton.addEventListener('click', () => {
    document.querySelector("#nevyui_sh_options").click();
  });


  // Add event listeners for mouse events
  draggableAnchor.addEventListener('mousedown', function(event) {
    // Set dragging flag and store mouse position and offset from element top-left corner
    isDragging = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    offsetX = draggableSettings.offsetLeft;
    offsetY = draggableSettings.offsetTop;
  });

  document.addEventListener('mousemove', function(event) {
    // If dragging, update element position based on mouse movement
    if (isDragging) {
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      draggableSettings.style.left = (offsetX + deltaX) + 'px';
      draggableSettings.style.top = (offsetY + deltaY) + 'px';
    }
  });

  document.addEventListener('mouseup', function(event) {
    // Reset dragging flag
    isDragging = false;
  });
}

function observeElementAdded(targetSelector, callback) {
  // Create a new MutationObserver instance
  const observer = new MutationObserver(function(mutationsList) {
    for (const mutation of mutationsList) {
      // Check if the target element is added
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        for(const node of mutation.addedNodes) {
          if(node.matches && node.matches(targetSelector)) {
            observer.disconnect();
            callback(node);
          }
        }
      }
    }
  });

  // Start observing the document body for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

function tweakExtraNetworks({prefix}) {
  let extraNetworks = document.querySelector(`div#${prefix}_extra_networks`);

  //hide base button txt2img_extra_networks
  document.querySelector(`button#${prefix}_extra_networks`).style.display = 'none';

  extraNetworks.style.display = 'flex'

  // txt2img and img2img extra network are not built the same way in the DOM (:
  // so we handle the DOM tweak differently
  let extraNetworkGradioWrapper
  let extraNetworkNevyshaWrapper

  function tweakTabBehavior() {
    //add an event listener to show it when the user clicks on the button #img2img_extra_networks
    window.extraNetworkHandler = window.extraNetworkHandler || {};
    window.extraNetworkHandler[prefix] = (e) => {

      function closure() {

        //tweak height
        const $cards_html = $('div[id$="_cards_html"]');
        $cards_html.css('height', `${document.querySelector(`#tab_${prefix}`).offsetHeight - 100}px`);
        $cards_html.css('display', 'flex');

        //add classes : 'nevysha', 'nevysha-scrollable'
        const $cards = $('div[id$="_cards"]');
        $cards.css('height', '100%')
        $cards.addClass('nevysha');
        $cards.addClass('nevysha-scrollable');

        const $subdirs = $('div[id$="_subdirs"]');
        $subdirs.addClass('nevysha');
        $subdirs.addClass('nevysha-scrollable');

        let shown = extraNetworkGradioWrapper.style.display === 'flex';
        if (!shown) {

          //show the extra network
          extraNetworkGradioWrapper.style.display = 'flex';
          extraNetworkGradioWrapper.style.marginRight = `-${extraNetworkGradioWrapper.offsetWidth}px`;
          $(extraNetworkGradioWrapper).animate({"margin-right": `+=${extraNetworkGradioWrapper.offsetWidth}`}, 350);
        } else {
          //hide the extra network
          $(extraNetworkGradioWrapper).animate({
                "margin-right": `-=${extraNetworkGradioWrapper.offsetWidth}`},
              350,
              () => {
                // hide it after the animation is done
                extraNetworkGradioWrapper.style.display = 'none';
              });
        }
      }

      if (document.querySelector(`#${prefix}_textual_inversion_cards`)) {
        closure();
      }
      else {
        // Start observing the target node
        observeElementAdded(`#${prefix}_textual_inversion_cards`, closure);
      }
    };

    //add a listener to close the extra network when the user press the escape key
    document.addEventListener('keydown', (e) => {
      let shown = extraNetworkGradioWrapper.style.display === 'flex';
      if (e.key === 'Escape' && shown) {
        $(extraNetworkGradioWrapper).animate({"margin-right": `-=${extraNetworkGradioWrapper.offsetWidth}`}, 350, () => {
          extraNetworkGradioWrapper.style.display = 'none';
        });
      }
    });
  }

  if (prefix === 'img2img') {
    extraNetworkGradioWrapper = document.createElement('div');
    extraNetworkGradioWrapper.setAttribute('id', `${prefix}_extra_networks_parent`);

    //hide it
    extraNetworkGradioWrapper.style.display = 'none';

    tweakTabBehavior();

    //add extraNetworkGradioWrapper at the beginning of the extraNetworks parent
    extraNetworks.parentElement.insertAdjacentElement('afterbegin', extraNetworkGradioWrapper);

    extraNetworkNevyshaWrapper = document.createElement('div');
    extraNetworkNevyshaWrapper.setAttribute('id', `${prefix}_extra_networks_nevysha_wrapper`);
    extraNetworkNevyshaWrapper.appendChild(extraNetworks);

    extraNetworkGradioWrapper.appendChild(extraNetworkNevyshaWrapper);
  }
  else if (prefix === 'txt2img') {
    // move everything that's inside extraNetworkGradioWrapper to a new div
    extraNetworkGradioWrapper = extraNetworks.parentElement;
    extraNetworkGradioWrapper.setAttribute('id', `${prefix}_extra_networks_parent`);

    //hide it
    extraNetworkGradioWrapper.style.display = 'none';

    extraNetworkNevyshaWrapper = document.createElement('div');
    extraNetworkNevyshaWrapper.setAttribute('id', `${prefix}_extra_networks_nevysha_wrapper`);
    extraNetworkNevyshaWrapper.appendChild(extraNetworks);
    extraNetworkGradioWrapper.appendChild(extraNetworkNevyshaWrapper);

    tweakTabBehavior();
  }

  //apply the width saved in local storage
  const extraNetworksWidth = localStorage.getItem('nevysha_extra_networks_width');
  if (extraNetworksWidth) {
    extraNetworkGradioWrapper.style.width = extraNetworksWidth;
  }

  // Create a vertical line component
  const lineWrapper = createVerticalLineComp();
  //add the line to the beginning of the extraNetworkNevyshaWrapper
  extraNetworkNevyshaWrapper.insertBefore(lineWrapper, extraNetworkNevyshaWrapper.firstChild);

  //add a close button inside the line
  const closeENButton = document.createElement('button');
  closeENButton.setAttribute('id', `${prefix}_floating_close_extra_networks`);
  //add button class
  closeENButton.classList.add('nevysha', 'lg', 'primary', 'gradio-button', 'nevysha-extra-network-floating-btn');
  closeENButton.innerHTML = '<div>Close</div>';
  //click the original button to close the extra network
  closeENButton.addEventListener('click', (e) => {
    window.extraNetworkHandler[prefix]();
  });
  //add the button at the begining of the div
  lineWrapper.insertBefore(closeENButton, lineWrapper.firstChild);

  // Add an event listener to the resizer element to track mouse movement
  lineWrapper.addEventListener('mousedown', function(e) {
    e.preventDefault();

    // Set the initial values for the width and height of the container
    let width = extraNetworkGradioWrapper.offsetWidth;

    // Set the initial mouse position
    let x = e.clientX;

    // Track mouse movement while dragging
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    function drag(e) {
      // Calculate the difference in mouse position
      const diffX = e.clientX - x;

      // Update the container's width
      extraNetworkGradioWrapper.style.width = (width - diffX) + 'px';
    }

    function stopDrag() {

      //save the new width in local storage
      localStorage.setItem(`nevysha_extra_networks_width`, extraNetworkGradioWrapper.style.width);

      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }
  });
}

const COZY_NEST_DOM_TWEAK_LOAD_DURATION = "CozyNest:tweakLoadDuration";
const COZY_NEST_GRADIO_LOAD_DURATION = "CozyNest:gradioLoadDuration";

function addExtraNetworksBtn({prefix}) {

  //create button
  const extraNetworksBtn = document.createElement('button');
  extraNetworksBtn.setAttribute('id', `${prefix}_extra_networks_right_button`);
  extraNetworksBtn.classList.add('nevysha', 'lg', 'primary', 'gradio-button');
  extraNetworksBtn.innerHTML = '<div>Extra Networks</div>';
  //click the original button to close the extra network
  extraNetworksBtn.addEventListener('click', (e) => {
    if (!e.isTrusted) return
    window.extraNetworkHandler[prefix]();
  });

  //add button to the begining of the wrapper div
  const rightPanBtnWrapper = document.querySelector(`div#right_button_wrapper`);
  rightPanBtnWrapper.insertBefore(extraNetworksBtn, rightPanBtnWrapper.firstChild);

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
    if (tab.id) {
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

const onloadSafe = (done) => {
  // try {
    onLoad(done);
  // } catch (e) {
  //   console.error("Failed to init Cozy Nest", e);
  //   done();
  // }
}

function createRightWrapperDiv() {
  const tab = document.querySelector(`div#tabs`);

  //create wrapper div for the button
  const rightPanBtnWrapper = document.createElement('div');
  rightPanBtnWrapper.setAttribute('id', `right_button_wrapper`);
  rightPanBtnWrapper.classList.add('nevysha', 'nevysha-right-button-wrapper');
  //add button to the begining of the tab
  tab.insertBefore(rightPanBtnWrapper, tab.firstChild);

  //add a button for image browser
  const cozyImgBrowserBtn = document.createElement('button');
  cozyImgBrowserBtn.setAttribute('id', `image_browser_right_button`);
  cozyImgBrowserBtn.classList.add('nevysha', 'lg', 'primary', 'gradio-button');
  cozyImgBrowserBtn.innerHTML = `<div>Cozy Image Browser</div>`;
  cozyImgBrowserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  rightPanBtnWrapper.appendChild(cozyImgBrowserBtn);

  //create a panel to display Cozy Image Browser
  const cozyImgBrowserPanel =
    `<div id="cozy_img_browser_panel" class="nevysha cozy-img-browser-panel slide-right-browser-panel" style="display: none">
      <div class="nevysha slide-right-browser-panel-container nevysha-scrollable">
        <div class="nevysha" id="cozy-img-browser-react"/>
      </div>
    </div>`;
  //add the panel to the end of the tab
  tab.insertAdjacentHTML('beforeend', cozyImgBrowserPanel);

  // Create a vertical line component
  const lineWrapper = createVerticalLineComp();
  const cozyImgBrowserPanelWrapper = document.querySelector('#cozy_img_browser_panel');
  //set cozyImgBrowserPanelWrapper.style.width from local storage value if it exists
  const cozyImgBrowserPanelWidth = localStorage.getItem('cozyImgBrowserPanelWrapper');
  if (cozyImgBrowserPanelWidth) {
    cozyImgBrowserPanelWrapper.style.width = cozyImgBrowserPanelWidth;
  }
  cozyImgBrowserPanelWrapper.appendChild(lineWrapper)

  //TODO refactor to factorise code bellow with extraNetwork
  //add a close button inside the line
  const closeCozyImgBrowser = document.createElement('button');
  closeCozyImgBrowser.setAttribute('id', `floating_close_cozy_img_browser_panel_button`);
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
  lineWrapper.addEventListener('mousedown', function(e) {
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
      localStorage.setItem(`cozyImgBrowserPanelWrapper`, cozyImgBrowserPanelWrapper.style.width);

      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
    }
  });

  //add listener to open or close the panel using jquery animate
  cozyImgBrowserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const panel = document.querySelector('#cozy_img_browser_panel');
    if (panel.style.display === 'none') {
      panel.style.display = 'flex'
      panel.style.marginRight = `-${panel.offsetWidth}px`;
      $(panel).animate({"margin-right": `+=${panel.offsetWidth}`}, 350);
    }
    else {
      $(panel).animate({"margin-right": `-=${panel.offsetWidth}`}, 350, () => {
        panel.style.display = 'none'
      });
    }
  });
}

function setButtonVisibilityFromCurrentTab(id) {

  //hide each button that ends with extra_networks_right_button
  const extraNetworksRightBtns = document.querySelectorAll(`button[id$="extra_networks_right_button"]`);
  extraNetworksRightBtns.forEach((btn) => {
    btn.style.display = 'none';

  })
  if (id === 'tab_txt2img') {
    document.querySelector('button#txt2img_extra_networks_right_button').style.display = 'flex';
  }
  if (id === 'tab_img2img') {
    document.querySelector('button#img2img_extra_networks_right_button').style.display = 'flex';
  }
}

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

const recalcOffsetFromMenuHeight = () => {
  const menu = document.querySelector('.tab-nav.nevysha-tabnav')

  const $app = $('.gradio-container.app');

  const menuHeight = menu.offsetHeight;

  $app.attr('style', `${$app.attr('style')} padding-top: ${menuHeight}px !important;`);
  document.querySelector(':root').style.setProperty('--nevysha-menu-fix-top-height-less', `${menuHeight +2}px`);
}

const onLoad = (done) => {

  let gradioApp = window.gradioApp;
  if (typeof gradioApp !== "function") {
    setTimeout(() => onloadSafe(done), 200);
    return
  }


  const quicksettings = gradioApp().getElementById("quicksettings")

  if (!quicksettings) {
    setTimeout(() => onloadSafe(done), 200);
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
  //add .nevysha-scrollable to each .extra-network-cards
  document.querySelectorAll('.extra-network-cards').forEach(elem => elem.setAttribute('class', `${elem.getAttribute('class')} nevysha nevysha-scrollable`))
  document.querySelector('#nevyui_sh_options_start_socket').setAttribute('style', 'display: none;')
  //hide "send to" panel in settings
  //this panel is used to transfert image data into tab
  document.querySelector('#nevysha-send-to').setAttribute('style', 'display: none;')

  //create a wrapper div on the right for slidable panels
  createRightWrapperDiv();
  onUiTabChange(() => {
    console.log(get_uiCurrentTabContent().id)
    setButtonVisibilityFromCurrentTab(get_uiCurrentTabContent().id);
  });

  //manage text2img tab
  const nevysha_magic = (bundle) => {
    wrapSettings(bundle);
    wrapDataGenerationInfo(bundle);
    addDraggable(bundle);
    addScrollable(bundle);
    tweakExtraNetworks(bundle);
    addExtraNetworksBtn(bundle);

    const {prefix} = bundle;
    //click to fetch html tab
    document.querySelector(`button#${prefix}_extra_networks`).click();
  }

  nevysha_magic({prefix: "txt2img"});
  nevysha_magic({prefix: "img2img"});

  setButtonVisibilityFromCurrentTab(get_uiCurrentTabContent().id);

  //general
  tweakButtonsIcons();

  //style tweak to be MORE IMPORTANT than important
  gradioApp().querySelector('.tabs').querySelectorAll(".block.padded:not(.gradio-accordion, .gradio-dropdown, #nevyui_sh_options)").forEach(elem => elem.setAttribute("style", `${elem.getAttribute("style")} padding: 10px !important;`))
  gradioApp().querySelectorAll('#quicksettings > div.block').forEach(elem => elem.style.padding = "0 !important")

  //add expend to inpainting
  tweakInpainting();

  //tweak webui setting page for Cozy Nest directly with JS because... gradio blblblbl
  tweakNevyUiSettings();

  //load settings
  applyCozyNestConfig();
  recalcOffsetFromMenuHeight();

  //add tab wrapper
  addTabWrapper();

  //apply theme
  if (getTheme() === "light") {
    document.querySelector("body").classList.add("nevysha-light")
    document.querySelectorAll('.gradio-accordion').forEach(elem => elem.setAttribute("style", `${elem.getAttribute("style")} box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3) !important;`))
  }
  else {
    document.querySelector("body").classList.remove("nevysha-light")
  }

  //make settings draggable
  makeSettingsDraggable();

  //load /assets/index-eff6a2cc.js
  loadCozyNestImageBrowserSubmodule();

  /* --------------- TWEAK SOME EXTENSION --------------- */
  //if AWQ-container is present in COZY_NEST_CONFIG.extensions array from localStorage, tweak AWQ
  if (COZY_NEST_CONFIG.extensions
      && COZY_NEST_CONFIG.extensions.length > 0
      && COZY_NEST_CONFIG.extensions.includes("SDAtom-WebUi-client-queue-ext")) {
    tweakAWQ();
  }

  done();
};

async function loadCozyNestImageBrowserSubmodule() {
  try {
    const jsModule = await fetch(`file=extensions/Cozy-Nest/cozy-nest-image-browser/assets/index.js?t=${Date.now()}`);
    eval(await jsModule.text());
  }
  catch (err) {
    // handle any errors that occur during the import process
    console.error("Failed to load cozy-nest-image-browser submodule", err);
  }
}

document.addEventListener("DOMContentLoaded", async function() {

  //check if the param CozyNest=No is present in the url
  const urlParams = new URLSearchParams(window.location.search);
  const cozyNestParam = urlParams.get('CozyNest');
  if (cozyNestParam === "No") {
    console.log("Cozy Nest disabled by url param")
    //remove the css with Cozy-Nest in the url
    document.querySelectorAll('link').forEach(link => {
      if (link.href.includes("Cozy-Nest")) link.remove()
    })
    return
  }

  const maybeLightThemeClass = getTheme() === "light" ? "nevysha-light" : ""

  //add a full screen div hiding while the app is loading
  const pushLoading = () => {

    if (document.querySelector('#nevysha-loading')) return

    const loading =
      `<div id='nevysha-loading-wrap' class='nevysha ${maybeLightThemeClass}'>
          <div id='nevysha-loading' class='nevysha'>
            <div class="nevysha-loading-progress">
              <div class="nevysha-cozy-nest-app-name animate__animated animate__backInLeft">
                  Cozy Nest
              </div>
              ${loading_roll}
              <div id="loading_step_estimator" class="subtext3 animate__animated animate__pulse animate__infinite">
                1
              </div>
              <div class="subtext1 animate__animated animate__pulse animate__infinite">
                  Loading The Magic
              </div>
              <div class="subtext2 animate__animated animate__pulse animate__infinite">
                (and gradio)
              </div>
            </div>
            ${waves}
            <div class="footer">Made by Nevysha with <span class="heart">❤</span> and <span class="coffee">☕</span></div>
          </div>
        </div>`
    document.querySelector('body').insertAdjacentHTML('beforeend', loading);

    //get config from local storage COZY_NEST_CONFIG
    let config = JSON.parse(localStorage.getItem("COZY_NEST_CONFIG"))
    //merge with dummy config to avoid warning
    config = {...{waves_color: "#ffffff", bg_gradiant_color: "#ffffff", accent_color: "#ffffff"}, ...config}

    applyWavesColor(config.waves_color)
    applyBgGradiantColor(config.bg_gradiant_color);
    applyAccentColor(config.accent_color, config.accent_color);


  }
  pushLoading();

  // Create a new observer instance
  let step = 0;
  //get last loaded time. If null or zero, set it to 15000ms
  //since last update, I have to click on extra network button to load the HTML. That's why I add 2000ms (:
  //the clean way would be to set a small timeout before removing the mutation observer but, eh, I'm lazy atm
  const lastLoadingTimeSaved = SimpleTimer.last(COZY_NEST_GRADIO_LOAD_DURATION) + 2000
  const lastLoadingTime = lastLoadingTimeSaved ? lastLoadingTimeSaved : 15000
  //observer to update loading percentage
  const observer = new MutationObserver(function(mutations) {
    if (mutations[0].target.id !== 'loading_step_estimator') {

      //current elapsed loading time
      const currentLoadingTime = SimpleTimer.get(COZY_NEST_GRADIO_LOAD_DURATION)

      if (currentLoadingTime < lastLoadingTime + 1000) {
        //estimate the percentage of loading. Never go above 99%
        const percentage = Math.min(Math.round((currentLoadingTime / lastLoadingTime) * 100), 99)

        document.querySelector("#loading_step_estimator").innerText = `${percentage}%`
      }
      else {
        document.querySelector("#loading_step_estimator").innerText = `Woops, it's taking longer than expected...`
      }

      pushLoading();
    }
  });

  // Configure the observer to watch for changes to the body element and its descendants
  const config = { attributes: true, childList: true, subtree: true };
  observer.observe(document.body, config);


  try {
    // dynamically import jQuery library
    await jsDynamicLoad('file=extensions/Cozy-Nest/assets/jquery-3.6.4.min.js');
  }
  catch (err) {
    // handle any errors that occur during the import process
    console.error("Failed to load jQuery library", err);
  }

  try {
    await jsDynamicLoad('file=extensions/Cozy-Nest/assets/jquery-ui.min.js');
  }
  catch (err) {
    // handle any errors that occur during the import process
    console.error("Failed to load jquery-ui library", err);
  }

  setupPopupInstanceInfo();
  setupErrorHandling();

  // load showdown library
  $.getScript("file=extensions/Cozy-Nest/assets/showdown-1.9.1.min.js", function() {

  });

  onloadSafe(() => {
    console.log(`Cozy Nest running.`);
    //remove #nevysha-loading from DOM
    observer.disconnect();

    //wait for one second to let gradio finish request...
    setTimeout(() => document.querySelector("#nevysha-loading-wrap").remove(), 2000);

    SimpleTimer.end(COZY_NEST_DOM_TWEAK_LOAD_DURATION);
    SimpleTimer.end(COZY_NEST_GRADIO_LOAD_DURATION);
  });
});

function setupPopupInstanceInfo() {
  const dialogHtml =
    `
    <div id="dialog-message" title="🥺 Woops - Cozy Nest Error ?" style="display:none;">
      <p class="cozynest-error-tips">Want to report an issue ? Screenshot me and post me on <a href="https://github.com/Nevysha/Cozy-Nest">Github</a></p>
      <fieldset>
        <legend>Instance info</legend>
        <div class="versions cozyerror" id="cozynest-error-instance-info"></div>
      </fieldset>
      <fieldset>
        <legend>Extensions</legend>
        <div class="cozyerror" id="cozynest-error-extentions"></div>
      </fieldset>
      <div id="cozy_nest_error_handling_display"></div>
      <div id="cozy_nest_error_handling_display_stack" /></div>
    </div>
    `
  document.querySelector('body').insertAdjacentHTML('beforeend', dialogHtml);
}

function populateInstanceInfoDialog() {
  ///reset those
  document.querySelector('#cozy_nest_error_handling_display').innerHTML = '';
  document.querySelector('#cozy_nest_error_handling_display_stack').innerHTML = '';
  document.querySelector('#cozy_nest_error_handling_display_stack').setAttribute('style', 'display: none;');

  //gather instance info
  document.querySelector('#cozynest-error-instance-info').innerHTML = document.querySelector('.versions').innerHTML
    //add browser info
    + `<br><br>Browser: <span>${navigator.userAgent}</span>`
    //add window size
    + `<br><br>Window size: <span>${window.innerWidth}x${window.innerHeight}</span>`
  document.querySelector('#cozynest-error-extentions').innerHTML = document.querySelector('#tabs_extensions').querySelector('#extensions').parentElement.innerHTML;
  //for each tab row, check the first td input and hide the row if it's not checked
  document.querySelector('#cozynest-error-extentions > table').querySelectorAll('tr').forEach(row => {
    if (!row.querySelector('td')) return;
    if (!row.querySelector('td').querySelector('label > input').checked) {
      row.setAttribute('style', 'display: none;')
    }
    //disable input
    else {
      row.querySelector('td').querySelector('label > input').setAttribute('disabled', 'disabled')
    }
  })
}

function showInstanceInfoDialog() {
  $("#dialog-message").dialog({
    modal: true,
    width: window.innerWidth - 100,
    height: window.innerHeight - 100,
    buttons: {
      Ok: function () {
        $(this).dialog("close");
      }
    }
  });
}

/**
 * Called from gradio generated code
 */
function gatherInfoAndShowDialog() {
  populateInstanceInfoDialog();
  showInstanceInfoDialog();
}

function setupErrorHandling() {

  //set a global error handler
  window.addEventListener('error', function ({message, filename , lineno, colno, error }) {

    // get setting_nevyui_errorPopup checkbox value
    const errorPopup = document.querySelector('#setting_nevyui_errorPopup').querySelector("input").checked;
    if (!errorPopup) return;

    //if filename does not contains Cozy-Nest, ignore
    if (!filename.toLowerCase().includes('cozy-nest')) return;

    // Handle the error here
    populateInstanceInfoDialog();
    document.querySelector('#cozy_nest_error_handling_display').innerHTML = `An error occurred: ${message} at ${filename } line ${lineno} column ${colno}`;
    document.querySelector('#cozy_nest_error_handling_display_stack').innerHTML = error.stack;
    document.querySelector('#cozy_nest_error_handling_display_stack').setAttribute('style', 'display: block;');
    showInstanceInfoDialog();
  });
}

/**
 * While jQuery has not been loaded we have to manually handle script load the old way
 * @returns {Promise<unknown>}
 */
function jsDynamicLoad(src) {
  return new Promise(function(resolve, reject) {
    const script = document.createElement('script');
    script.src = src;

    script.onload = function() {
      resolve();
    };

    script.onerror = function() {
      reject(new Error('Failed to load script jQuery'));
    };

    document.head.appendChild(script);
  });
}

// create a SimpleTimer class
class SimpleTimer {

    static timers = {};

    // static method to create a new instance of SimpleTimer
    static time(timerName) {
        SimpleTimer.timers[timerName] = new SimpleTimer(timerName)
        return SimpleTimer.timers[timerName];
    }

    static end(timerName) {
        return SimpleTimer.timers[timerName].end();
    }

    static last(timerName) {
        return localStorage.getItem(timerName) && Number(localStorage.getItem(timerName));
    }

    static get(timerName) {
      return SimpleTimer.timers[timerName].get();
    }

    // constructor
    constructor(timerName) {
        this.timerName = timerName;
        this.startTime = new Date();
    }

    // method to get the elapsed time
    get() {
        const endTime = new Date();
        const timeDiff = endTime - this.startTime; //in ms
        return timeDiff;
    }

    // method to end the timer
    end() {
        const endTime = new Date();
        const timeDiff = endTime - this.startTime; //in ms

        //save the time in the local storage
        localStorage.setItem(this.timerName, `${timeDiff}`);

        return timeDiff;
    }
}

let COZY_NEST_CONFIG;

async function fetchCozyNestConfig() {
  const response = await fetch(`file=extensions/Cozy-Nest/nevyui_settings.json?t=${Date.now()}`);
  if (response.ok) {
    COZY_NEST_CONFIG = await response.json();
    //save in local storage
    localStorage.setItem('COZY_NEST_CONFIG', JSON.stringify(COZY_NEST_CONFIG));
  }
}

(async () => {

  SimpleTimer.time(COZY_NEST_GRADIO_LOAD_DURATION);

  // Create a new link element and set its attributes
  const animateCssLink = document.createElement('link');
  animateCssLink.rel = 'stylesheet';
  animateCssLink.type = 'text/css';
  animateCssLink.href = 'file=extensions/Cozy-Nest/assets/animate-4.1.1.min.css';

  // Append the link element to the document head
  document.head.appendChild(animateCssLink);

  // Google Fonts link
  const googleFontsLink = document.createElement('link');
  googleFontsLink.rel = 'stylesheet';
  googleFontsLink.type = 'text/css';
  googleFontsLink.href = 'https://fonts.googleapis.com/css?family=Caveat';

  // Append the link element to the document head
  document.head.appendChild(googleFontsLink);

  // Cozy-Nest-Image-Browser link
  const cozyNestImageBrowserLink = document.createElement('link');
  cozyNestImageBrowserLink.rel = 'stylesheet';
  cozyNestImageBrowserLink.type = 'text/css';
  cozyNestImageBrowserLink.href = `file=extensions/Cozy-Nest/cozy-nest-image-browser/assets/index.css?t=${Date.now()}`;

  // Append the link element to the document head
  document.head.appendChild(cozyNestImageBrowserLink);

  // JQuery UI link
  const jqueryUiLink = document.createElement('link');
  jqueryUiLink.rel = 'stylesheet';
  jqueryUiLink.type = 'text/css';
  jqueryUiLink.href = `file=extensions/Cozy-Nest/assets/jquery-ui.css?t=${Date.now()}`;

  // Append the link element to the document head
  document.head.appendChild(jqueryUiLink);

  // fetch file=extensions/Cozy-Nest/nevyui_settings.json. add Date to avoid cache
  await fetchCozyNestConfig();

})();

//dummy method
const dummyLoraCard = () => {
  const container = document.querySelector("#txt2img_lora_cards");

  // Get the first child element of the container
  const firstChild = container.firstChild;

  // Duplicate the first child element 100 times and append them to the fragment
  for (let i = 0; i < 100; i++) {
    const clone = container.querySelector('.card').cloneNode(true);
    container.insertBefore(clone, firstChild);
  }
};

const dummyControlNetBloc = () => {
  const container = document.querySelector("#txt2img_controlnet");

  // Get the parent element of the container
  const parent = container.parentElement;

  // Duplicate the first child element 100 times and append them to the fragment
  for (let i = 0; i < 100; i++) {
    const clone = parent.cloneNode(true);
    parent.parentElement.insertBefore(clone, parent);
  }
}

const dummySubdirs = () => {
  const $subdirs = $('#txt2img_lora_subdirs');
  $subdirs.append($subdirs.html());
}
