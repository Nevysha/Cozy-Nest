import React, {useContext, useEffect, useRef, useState} from "react";
import {Button} from "../App.jsx";

import 'ace-builds'
ace.config.setModuleUrl("ace/mode/json_worker",
  // `/cozy-nest-client/assets/index.js?t=${Date.now()}
  '/cozy-nest-client/assets/worker-json.js')

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import {CozyLogger} from "../../main/CozyLogger.js";
import {ImagesContext} from "../ImagesContext.tsx";

export function ExifEditor({onClose, visible, imageHash}) {

    const [exif, setExif] = useState({});
    const [exifString, setExifString] = useState('');
    const [isJsonValid, setIsJsonValid] = useState(false);

    const {images, getImage} = useContext(ImagesContext)

    const [image, setImage] = useState(
      getImage(imageHash)
    );

    useEffect(() => {
        setImage(getImage(imageHash));
    }, [images, imageHash]);

    useEffect(() => {
        setExif(image.metadata.exif)
        setExifString(JSON.stringify(image.metadata.exif, null, 2))
        setIsJsonValid(true)
    }, [visible, image])

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

    const save = async () => {
        if (!isJsonValid) {
            return
        }
        const path = image.path
        await saveExif(path, exif)
    }

    const close = () => {
        onClose()
    }

    return (
        <>
            {visible &&
                <div className="ExifEditor backdrop">
                    <div className="container">
                        <h1>Exif Editor</h1>
                        <AceEditor
                          mode="json"
                          theme="github_dark"
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
                        <Button disabled={!isJsonValid} onClick={save}>{isJsonValid ? "Save" : "Invalid JSON"}</Button>
                        <Button onClick={() => close()}>Close</Button>
                    </div>
                </div>
            }
            {!visible &&
                <div/>
            }
        </>
    );
}

export async function saveExif(path, exif) {

    // check if path is URL encoded
    if (path.indexOf('%') !== -1) {
        path = decodeURIComponent(path)
    }

    //check if exif['cozy-nest-tags'] contains only ',' or only any number of ','
    if (exif['cozy-nest-tags'] && exif['cozy-nest-tags'].match(/^,+$/g)) {
        exif['cozy-nest-tags'] = ''
    }


    const response = await fetch(`/cozy-nest/image-exif`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            //decode path from url
            path: path,
            data: exif
        })
    })
    const json = await response.json()
    CozyLogger.debug('json', json)

}

export default {
    save: saveExif,
    ExifEditor: ExifEditor
}