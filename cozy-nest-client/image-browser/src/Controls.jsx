import React, {useEffect, useState} from "react";
import {CozyLogger} from "../../main/CozyLogger.js";
import {Button, Column, Row} from "./App.jsx";
import * as PropTypes from "prop-types";

import './ExifEditor.css'
import {ExifEditor, saveExif} from "./editor/ExifEditor.jsx";


function SendTo(props) {

    const sendToPipe = (e, where) => {

        e.preventDefault()
        e.stopPropagation()

        if (window.sendToPipe) {
            window.sendToPipe(where, props.imgRef.current)
        } else {
            console.log(`mock sendToPipe(${where}, ${props.imgRef.current.src})`)
        }
    }

    return <Row>
        <Button onClick={(e) => sendToPipe(e, 'txt2img')}
        >txt2img</Button>
        <Button onClick={(e) => sendToPipe(e, 'img2img')}
        >img2img</Button>
        <Button onClick={(e) => sendToPipe(e, 'inpainting')}
        >inpainting</Button>
    </Row>;
}

export function Controls(props) {

    const [showExifEditor, setShowExifEditor] = useState(false);
    const [exif, setExif] = useState();
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        if (!props.imgRef.current) return
        if (!props.imgRef.current.src) return

        (async () => {
            const path = props.imgRef.current.src.split('path=')[1]
            const exif = await fetch(`/cozy-nest/image-exif?path=${path}`).then(r => r.json());
            setExif(exif)
        })()
    }, [props.imgRef])

    useEffect(() => {
        if (!exif) return;

        setIsHidden(exif['cozy-nest-hidden'] === 'True')

    }, [exif])

    const editExif = async () => {
        setShowExifEditor(true)
    }

    const deleteImg = async (what) => {
        if (!props.deleteImg) {
            CozyLogger.log('deleteImg props missing')
            return
        }
        const path = props.imgRef.current.src.split('path=')[1]
        await props.deleteImg(what, path)
    }

    const hideImg = async () => {
        const path = props.imgRef.current.src.split('path=')[1]

        exif['cozy-nest-hidden'] = true
        setExif(exif)

        await saveExif(path, exif)
    }

    return (
        <Column style={{height: "100%", justifyContent: "space-between"}}>
            <SendTo imgRef={props.imgRef}/>
            <Column>
                <Row>
                    <ExifEditor exif={exif} visible={showExifEditor} onClose={() => setShowExifEditor(false)} imgRef={props.imgRef} />
                    <Button onClick={editExif}>Edit Exif</Button>
                </Row>
                <Row>
                    {!isHidden && <Button onClick={hideImg}>Hide</Button>}
                    {isHidden && <Button onClick={hideImg}>Show</Button>}
                    <Button onClick={() => deleteImg('archive')}>Move to archive</Button>
                    <Button onClick={() => deleteImg('delete')}>Delete</Button>
                </Row>
            </Column>
        </Column>
    );
}

Controls.propTypes = {imgRef: PropTypes.any};