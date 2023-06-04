import React, {useContext, useEffect, useState} from "react";
import {CozyLogger} from "../main/CozyLogger.js";
import {Button} from "./App.jsx";
import {Column, Row} from "../main/Utils.jsx";

import './editor/ExifEditor.css'
import Exif from "./editor/ExifEditor.jsx";
import {ImagesContext} from "./ImagesContext.tsx";


function SendTo({imageHash}) {

    const {images, getImage} = useContext(ImagesContext)

    const [image, setImage] = useState(
      getImage(imageHash)
    );

    useEffect(() => {
        setImage(getImage(imageHash));
    }, [images, imageHash]);

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

export function Controls({imageHash}) {

    const {images, deleteImg, updateExifInState, getImage} = useContext(ImagesContext)

    const [showExifEditor, setShowExifEditor] = useState(false);
    const [exif, setExif] = useState({});
    const [isHidden, setIsHidden] = useState(false);

    const [image, setImage] = useState(
      getImage(imageHash)
    );

    useEffect(() => {
        setImage(getImage(imageHash));
    }, [images, imageHash]);

    useEffect(() => {
        if (!image || !image.path) return
        setExif(image.metadata.exif)
    }, [image, imageHash])

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

    const ExifEditor = Exif.ExifEditor

    return (
        <Column style={{height: "100%", justifyContent: "space-between"}}>
            <SendTo imageHash={imageHash}/>
            <Column>
                <Row>
                    {showExifEditor &&
                        <ExifEditor imageHash={imageHash} exif={exif} visible={showExifEditor}
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