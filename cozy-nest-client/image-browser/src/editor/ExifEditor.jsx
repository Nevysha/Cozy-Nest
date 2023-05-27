import React, {useEffect, useRef, useState} from "react";
import {Button} from "../App.jsx";

import 'ace-builds'
ace.config.setModuleUrl("ace/mode/json_worker", 'cozy-nest-client/node_modules/ace-builds/src-noconflict/worker-json.js')

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";

export function ExifEditor(props) {

    const [exif, setExif] = useState('');
    const [exifString, setExifString] = useState('');
    const [visible, setVisible] = useState(props.visible);
    const [isJsonValid, setIsJsonValid] = useState(false);

    useEffect(() => {
        const _exif = {...props.exif, "cozy-nest-tags":"Favorites"}
        setExif(_exif)
        setVisible(props.visible)
        setExifString(JSON.stringify(_exif))
    }, [props.exif, props.visible])

    const handleChange = (text) => {
        setExifString(text)
        try {
            const _exif = JSON.parse(text)
            setExif(_exif)
            setIsJsonValid(true)
        } catch (e) {
            setIsJsonValid(false)
        }
    }

    return (
        <>
            {visible &&
                <div className="ExifEditor backdrop">
                    <div className="container">
                        <h1>Exif Editor</h1>
                        <AceEditor
                          mode="json"
                          theme="monokai"
                          showPrintMargin={false}
                          onChange={handleChange}
                          value={exifString}
                          name="ace-json-editor"
                          editorProps={{ $blockScrolling: true }}
                          style={{width: "100%", height: "100%", zIndex: 200}}
                          setOptions={{
                              enableSnippets: true,
                              cursorStyle: "smooth",
                              behavioursEnabled: true,
                              wrapBehavioursEnabled: true,
                              autoScrollEditorIntoView: true,
                              wrap: true,
                          }}
                        />
                        <Button disabled={!isJsonValid}>{isJsonValid ? "Save" : "Invalid JSON"}</Button>
                        <Button onClick={() => setVisible(false)}>Close</Button>
                    </div>
                </div>
            }
            {!visible &&
                <div/>
            }
        </>
    );
}