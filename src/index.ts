#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess } from 'child_process';

type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}

interface Screen {
    id: number;
    run: ChildProcess;
    data: ScreenData[];
}

const cmds = process.argv.slice(2);
if (!cmds.length) {
    process.exit();
}

const dataHistorySize = 100;
let activeScreen = 0;
const screens: Screen[] = [];

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

    const run = spawn(command as string, args as string[]);

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

// process.stdin.setEncoding('utf8');
process.stdin.setEncoding('ascii');
process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('data', (key) => {
    if (key === '\u0003') {
        clear();
        process.exit();
    } else if (!!screens[key]) {
        activeScreen = parseInt(key, 10);
        clear();
        screens[activeScreen].data.forEach(
            ({ writeStream, data }) => writeStream.write(data),
        );
    }
    // console.log('key', key, !!screens[key]);
    if (screens[activeScreen].run) {
        screens[activeScreen].run.stdin.write(key);
    }
});

process.stdin.on('end', () => {
    process.stdout.write('end');
});
