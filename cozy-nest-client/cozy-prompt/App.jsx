import React, {useState} from "react";

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
import {CozyLogger} from "../main/CozyLogger.js";


export function App() {

  const [prompt, setPrompt] = useState('');

  const reformat = () => {

    //replace ")," with "),\n"
    document.querySelector('#txt2img_prompt textarea').value
      = prompt

  }

  return (
    <div className="CozyPrompt">
      <AceEditor
        mode="prompt"
        theme="github_dark"
        showPrintMargin={false}
        onChange={setPrompt}
        onBlur={reformat}
        value={prompt}
        name="ace-prompt-editor"
        editorProps={{ $blockScrolling: true }}
        style={{width: "100%", height: "100%", zIndex: 200}}
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
  );
}