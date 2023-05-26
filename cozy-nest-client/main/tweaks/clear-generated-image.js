import {CozyLogger} from "../CozyLogger.js";
import {xmark} from "../svg.js";

export default function clearGeneratedImage({prefix}) {

  if (!COZY_NEST_CONFIG.enable_clear_button) {
    CozyLogger.debug('Clear button is disabled')
    return
  }

  const gallery = document.querySelector(`#${prefix}_gallery`);

  // Function to be called when a child with class 'empty' is removed
  function handleEmptyChildRemoved(observer) {
    clearButton.style.display = 'block';
  }

  // MutationObserver configuration
  const observerConfig = {
    childList: true, // Watch for changes in the child nodes
    subtree: true // Watch for changes in all descendants of the target node
  };

  // Callback function for the MutationObserver
  function mutationCallback(mutationsList, observer) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check if a child node has been removed
        if (mutation.removedNodes.length > 0) {
          const removedNode = mutation.removedNodes[0];
          if (removedNode.classList?.contains('empty')) {
            handleEmptyChildRemoved(observer);
          }
        }
      }
    }
  }

  // Create a new MutationObserver
  const observer = new MutationObserver(mutationCallback);

  // Start observing the target node
  observer.observe(gallery, observerConfig);

  function addClearButton() {
    const clearButton = document.createElement('button');
    clearButton.id = `${prefix}_gallery_clear_button`;
    clearButton.classList.add('nevysha', 'lg', 'primary', 'gradio-button');
    clearButton.style.display = 'none';
    clearButton.title = 'Clear generated images gallery';
    clearButton.innerHTML = xmark;
    clearButton.addEventListener('click', () => {
      gallery.querySelectorAll('img').forEach((img) => {
        if (img) {
          img.parentNode.style.display = 'none';
          watchForSrcChange(img);
        }
      });
      clearButton.style.display = 'none';
    });
    gallery.insertAdjacentElement('beforebegin', clearButton);
    return clearButton;
  }

  function watchForSrcChange(imgElement) {
    // Callback function for the MutationObserver
    function mutationCallback(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          imgElement.parentNode.style.display = 'block';
          observer.disconnect();
          clearButton.style.display = 'block';
        }
      }
    }

    // MutationObserver configuration
    const observerConfig = {
      attributes: true, // Watch for changes in the attributes
      attributeFilter: ['src'] // Only track changes in the src attribute
    };

    //  Create a new MutationObserver
    const observer = new MutationObserver(mutationCallback);

    // Start observing the target img element
    observer.observe(imgElement, observerConfig);
  }

  const clearButton = addClearButton();
}

