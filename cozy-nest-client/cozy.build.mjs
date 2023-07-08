//post build script run by Nodejs

import {copyFile, readdir, rename } from 'fs/promises';
import {join} from 'path';
import { fileURLToPath } from 'url';
import * as path from "path";
import chalk from 'chalk';

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
    },
  ],
  move: [
    {
      from: join(__dirname, '../client/assets/cozy-nest.loader.min.js'),
      to: join(__dirname, '../javascript/cozy-nest.loader.min.js')
    }
  ]
}

async function build() {

  // copy whole folders
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

  // copy files
  log(
    chalk.blue(`Copying files`))
  for (const copy of config.copy) {
    await copyFile(copy.from, copy.to);
    log(
      chalk.green('    COPY'),
      chalk.green.bold(` ${relPath(copy.from)} → ${relPath(copy.to)}`))
  }

  // move file
  log(
    chalk.blue(`Moving files`))
  for (const move of config.move) {
    await rename(move.from, move.to);
    log(
      chalk.green('    MOVE'),
      chalk.green.bold(` ${relPath(move.from)} → ${relPath(move.to)}`))
  }
}
(async () => {
  await build();
})();



