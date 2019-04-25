#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const RunScreen_1 = require("./RunScreen");
const Stdin_1 = require("./Stdin");
const args = process.argv.slice(2);
if (!args.length) {
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
const config = config_1.loadConfig(args);
const runScreen = new RunScreen_1.RunScreen(config);
runScreen.run();
const stdin = new Stdin_1.Stdin(runScreen);
stdin.stdin();
//# sourceMappingURL=index.js.map