#!/usr/bin/env node

import { loadConfig, helpinfo } from './config';
import { RunScreen } from './RunScreen';
import { stdin } from './stdin';
import { dim } from './color';

const args = process.argv.slice(2);
if (!args.length) {
    console.log(`No command to run.

> run-screen "command 0" "command 1" "command 2" "... bis 9"
${dim(helpinfo)}
    `);
    process.exit();
}

const config = loadConfig(args);
const runScreen = new RunScreen(config);
runScreen.run();
stdin(runScreen);
