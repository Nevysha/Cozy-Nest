import React, {useEffect} from "react";
import {SvgForReact} from "../main/svg_for_react.jsx";
import {LazyComponent} from "./LazyComponent.jsx";
import {ImageUploadModal} from "./ImageUploadModal.jsx";
import {Button} from "@chakra-ui/react";
import CozyModal from "../main/modal/Module.jsx";

const CIVITAI_URL = {
    "modelPage":"https://civitai.com/models/",
    "modelId": "https://civitai.com/api/v1/models/",
    "modelVersionId": "https://civitai.com/api/v1/model-versions/",
    "hash": "https://civitai.com/api/v1/model-versions/by-hash/"
}

function NsfwButton({onClick, nsfw}) {

    const [isHovered, setIsHovered] = React.useState(false)

    function getIcon() {
        let iconName;
        if (nsfw) {
            iconName = isHovered ? "eye" : "eyeSlash"
        }
        else {
            iconName = isHovered ? "eyeSlash" : "eye"
        }
        return SvgForReact[iconName];
    }

    return <button
        title={nsfw ? "Mark as SFW" : "Mark as NSFW"}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
        {getIcon()}
    </button>;
}

export function ExtraNetworksCard({item, searchString, selectedFolder, nsfwFilter}) {

    const [isHovered, setIsHovered] = React.useState(false)
    const [info, setInfo] = React.useState(item.info || {})
    const [infoLoaded, setInfoLoaded] = React.useState(item.info !== undefined)
    const [validInfo, setValidInfo] = React.useState(info !== undefined && info !== null)

    const [matchFilter, setMatchFilter] = React.useState(true)

    const [showFileUpload, setShowFileUpload] = React.useState(false)

    useEffect(() => {
        if (infoLoaded || !isHovered) return

        (async () => {
            const response = await fetch(`/cozy-nest/extra_network?path=${encodeURIComponent(item.path)}`)
            if (response.status !== 200) {
                CozyLogger.error('Failed to fetch extra network info', response)
                return
            }
            const info = await response.json()
            setInfo(info)
            setInfoLoaded(true)
            setValidInfo(info !== null)
        })();

    }, [isHovered])

    useEffect(() => {

        if (nsfwFilter
            && info
            && info.model
            && info.model.nsfw) {
            setMatchFilter(false)
            return;
        }

        setMatchFilter(filterCard(searchString, selectedFolder))
    }, [selectedFolder, searchString, nsfwFilter, info])

    useEffect(() => {
        //when hiding card, reset hover state
        if (!matchFilter) {
            setIsHovered(false)
        }
        //when showing card, reset hover state
        if (showFileUpload) {
            setIsHovered(false)
        }
    }, [matchFilter, showFileUpload])

    function isNsfw() {
        return info && info.model && info.model.nsfw
    }

    function filterCard(searchString, selectedFolder) {
        const hasSelectFolder = selectedFolder && selectedFolder !== ''

        function normalizePath(path) {
            return path.replace(/[\/\\:]/g, '').toLowerCase()
        }

        if (searchString !== '' || hasSelectFolder) {
            const itemPath = normalizePath(item.path)
            //only search string
            if (!hasSelectFolder) {
                return itemPath.includes(searchString.toLowerCase())
            }
            //only selected folder
            else if (searchString === '') {
                return itemPath.includes(normalizePath(selectedFolder))
            }
            //both
            return (itemPath.includes(searchString.toLowerCase())
                || itemPath.includes(normalizePath(selectedFolder)))
        }
        return true
    }

    function addTriggerWordsToPrompt(event) {
        event.preventDefault();
        event.stopPropagation();

        if (info.trainedWords.length === 0) return

        setAndPropagatePrompt(`${info.trainedWords.join(', ')}, `)
    }

    function getActiveTextarea(negativePrompt) {
        const currentTab = get_uiCurrentTabContent().id

        let textarea = null
        if (currentTab.includes('txt2img')) {
            if (negativePrompt) {
                textarea = document.querySelector(`#txt2img_neg_prompt label textarea`)
            } else
                textarea = document.querySelector(`#txt2img_prompt label textarea`)
        } else if (currentTab.includes('img2img')) {
            if (negativePrompt) {
                textarea = document.querySelector(`#img2img_neg_prompt label textarea`)
            } else
                textarea = document.querySelector(`#img2img_prompt label textarea`)
        }
        return textarea;
    }

    function clearPrompt(negativePrompt) {
        let textarea = getActiveTextarea(negativePrompt);
        textarea.value = ''
    }

    function setAndPropagatePrompt(newValue, negativePrompt) {

        if (!newValue || newValue.length === 0) return

        let textarea = getActiveTextarea(negativePrompt);

        let value = textarea.value
        if (value.length !== 0) {
            value = `${textarea.value}\n${newValue}`
        }
        else {
            value = newValue
        }

        textarea.value = value

        //trigger input event
        const event = new Event('input')
        textarea.dispatchEvent(event)
    }

    function openCivitai(event) {
        event.preventDefault();
        event.stopPropagation();

        if (!info.modelId) return

        const url = `${CIVITAI_URL.modelPage}/${info.modelId}`
        window.open(url, '_blank')
    }

    function usePromptFromPreview(event) {
        event.preventDefault();
        event.stopPropagation();

        // image prompt are in info.images[?].meta.prompt (if any)
        // go through all images until we find one with a prompt
        if (info.images) {
            for (const image of info.images) {
                if (image.meta && image.meta.prompt) {
                    clearPrompt()
                    setAndPropagatePrompt(`${image.meta.prompt}, `)

                    if (image.meta.negativePrompt) {
                        clearPrompt(true)
                        setAndPropagatePrompt(`${image.meta.negativePrompt}, `, true)
                    }

                    return
                }
            }
        }

        CozyModal.showToast('warning', 'Not available', 'No prompt found in preview')
    }

    function replaceImage(event) {
        event.preventDefault();
        event.stopPropagation();

        setShowFileUpload(!showFileUpload)
    }

    function loadExtraNetwork(event) {
        event.preventDefault();
        event.stopPropagation();
        if (item.type === 'ckp') {
            selectCheckpoint(item.fullName)
        }
        else if (item.type === 'ti') {
            setAndPropagatePrompt(`${item.name}, `)
        }
        else if (item.type === 'lora' || item.type === 'lyco' || item.type === 'hypernet') {
            setAndPropagatePrompt(`<${item.type}:${item.name}:1.00>, `)
        }
    }

    async function toggleNSFW(event) {
        event.preventDefault();
        event.stopPropagation();

        //send POST request to toggle nsfw
        const response = await fetch(`/cozy-nest/extra_network/toggle-nsfw`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: item.path,
            })
        })
        if (response.status !== 200) {
            CozyLogger.error('Failed to toggle nsfw', response)
            return
        }
        const info = await response.json()
        item.info = info
        setInfo(info)
    }

    function onPreviewSaved(previewPath) {
        //update preview path
        item.previewPath = previewPath
        setShowFileUpload(false)
    }

    const hasTriggerWords = info.trainedWords && info.trainedWords.length > 0;
    const hasModelId = info.modelId !== undefined;

    return (
        <div
            className="CozyExtraNetworksCard"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={loadExtraNetwork}
            title={item.name || item}
            style={{display: matchFilter ? 'flex' : 'none'}}
        >
            {matchFilter && <div className="en-preview-wrapper">
                {isHovered && infoLoaded && validInfo &&
                    <div className="cozy-en-actions">
                        <button
                            title="Replace preview image"
                            onClick={replaceImage}
                        >
                            {SvgForReact.image}
                        </button>
                        {hasModelId && <button
                            title="Open model in civitai"
                            onClick={openCivitai}
                        >
                            {SvgForReact.link}
                        </button>}
                        {hasTriggerWords && <button
                            title="Add trigger words to prompt"
                            onClick={addTriggerWordsToPrompt}
                        >
                            {SvgForReact.magicWand}
                        </button>}
                        <button
                            title="Use prompt from preview image"
                            onClick={usePromptFromPreview}
                        >
                            {SvgForReact.arrow}
                        </button>
                        <NsfwButton onClick={toggleNSFW} nsfw={isNsfw()}/>
                    </div>
                }
                {item.previewPath &&
                    <LazyComponent placeholderClassName="en-preview-thumbnail">
                        <img
                            className="en-preview-thumbnail"
                            src={`./sd_extra_networks/thumb?filename=${encodeURIComponent(item.previewPath)}&amp;mtime=${new Date().getTime()}`}
                            alt={item.name}
                        />
                    </LazyComponent>
                }
                {!item.previewPath &&
                    <div className="en-preview-thumbnail black">
                        No preview
                    </div>
                }
                {showFileUpload &&
                    <div style={{zIndex:4}}>
                        <ImageUploadModal
                            visible={showFileUpload}
                            name={item.name}
                            path={item.path}
                            cancel={
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setShowFileUpload(false)
                                    }}
                                >Cancel</Button>
                            }
                            callback={onPreviewSaved}
                        >

                        </ImageUploadModal>
                    </div>
                }
                <div className="cozy-en-info">
                    <div className="en-preview-name">{item.name || item}</div>
                </div>
            </div>}

        </div>
    );
}
