//post build script run by Nodejs

//copy cozy-nest-style.css and cozy-nest-style-sdnext.css to cozy-nest-client/assets
import {copyFile } from 'fs/promises';
import {join} from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";
import chalk from 'chalk';

const logBold = (...args) => console.log(chalk.green.bold(...args))
const log = (...args) => console.log(chalk.blue(...args))
const relPath = (to) => path.relative(path.join(process.cwd(), '../'), to)

log("")
log("Cozy Nest post build script")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cozyNestStyleCss = join(__dirname, 'main/cozy-nest-style.css');
const cozyNestStyleSdnextCss = join(__dirname, 'main/cozy-nest-style-sdnext.css');

const cozyNestStyleCssDest = join(__dirname, '../client/assets/cozy-nest-style.css');
const cozyNestStyleSdnextCssDest = join(__dirname, '../client/assets/cozy-nest-style-sdnext.css');

async function copyCss() {
    await copyFile(cozyNestStyleCss, cozyNestStyleCssDest);
    // print `copied ${cozyNestStyleCss} => ${cozyNestStyleCssDest}` in bold green
    logBold("copied ", `${relPath(cozyNestStyleCss)} → ${relPath(cozyNestStyleCssDest)}`);
    await copyFile(cozyNestStyleSdnextCss, cozyNestStyleSdnextCssDest);
    logBold("copied ", `${relPath(cozyNestStyleSdnextCss)} → ${relPath(cozyNestStyleSdnextCssDest)}`);
}
(async () => {
    await copyCss();
})();



