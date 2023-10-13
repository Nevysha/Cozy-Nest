import {WEBUI_SDNEXT} from "./Constants.js";

const a1111 = {
    clear_prompt(prefix) {
        return `${prefix}_clear_prompt`
    },
    extra_networks(prefix) {
        return `${prefix}_extra_tabs`
    }
}

const sdNext = {
    clear_prompt(prefix) {
        return `${prefix}_clear_prompt_btn`
    },
    extra_networks(prefix) {
        return `${prefix}_extra_tabs`
    }
}
// txt2img_clear_prompt_btn

//check if both a1111 and sdNext contain the same keys
const a1111Keys = Object.keys(a1111);
const sdNextKeys = Object.keys(sdNext);
const a1111KeysLength = a1111Keys.length;
const sdNextKeysLength = sdNextKeys.length;
if (a1111KeysLength !== sdNextKeysLength) {
    console.warn("Cozy-Nest: a1111 and sdNext do not have the same number of keys.")
    console.warn("Cozy-Nest: a1111 keys: ", a1111Keys)
    console.warn("Cozy-Nest: sdNext keys: ", sdNextKeys)
}
else {
    a1111Keys.forEach((key, index) => {
        if (key !== sdNextKeys[index]) {
            console.warn("Cozy-Nest: a1111 and sdNext do not have the same keys.")
            console.warn("Cozy-Nest: a1111 keys: ", a1111Keys)
            console.warn("Cozy-Nest: sdNext keys: ", sdNextKeys)
        }
    })
}

export default {
    get(id) {
        let _DOM_IDS;

        if (COZY_NEST_CONFIG.webui === WEBUI_SDNEXT) {
            _DOM_IDS = sdNext;
        }
        else {
            _DOM_IDS = a1111;
        }

        if (!_DOM_IDS[id]) {
            console.warn(`Cozy-Nest: DOM ID ${id} not found.`);
        }

        return _DOM_IDS[id];
    }
};
