#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("cross-spawn");
const shell_quote_1 = require("shell-quote");
const cmds = process.argv.slice(2);
if (!cmds.length) {
    process.exit();
}
const dataHistorySize = 100;
let activeScreen = 0;
const screens = [];
function clear() {
    process.stdout.write('\x1b[2J');
}
function stdWrite(writeStream, id, data) {
    if (id === activeScreen) {
        writeStream.write(data);
    }
    screens[id].data = [
        ...screens[id].data,
        { writeStream, data },
    ].slice(-dataHistorySize);
}
function stdout(id, data) {
    stdWrite(process.stdout, id, data);
}
function stderr(id, data) {
    stdWrite(process.stderr, id, data);
}
function start(cmd, id) {
    const [command, ...args] = shell_quote_1.parse(cmd, process.env);
    const run = spawn(command, args);
    run.stdout.on('data', (data) => stdout(id, data));
    run.stderr.on('data', (data) => stderr(id, data));
    run.on('close', (code) => {
        stdout(id, `child process exited with code ${code}`);
        screens[id].run = null;
    });
    return run;
}
cmds.forEach((cmd, id) => {
    const run = start(cmd, id);
    screens.push({ run, id, data: [] });
});
process.stdin.setEncoding('ascii');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (key) => {
    if (key === '\u0003') {
        clear();
        process.exit();
    }
    else if (!!screens[key]) {
        activeScreen = parseInt(key, 10);
        clear();
        screens[activeScreen].data.forEach(({ writeStream, data }) => writeStream.write(data));
    }
    if (screens[activeScreen].run) {
        screens[activeScreen].run.stdin.write(key);
    }
});
process.stdin.on('end', () => {
    process.stdout.write('end');
});
//# sourceMappingURL=index.js.map