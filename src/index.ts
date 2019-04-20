#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';

const cmds = [
    'watch uptime',
    'htop',
];

const dataHistorySize = 100;
let activeScreen = 0;
const screens = [];

function start(cmd: string, id: number) {
    const [command, ...args] = parse(cmd, process.env);

    let run = spawn(command as string, args as string[]);

    run.stdout.on('data', (data) => {
        if (id === activeScreen) {
            process.stdout.write(data);
        }
        screens[id].data = [...screens[id].data, data].slice(-dataHistorySize);
    });

    run.stderr.on('data', (data) => {
        if (id === activeScreen) {
            process.stderr.write(data);
        }
    });

    run.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
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
        process.exit();
    } else if (!!screens[key]) {
        activeScreen = parseInt(key, 10);
        process.stdout.write('\x1b[2J');
        screens[activeScreen].data.forEach(
            (data: any) => process.stdout.write(data)
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
