export const getTheme = () => {
  const gradioURL = window.location.href
  if (!gradioURL.includes('?__theme=')) {
    return 'dark'
  }
  return gradioURL.split('?__theme=')[1];
}

export const hexToRgb = (hex) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r} ${g} ${b}`;
}

export const isUpToDate = (current, remote) => {
  const v1 = current.split('.');
  const v2 = remote.split('.');

  for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
    const num1 = parseInt(v1[i]) || 0;
    const num2 = parseInt(v2[i]) || 0;

    if (num1 < num2) {
      return false;
    } else if (num1 > num2) {
      return true;
    }
  }

  return true;  // Both versions are equal
}

export const getLuminance = (hexcolor) => {
  // remove # character from hex color string
  const hex = hexcolor.replace('#', '');

  // convert hex color to RGB values
  const r = parseInt(hex.substr(0,2),16);
  const g = parseInt(hex.substr(2,2),16);
  const b = parseInt(hex.substr(4,2),16);

  // calculate the relative luminance of the color
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

//dummy method
export const dummyLoraCard = () => {
  const container = document.querySelector("#txt2img_lora_cards");

  // Get the first child element of the container
  const firstChild = container.firstChild;

  // Duplicate the first child element 100 times and append them to the fragment
  for (let i = 0; i < 100; i++) {
    const clone = container.querySelector('.card').cloneNode(true);
    container.insertBefore(clone, firstChild);
  }
};

export const dummyControlNetBloc = () => {
  const container = document.querySelector("#txt2img_controlnet");

  // Get the parent element of the container
  const parent = container.parentElement;

  // Duplicate the first child element 100 times and append them to the fragment
  for (let i = 0; i < 100; i++) {
    const clone = parent.cloneNode(true);
    parent.parentElement.insertBefore(clone, parent);
  }
}

export const dummySubdirs = () => {
  const $subdirs = $('#txt2img_lora_subdirs');
  $subdirs.append($subdirs.html());
}
