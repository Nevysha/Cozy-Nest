console.log("nevysha-ui.js")

const wrapDataGenerationInfo = () => {
  // Get the generation info container
  const previewBlocks = document.querySelectorAll('#tab_txt2img div#txt2img_results > *:not(#txt2img_results)');
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

function wrapSettings() {

  const settingsContainer = document.getElementById('txt2img_settings');

  // Get its children elements
  const settingsChildren = settingsContainer.querySelectorAll(':scope > :not(#txt2img_toprow)');

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
}

const addDraggable = () => {
  const settings = document.getElementById('txt2img_settings');

  // Create a new vertical line element
  const line = document.createElement('div');
  line.classList.add('vertical-line');

  // Insert the line element after the settings element
  settings.insertAdjacentElement('afterend', line);

  const container = settings.parentElement;
  container.classList.add('nevysha', 'resizable-children-container');
  const results = document.getElementById('txt2img_results');

  let isDragging = false;

  line.addEventListener('mousedown', () => {
    isDragging = true;
  });

  document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const containerWidth = container.offsetWidth;
    const mouseX = event.clientX;
    const linePosition = ((mouseX - 240) / containerWidth) * 100;

    settings.style.flexBasis = `${linePosition}%`;
    results.style.flexBasis = `${100 - linePosition}%`;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
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

  //add refreshBtn to the top of the page, pulled right
  const refreshBtn = "<button id='refreshBtn' class='nevysha lg primary gradio-button btn refresh'>Refresh UI</button>"
  const flex1 = "<div class='nevysha flex1' />"
  quicksettings.insertAdjacentHTML("beforeend", flex1)
  quicksettings.insertAdjacentHTML("beforeend", refreshBtn)
  document.getElementById("refreshBtn").addEventListener("click", () => {
    gradioApp().querySelector("#extensions_installed_top > button.lg.primary").click()
  })

  //get body from DOM
  const body = document.querySelector("body")

  //remove default body style
  body.style = ""

  //add triple wave div to the end of body for uwuness
  const waves = "<div><div class='wave'></div> <div class='wave'></div><div class='wave'></div></div>"
  body.insertAdjacentHTML('beforeend', waves);

  const tabs = document.querySelectorAll('#tabs > .tabitem')
  //add nevysha css class to each main tab
  tabs.forEach(tab => tab.setAttribute('class', `${tab.getAttribute('class')} nevysha`))

  //manage text2img tab
  //move toprow
  const topRow = document.getElementById('txt2img_toprow');
  const settingsContainer = document.getElementById('txt2img_settings');
  settingsContainer.insertBefore(topRow, settingsContainer.firstChild);

  wrapSettings();
  wrapDataGenerationInfo();
  addDraggable();

  //style tweak to be MORE IMPORTANT than important
  gradioApp().querySelectorAll(".block.padded:not(.gradio-accordion)").forEach(elem => elem.setAttribute("style", `${elem.getAttribute("style")} padding: 10px !important;`))

  console.log("nevysha-ui.js: DOMContentLoaded")
};

document.addEventListener("DOMContentLoaded", () => {
  onload();
});