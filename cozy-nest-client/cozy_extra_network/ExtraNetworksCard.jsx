import React, {useEffect} from "react";

const CIVITAI_URL = {
    "modelPage":"https://civitai.com/models/",
    "modelId": "https://civitai.com/api/v1/models/",
    "modelVersionId": "https://civitai.com/api/v1/model-versions/",
    "hash": "https://civitai.com/api/v1/model-versions/by-hash/"
}

export function ExtraNetworksCard({item, searchString, nsfwFilter}) {

    const [isHovered, setIsHovered] = React.useState(false)
    const [info, setInfo] = React.useState(item.info || {})
    const [infoLoaded, setInfoLoaded] = React.useState(item.info !== undefined)
    const [validInfo, setValidInfo] = React.useState(info !== undefined && info !== null)

    const [matchFilter, setMatchFilter] = React.useState(true)

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
            && item.info
            && !item.info.empty
            && item.info.model
            && item.info.model.nsfw) {
            setMatchFilter(false)
            return;
        }

        setMatchFilter(filterCard(searchString))
    }, [searchString, nsfwFilter])

    function filterCard(searchString) {
        if (searchString === '') return true

        if (JSON.stringify(item).includes(searchString)) {
            return true
        }
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
        } else if (currentTab.includes('img2txt')) {
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

        //TODO better alert
        alert('No prompt found in preview images')
    }

    function replaceImage(event) {
        event.preventDefault();
        event.stopPropagation();
        //TODO
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

    const hasTriggerWords = info.trainedWords && info.trainedWords.length > 0;
    const hasModelId = info.modelId !== undefined;

    return (
        <div
            className="CozyExtraNetworksCard"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={loadExtraNetwork}
        >
            {matchFilter && <div className="en-preview-wrapper">
                {item.previewPath &&
                    <img
                        className="en-preview-thumbnail"
                        src={`./sd_extra_networks/thumb?filename=${encodeURIComponent(item.previewPath)}&amp;mtime=${new Date().getTime()}`}
                        loading="lazy"
                        alt={item.name}
                    />
                }
                {!item.previewPath &&
                    <div className="en-preview-thumbnail black">
                        No preview
                    </div>
                }
                <div className="cozy-en-info">
                    {isHovered && infoLoaded && validInfo &&
                        <div className="cozy-en-actions">
                            <button
                                title="Replace preview image"
                                onClick={replaceImage}
                            >
                                R
                            </button>
                            {hasModelId && <button
                                title="Open model in civitai"
                                onClick={openCivitai}
                            >
                                V
                            </button>}
                            {hasTriggerWords && <button
                                title="Add trigger words to prompt"
                                onClick={addTriggerWordsToPrompt}
                            >
                                T
                            </button>}
                            <button
                                title="Use prompt from preview image"
                                onClick={usePromptFromPreview}
                            >
                                P
                            </button>
                        </div>
                    }
                    <span className="en-preview-name">{item.name || item}</span>
                </div>
            </div>}

        </div>
    );
}