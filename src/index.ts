#!/usr/bin/env node

import { loadConfig } from './config';
import { RunScreen } from './RunScreen';
import { stdin } from './stdin';

const args = process.argv.slice(2);
if (!args.length) {
    // tslint:disable-next-line
    console.log(`No command to run.

> run-screen "command 0" "command 1" "command 2" "... bis 9"

    You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 0 to 9.
    To exit, press key combination "ctrl+c"
    Stop/start process, press key combination "ctrl+space"
    Next screen, press key ">"
    Previous screen, press key "<"
    Dashboard, press key "tab"
    `);
    process.exit();
}

const config = loadConfig(args);
const runScreen = new RunScreen(config);
runScreen.run();
stdin(runScreen);
