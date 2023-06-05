import React, {useEffect, useRef, useState} from "react";

import 'ace-builds'
// ace.config.setModuleUrl(
//   "ace/mode/json_worker",
//   'cozy-nest-client/node_modules/ace-builds/src-noconflict/worker-json.js')
ace.config.setModuleUrl(
  "ace/mode/prompt_highlight_rules",
  "cozy-nest-client/cozy-prompt/prompt_highlight_rules.js");
ace.config.setModuleUrl(
  "ace/mode/prompt",
  "cozy-nest-client/cozy-prompt/mode-prompt.js");

import AceEditor from "react-ace";
import "./prompt_highlight_rules.js";
import "./mode-prompt.js";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/ext-language_tools";

import './CozyPrompt.css'
import useExternalTextareaObserver from "./useExternalTextareaObserver.js";


export function App() {

  const nativeTextarea = document.querySelector('#txt2img_prompt label textarea');
  nativeTextarea.style.display = 'none';

  const [nativeIsVisible, setNativeIsVisible] = useState(true);
  const nativeTextareaValue = useExternalTextareaObserver('#txt2img_prompt label textarea');

  const [prompt, setPrompt] = useState('');
  const editor = useRef();

  const [height, setHeight] = useState(200);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const propagate = () => {

    nativeTextarea.value
      = prompt

    const event = new Event('input')
    nativeTextarea.dispatchEvent(event)

  }

  useEffect(() => {

    const handlePromptChange = (event) => {
      setPrompt(event.target.value)
    }

    nativeTextarea.addEventListener('change', handlePromptChange)

    return () => {
      nativeTextarea.removeEventListener('change', handlePromptChange)
    }
  }, []);

  useEffect(() => {
    setPrompt(nativeTextareaValue)
  }, [nativeTextareaValue]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (dragging) {
        setDragging(false);
      }
    };
    const handleGlobalMouseMove = (event) => {
      if (dragging) {
        const newHeight = height + event.clientY - startY;
        setHeight(newHeight);
        setStartY(event.clientY);
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [dragging]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    setDragging(true);
    setStartY(event.clientY);
  };

  const toggleNative = () => {
    if (nativeIsVisible) {
      nativeTextarea.style.display = 'none';
    }
    else {
      nativeTextarea.style.display = 'block';
    }
    setNativeIsVisible(!nativeIsVisible);
  }

  return (
    <div
      className="CozyPrompt"
      style={{ height: `${height}px` }}
    >
      <AceEditor
        ref={editor}
        mode="prompt"
        theme="github_dark"
        showPrintMargin={false}
        onChange={setPrompt}
        onBlur={propagate}
        value={prompt}
        name="ace-prompt-editor"
        editorProps={{ $blockScrolling: true }}
        style={{width: "100%", height: "100%"}}
        setOptions={{
          animatedScroll: true,
          enableSnippets: true,
          cursorStyle: "smooth",
          behavioursEnabled: true,
          wrapBehavioursEnabled: true,
          autoScrollEditorIntoView: true,
          wrap: true,
          fontSize: "15px",
          fontFamily: "monospace",
        }}
      />
      <div
        onMouseDown={handleMouseDown}
        className="CozyPrompt__resize-handle"
       />
    </div>
  );
}