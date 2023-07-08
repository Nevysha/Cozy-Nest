//post build script run by Nodejs

//copy cozy-nest-style.css and cozy-nest-style-sdnext.css to cozy-nest-client/assets
import {copyFile, cp, readdir } from 'fs/promises';
import {join} from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";
import chalk from 'chalk';

// const logBold = (...args) => console.log(chalk.green.bold(...args))
// const log = (...args) => console.log(chalk.blue(...args))
const log = console.log
const relPath = (to) => path.relative(join(process.cwd(), '../'), to)

log("")
log(
  chalk.blue.bold("## "),
  chalk.blue("Cozy Nest post build script"),
  chalk.blue.bold(" ##"))

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  folderCopy: [
    {
      from: join(__dirname, 'static'),
      to: join(__dirname, '../client/assets')
    }
  ],
  copy: [
    {
      from: join(__dirname, 'node_modules/ace-builds/src-noconflict/worker-json.js'),
      to: join(__dirname, '../client/assets/worker-json.js')
    }
  ],
}

async function build() {
  for (const folderCopy of config.folderCopy) {

    log(
      chalk.blue(`Copying folders`),
      chalk.blue.bold(` ${relPath(folderCopy.from)} → ${relPath(folderCopy.to)}`)
    )

    // list each file in the folder
    const files = await readdir(folderCopy.from);
    for (const file of files) {
      // copy each file to the destination
      await copyFile(
        path.join(folderCopy.from, file),
        path.join(folderCopy.to, file)
      );
      log(
        chalk.green('    COPY'),
        chalk.green.bold(` ${relPath(path.join(folderCopy.from, file))} → ${relPath(path.join(folderCopy.to, file))}`))
    }
  }
  log(
    chalk.blue(`Copying files`))
  for (const copy of config.copy) {
    await copyFile(copy.from, copy.to);
    log(
      chalk.green('    COPY'),
      chalk.green.bold(` ${relPath(copy.from)} → ${relPath(copy.to)}`))
  }
}
(async () => {
  await build();
})();



