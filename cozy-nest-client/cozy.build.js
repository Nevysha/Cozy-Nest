//post build script run by Nodejs

//copy cozy-nest-style.css and cozy-nest-style-sdnext.css to cozy-nest-client/assets
import {copyFile } from 'fs/promises';
import {join} from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cozyNestStyleCss = join(__dirname, 'main/cozy-nest-style.css');
const cozyNestStyleSdnextCss = join(__dirname, 'main/cozy-nest-style-sdnext.css');

const cozyNestStyleCssDest = join(__dirname, '../client/assets/cozy-nest-style.css');
const cozyNestStyleSdnextCssDest = join(__dirname, '../client/assets/cozy-nest-style-sdnext.css');

async function copyCss() {
    await copyFile(cozyNestStyleCss, cozyNestStyleCssDest);
    await copyFile(cozyNestStyleSdnextCss, cozyNestStyleSdnextCssDest);
}
(async () => {
    await copyCss();
})();



