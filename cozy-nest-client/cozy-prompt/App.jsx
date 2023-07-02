import React, {useEffect, useRef, useState} from "react";

import 'ace-builds'
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
import {Range as AceRange} from "ace-builds/src-noconflict/ace";
import {CozyLogger} from "../main/CozyLogger.js";
// ace.config.setModuleUrl(
//   "ace/mode/json_worker",
//   'cozy-nest-client/node_modules/ace-builds/src-noconflict/worker-json.js')
ace.config.setModuleUrl(
  "ace/mode/prompt_highlight_rules",
  "cozy-nest-client/cozy-prompt/prompt_highlight_rules.js");
ace.config.setModuleUrl(
  "ace/mode/prompt",
  "cozy-nest-client/cozy-prompt/mode-prompt.js");

const langTools = ace.require("ace/ext/language_tools");

export function App({parentId, containerId, tabId, resolve}) {

  let savedHeight = localStorage.getItem(`cozy-prompt-height-${containerId}`);
  savedHeight = savedHeight ? parseInt(savedHeight) : 200;

  const nativeTextarea = document.querySelector(`#${parentId} label textarea`);
  const textareaParent = nativeTextarea.parentElement;

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
    propagate();

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
      textareaParent.style.display = 'none';
    }
    else {
      textareaParent.style.display = 'block';
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

  function hasTAC() {
    return document.querySelector(`#${parentId} .autocompleteResults.${tabId}`) !== null
  }

  function setupCompleters() {

    const completer = {
      activated: true,
      autoShown: true,
      getCompletions: function (editor, session, pos, prefix, callback) {

        if (!hasTAC()) {
          CozyLogger.debug('setupCompleters: TAC not found')
          return;
        }

        setTimeout(() => {
          const completions = [];

          CozyLogger.group('getCompletions')

          let score = 0;

          document.querySelectorAll(`#${editor.parentId} .autocompleteResults.${editor.tabId} ul li`).forEach((el) => {

            let caption = el.querySelector('.acListItem').innerText;
            let value = el.querySelector('.acListItem').innerText;
            //if value contains ➝, keep only the part after
            if (value.includes('➝')) {
              value = value.split('➝')[1].trim();
            }

            let meta = el.querySelector('.acMetaText').innerText;

            const completion = {caption: caption, value: value, meta: meta, $score: score--};
            CozyLogger.debug(completion)
            completions.push(completion)
          })

          CozyLogger.groupEnd('getCompletions')

          callback(null, completions);
        }, 700);
      }
    }
    langTools.setCompleters([completer]);
  }

  function onLoadEditor(editor) {
    window[`${containerId}_editor`] = editor;
    CozyLogger.debug(`${containerId}_editor`)

    //keep context of editor inside autocomplete
    editor.parentId = parentId;
    editor.tabId = tabId;

    editor.renderer.setPadding(10);
    editor.renderer.setScrollMargin(10);

    editor.on('change', function(event, editor) { // sync for each change
      CozyLogger.debug('CHANGE:', event, editor)
    });

    // Define the command for Ctrl-Up
    editor.commands.addCommand({
      name: "incrementItem",
      bindKey: { win: "Ctrl-Up", mac: "Command-Up" },
      exec: function(editor) {
        editor.clearSelection();
        const currentPosition = editor.getCursorPosition();
        const currentLine = editor.session.getLine(currentPosition.row);
        const newItem = incrementItem(currentLine, currentPosition.column);
        const range = new AceRange(
            currentPosition.row,
            0,
            currentPosition.row,
            currentLine.length
        );
        editor.session.replace(range, newItem);
        editor.moveCursorToPosition({row:currentPosition.row, column:currentPosition.column});
      }
    });

    // Define the command for Ctrl-Down
    editor.commands.addCommand({
      name: "decrementItem",
      bindKey: { win: "Ctrl-Down", mac: "Command-Down" },
      exec: function(editor) {
        editor.clearSelection();
        const currentPosition = editor.getCursorPosition();
        const currentLine = editor.session.getLine(currentPosition.row);
        const newItem = decrementItem(currentLine, currentPosition.column);
        const range = new AceRange(
            currentPosition.row,
            0,
            currentPosition.row,
            currentLine.length
        );
        editor.session.replace(range, newItem);
        editor.moveCursorToPosition({row:currentPosition.row, column:currentPosition.column});
      }
    });

    setupCompleters();

    editor.setOptions({
      animatedScroll: true,
      cursorStyle: "smooth",
      behavioursEnabled: true,
      wrapBehavioursEnabled: true,
      autoScrollEditorIntoView: true,
      wrap: true,
      fontSize: "15px",
      fontFamily: "monospace",
      enableBasicAutocompletion: true
    })

    setTimeout(() => {
      resolve()
    }, 200);

  }

  // Helper function to increment the item
  function incrementItem(line, column) {
    const items = line.split(",");
    const index = getItemIndex(items, column);
    if (index !== -1) {
      const item = items[index];
      items[index] = updateItemCount(item, (count, strength) => count + strength);
    }
    return items.join(",");
  }

  // Helper function to decrement the item
  function decrementItem(line, column) {
    const items = line.split(",");
    const index = getItemIndex(items, column);
    if (index !== -1) {
      const item = items[index];
      items[index] = updateItemCount(item, (count, strength) => count - strength);
    }
    return items.join(",");
  }

  // Helper function to get the index of the item based on the column position
  function getItemIndex(items, column) {
    let index = -1;
    let currentPosition = 0;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (column >= currentPosition && column <= currentPosition + item.length) {
        index = i;
        break;
      }
      currentPosition += item.length + 1; // Add 1 for the comma
    }
    return index;
  }

  // Helper function to increment the count of the item
  function updateItemCount(item, updaterFn) {

    const itemStartWithSpace = item.startsWith(' ');
    const itemEndsWithSpace = item.endsWith(' ');
    let startSpace = itemStartWithSpace ? ' ' : '';
    let endSpace = itemEndsWithSpace ? ' ' : '';

    function reWrap(updatedItem) {
      return `${startSpace}${updatedItem}${endSpace}`
    }

    /**
     * Update the value of the item
     * @param _match
     * @param strength
     * @param isSpecial - true if the item is a special one (like lora)
     * @returns {*}
     */
    function updateValue(_match, strength, isSpecial) {
      const count = parseFloat(_match[2]);

      const precision = strength * 10 === 1 ? 10 : 100;
      const decimalCount = parseInt(String(precision), 2) / 2

      const incrementedCount = Math.round(updaterFn(count, strength) * precision) / precision;

      if (incrementedCount === 1 && !isSpecial) {
        // remove :1.0
        // remove first and last character
        return item.replace(`:${_match[2]}`, '').slice(1, -1);
      }

      return item.replace(_match[2], incrementedCount.toFixed(decimalCount));
    }

    item = item.trim();

    //if item does not contains '(' or '<' then it is a simple item
    if (!item.includes('(') && !item.includes('<')) {
      let baseCount = updaterFn(1.0, 0.1)
      const updatedItem = `(${item}:${baseCount.toFixed(1)})`;
      return reWrap(updatedItem);
    }

    //basic token
    let countRegex = /\(([^:]+):(\d+(\.\d+)?)\)/g;
    let match = countRegex.exec(item);
    if (match) {
      const updatedItem = updateValue(match, 0.1);
      return reWrap(updatedItem);
    }

    //token like lora, etc,
    countRegex = /<([^>]+):(\d+(\.\d+)?)>/g;
    match = countRegex.exec(item);
    if (match) {
      const updatedItem = updateValue(match, 0.05, true);
      return reWrap(updatedItem);
    }

  }

  function isBoldCursor() {
    return COZY_NEST_CONFIG.carret_style === 'bold'
  }

  function onChange(newValue) {
    closeAutoComplete();
    setPrompt(newValue);
  }

  function closeAutoComplete() {
    if (hasTAC()
        && editor.current
        && editor.current.editor
        && editor.current.editor.completer) {
      editor.current.editor.completer.detach();
    }
  }

  //force trigger autocomplete
  function triggerAutocomplete(event) {

    if (!hasTAC()) {
      CozyLogger.debug('setupCompleters: TAC not found')
      return;
    }

    if (!prompt || prompt === '') {
      return
    }

    //trim the prompt and check if last character is a comma
    const trimmedPrompt = prompt.trim();
    const lastChar = trimmedPrompt[trimmedPrompt.length - 1];
    if (lastChar === ',') {
      return;
    }

    const Autocomplete = ace.require("ace/autocomplete").Autocomplete;
    Autocomplete.startCommand.exec(editor.current.editor, {});

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
          onChange={onChange}
          onBlur={propagate}
          onInput={triggerAutocomplete}
          value={prompt}
          name="ace-prompt-editor"
          editorProps={{ $blockScrolling: true }}
          style={{width: "100%", height: "100%"}}
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