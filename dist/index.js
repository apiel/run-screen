#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spawn = require("cross-spawn");
const shell_quote_1 = require("shell-quote");
const pidtree = require("pidtree");
const util_1 = require("util");
const cmds = process.argv.slice(2);
if (!cmds.length) {
    console.log(`No command to run.

> run-screen "command 0" "command 1" "command 2" "... bis 9"

    You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 0 to 9.
    To exit, press key combination "ctrl+C"
    `);
    process.exit();
}
const dataHistorySize = 100;
let activeScreen = 0;
const screens = [];
const spawnOptions = {};
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
    const run = spawn(command, args, spawnOptions);
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
    screens.push({ run, cmd, id, data: [] });
});
process.stdin.setEncoding('ascii');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', (key) => __awaiter(this, void 0, void 0, function* () {
    if (key === '\u0000') {
        const screen = screens[activeScreen];
        if (screen.run) {
            stdout(activeScreen, `\n\nctrl+space > stop process: ${screen.cmd}\n\n`);
            yield kill(screen);
        }
        else {
            stdout(activeScreen, `\n\nctrl+space > start process: ${screen.cmd}\n\n`);
            screens[activeScreen].run = start(screen.cmd, screen.id);
        }
    }
    else if (key === '\u0003') {
        yield Promise.all(screens.map(kill));
        process.stdin.resume();
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
}));
function kill(screen) {
    return __awaiter(this, void 0, void 0, function* () {
        if (screen.run) {
            const pids = yield util_1.promisify(pidtree)(screen.run.pid, { root: true });
            pids.forEach((pid) => {
                try {
                    process.kill(pid);
                }
                catch (error) {
                    console.error(`Could not kill ${pid}`);
                }
            });
        }
    });
}
//# sourceMappingURL=index.js.map