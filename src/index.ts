#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess, SpawnOptions } from 'child_process';
import * as pidtree from 'pidtree';
import { promisify } from 'util';

type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}

interface Screen {
    id: number;
    cmd: string;
    run: ChildProcess;
    data: ScreenData[];
}

const cmds = process.argv.slice(2);
if (!cmds.length) {
    // tslint:disable-next-line
    console.log(`No command to run.

> run-screen "command 0" "command 1" "command 2" "... bis 9"

    You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 0 to 9.
    To exit, press key combination "ctrl+C"
    `);
    process.exit();
}

const dataHistorySize = 100;
let activeScreen = 0;
const screens: Screen[] = [];

const spawnOptions: SpawnOptions = {
    // cwd: process.cwd(),
};

function clear() {
    process.stdout.write('\x1b[2J');
}

function stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data) {
    if (id === activeScreen) {
        writeStream.write(data);
    }
    screens[id].data = [
        ...screens[id].data,
        { writeStream, data },
    ].slice(-dataHistorySize);
}

function stdout(id: number, data: Data) {
    stdWrite(process.stdout, id, data);
}

function stderr(id: number, data: Data) {
    stdWrite(process.stderr, id, data);
}

function start(cmd: string, id: number): ChildProcess {
    const [command, ...args] = parse(cmd, process.env);

    const run = spawn(command as string, args as string[], spawnOptions);

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

// process.stdin.setEncoding('utf8');
process.stdin.setEncoding('ascii');
process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('data', async (key) => {
    // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
    if (key === '\u0012') {
        const screen = screens[activeScreen];
        stdout(activeScreen, `\n\nctrl+r > restart process: ${screen.cmd}\n\n`);
        await kill(screen);
        // start(screen.cmd, screen.id);
        // setTimeout(() => { start(screen.cmd, screen.id); }, 3000);
        // console.log('yoyoyoyoy');
    } else if (key === '\u0003') {
        await Promise.all(screens.map(kill));
        // clear();
        process.stdin.resume();
        process.exit();
    } else if (!!screens[key]) {
        activeScreen = parseInt(key, 10);
        clear();
        screens[activeScreen].data.forEach(
            ({ writeStream, data }) => writeStream.write(data),
        );
    }
    if (screens[activeScreen].run) {
        screens[activeScreen].run.stdin.write(key);
    }
});

async function kill(screen: Screen) {
    if (screen.run) {
        const pids: number[] = await promisify(pidtree)(screen.run.pid, { root: true });
        pids.forEach((pid) => {
            try {
                process.kill(pid);
            } catch (error) {
                console.error(`Could not kill ${pid}`); // tslint:disable-line
            }
        });
    }
}
