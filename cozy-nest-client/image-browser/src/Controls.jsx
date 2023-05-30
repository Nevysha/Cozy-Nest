import React, {useContext, useEffect, useState} from "react";
import {CozyLogger} from "../../main/CozyLogger.js";
import {Button, Column, Row} from "./App.jsx";

import './editor/ExifEditor.css'
import Exif from "./editor/ExifEditor.jsx";
import {ImagesContext} from "./ImagesContext.tsx";

const ExifEditor = Exif.ExifEditor


function SendTo({image}) {

    const sendToPipe = (e, where) => {

        e.preventDefault()
        e.stopPropagation()

        if (window.sendToPipe) {
            let _img = {src: `/cozy-nest/image?path=${image.path}`}
            window.sendToPipe(where, _img)
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

export function Controls({image}) {

    const {images, deleteImg, updateExifInState} = useContext(ImagesContext)

    const [showExifEditor, setShowExifEditor] = useState(false);
    const [exif, setExif] = useState({});
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        if (!image.path) return
        setExif(image.metadata.exif)
    }, [image, images])

    useEffect(() => {
        if (!exif) return;

        setIsHidden(exif['cozy-nest-hidden'] === 'True')

    }, [exif, image, images])

    const editExif = async () => {
        setShowExifEditor(true)
    }

    const hideImg = async () => {
        const path = image.path

        exif['cozy-nest-hidden'] = "True"
        setExif(exif)

        await Exif.save(path, exif)
        updateExifInState(image)
    }
    const unhideImg = async () => {
        const path = image.path

        exif['cozy-nest-hidden'] = "False"
        setExif(exif)

        await Exif.save(path, exif)
        updateExifInState(image)
    }

    return (
        <Column style={{height: "100%", justifyContent: "space-between"}}>
            <SendTo image={image}/>
            <Column>
                <Row>
                    {showExifEditor &&
                        <ExifEditor image={image} exif={exif} visible={showExifEditor}
                                 onClose={() => setShowExifEditor(false)}/>
                    }
                    <Button onClick={editExif}>Edit Exif</Button>
                </Row>
                <Row>
                    {!isHidden && <Button onClick={hideImg}>Hide</Button>}
                    {isHidden && <Button onClick={unhideImg}>Show</Button>}
                    <Button onClick={() => deleteImg('archive', image)}>Move to archive</Button>
                    <Button onClick={() => deleteImg('delete', image)}>Delete</Button>
                </Row>
            </Column>
        </Column>
    );
}