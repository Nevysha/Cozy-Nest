import { useState, useEffect } from 'react';
import {CozyLogger} from "../main/CozyLogger.js";

const useExternalTextareaObserver = (textareaSelector) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    const observerCallback = (mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes') {
          const externalTextarea = document.querySelector(textareaSelector);
          setValue(externalTextarea.value);
        }
      }
    };

    const observerOptions = {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    };

    const observer = new MutationObserver(observerCallback);
    const externalTextarea = document.querySelector(textareaSelector);

    if (externalTextarea) {
      observer.observe(externalTextarea, observerOptions);
      setValue(externalTextarea.value);
    }

    return () => {
      observer.disconnect();
    };
  }, [textareaSelector]);

  return value;
};

export default useExternalTextareaObserver;
