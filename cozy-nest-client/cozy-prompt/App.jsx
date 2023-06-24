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
import {Button} from "../image-browser/App.jsx";
import {Column, Row} from "../main/Utils.jsx";
import {ButtonWithConfirmDialog} from "../chakra/ButtonWithConfirmDialog.jsx";
import DOM_IDS from "../main/dom_ids.js";

export function App({parentId, containerId, tabId}) {

  let savedHeight = localStorage.getItem(`cozy-prompt-height-${containerId}`);
  savedHeight = savedHeight ? parseInt(savedHeight) : 200;

  const nativeTextarea = document.querySelector(`#${parentId} label textarea`);

  const [nativeIsVisible, setNativeIsVisible] = useState(false);
  const nativeTextareaValue = useExternalTextareaObserver(`#${parentId} label textarea`);

  const lastPrompt = '';
  const [prompt, setPrompt] = useState(lastPrompt);
  const editor = useRef();

  const [height, setHeight] = useState(savedHeight);
  const [dragging, setDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const propagate = () => {
    nativeTextarea.value
      = prompt

    const event = new Event('input')
    nativeTextarea.dispatchEvent(event)
  }

  useEffect(() => {
    if (COZY_NEST_CONFIG.save_last_prompt_local_storage) {
      localStorage.setItem(`cozy-prompt-${containerId}`, prompt);
    }
  }, [prompt]);

  useEffect(() => {

    //hide native button
    document.querySelector(`#${DOM_IDS.get('clear_prompt')(tabId)}`).style.display = 'none';
    document.querySelector(`#tab_${tabId} button#paste`).style.display = 'none';

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
    if (!nativeIsVisible) {
      nativeTextarea.style.display = 'none';
    }
    else {
      nativeTextarea.style.display = 'block';
      //margin-top: 40px;
      nativeTextarea.style.marginTop = '40px';
    }
  }, [nativeIsVisible]);

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
        localStorage.setItem(`cozy-prompt-height-${containerId}`, String(newHeight));
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
    setNativeIsVisible(!nativeIsVisible);
  }

  function prettify() {
    setPrompt(prompt.replaceAll('),', '),\n'))
  }

  function clearPrompt() {
    document.querySelector(`#${tabId}_clear_prompt`).click()
  }
  function redoLastPrompt() {
    document.querySelector(`#tab_${tabId} button#paste`).click()
  }

  function onLoadEditor(editor) {
    editor.renderer.setPadding(10);
    editor.renderer.setScrollMargin(10);
  }

  function isBoldCursor() {
    return COZY_NEST_CONFIG.carret_style === 'bold'
  }

  return (
    <Column
      style={{
      width: '100%'}}
    >
      <div
        className={isBoldCursor() ? "CozyPrompt bold-cursor" : "CozyPrompt"}
        style={{ height: `${height}px` }}
      >
        <AceEditor
          ref={editor}
          onLoad={onLoadEditor}
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
      </div>
      <Row>
        <Button onClick={prettify}>Prettify</Button>
        <Button onClick={toggleNative}>{nativeIsVisible ? "Hide" : "Show"} native textarea</Button>
        <Button onClick={redoLastPrompt}>Redo last prompt</Button>
        <ButtonWithConfirmDialog
          style={{height: '100%'}}
          message='Delete prompt ?'
          confirmLabel='Yes'
          buttonLabel='Clear prompt'
          cancelLabel="No"
          onConfirm={() => clearPrompt()}
        />
      </Row>
      <div
        onMouseDown={handleMouseDown}
        className="CozyPrompt__resize-handle"
      >
        <div className="CozyPrompt__resize-handle-line" />
      </div>
    </Column>
  );
}