#!/usr/bin/env node
import chokidar from 'chokidar';
import program from 'caporal';
import debouce from 'lodash.debounce';
import fs from 'fs';
import {spawn} from 'child_process'

program 
.version('0.0.1')
.argument('[filename]', 'name of file to run on change')
.action(async({filename}) => {
  const name = filename || 'index.js';
  try {
    await fs.promises.access(name);
  } catch(err) { 
      throw new Error( `${name} not here`) 
  }
  let proc;
  const start = debouce(() => {
    if (proc) {proc.kill()};
    proc = spawn('node',[name],{stdio:'inherit'});
  },200);

  chokidar.watch('.')
  .on('add', start)
  .on('change', start)
  .on('unlink', start)
})

program.parse(process.argv)



