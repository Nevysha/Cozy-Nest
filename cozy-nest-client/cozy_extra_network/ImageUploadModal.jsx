import React, {useEffect, useState} from "react";
import { FileUploader } from "react-drag-drop-files";

import "./ImageUpload.scss";
import {DialogWrapper} from "../settings/App.jsx";
import {RowFullWidth} from "../main/Utils.jsx";
import {Button} from "@chakra-ui/react";

const fileTypes = ["PNG", "JPG", "JPEG", "WEBP"];

export function ImageUploadModal({visible, cancel, name, path, callback}) {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (file) => {
        setFile(file);
    };

    async function upload() {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", path);
        const response = await fetch("/cozy-nest/extra_network/preview", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            CozyLogger.error("Failed to upload image", response);
            return;
        }
        callback((await response.json()).previewPath);
        setIsUploading(false);
    }

    return (
        <>
            {visible &&
                <DialogWrapper isVisible={isVisible}>
                    <div className="ImageUploadModal">
                        <div className="name">
                            <h1>Upload preview image</h1>
                            <span>{name}</span>
                        </div>
                        <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={fileTypes}
                        />
                        <div className="actions">
                            {cancel}
                            <Button
                                isDisabled={!file && !isUploading}
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    upload()
                                }}
                            >{!isUploading ? "Upload" : "Uploading..."}</Button>
                        </div>
                    </div>
                </DialogWrapper>
            }
        </>
    );
}