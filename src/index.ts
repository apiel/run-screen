#!/usr/bin/env node

import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess, SpawnOptions } from 'child_process';
import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { loadConfig, ScreenConfig } from './config';

type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}

export interface Screen {
    id: number;
    config: ScreenConfig;
    run: ChildProcess;
    data: ScreenData[];
    missedError: number;
}

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

const screenConfigs = loadConfig(args);

const dataHistorySize = 100;
let activeScreen = 0;
const screens: Screen[] = [];

const spawnOptions: SpawnOptions = {
    // cwd: process.cwd(),
};

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
    handleError(id);
}

function handleError(id: number) {
    if (id !== activeScreen) {
        screens[id].missedError++;
    }
    if (activeScreen === -1) {
        dashboard(screens);
    }
}

function start({ cmd}: ScreenConfig, id: number): ChildProcess {
    const [command, ...params] = parse(cmd, process.env);

    const run = spawn(command as string, params as string[], spawnOptions);

    run.stdout.on('data', (data) => stdout(id, data));
    run.stderr.on('data', (data) => stderr(id, data));

    run.on('close', (code) => {
        stdout(id, `child process exited with code ${code}`);
        screens[id].run = null;
    });

    return run;
}

async function startScreen(screen: Screen) {
    const { id, config } = screen;
    const { before, after } = config;

    if (before) {
        await before(id, config);
    }
    screen.run = start(config, id);
    if (after) {
        await after(screen);
    }
    return screen;
}

screenConfigs.forEach((screenConfig, id) => {
    const screen = { run: null, config: screenConfig, id, data: [], missedError: 0 };
    screens.push(screen);
    startScreen(screen);
});

// process.stdin.setEncoding('utf8');
process.stdin.setEncoding('ascii');
process.stdin.setRawMode(true);
process.stdin.resume();

process.stdin.on('data', async (key) => {
    // '\u0012' ctrlR
    // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
    if (key === '\u0000') { // ctrlSpace
        const screen = screens[activeScreen];
        if (screen) {
            if (screen.run) {
                stdout(activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                await kill(screen);
            } else {
                stdout(activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                screens[activeScreen] = await startScreen(screen);
            }
        }
    } else if (key === '\u0003') {
        await Promise.all(screens.map(kill));
        // console.clear(); // ??? for htop but in most of the case clearing is not nice
        process.stdin.resume();
        process.exit();
    } else if (key === '\u0009') { // tab
        activeScreen = -1;
        dashboard(screens);
    } else if (key === '>') {
        setActiveScreen(getNextTab(screens, activeScreen));
    } else if (key === '<') {
        setActiveScreen(getPrevTab(screens, activeScreen));
    } else if (!!screens[getScreenId(key)]) {
        setActiveScreen(getScreenId(key));
    }
    if (screens[activeScreen] && screens[activeScreen].run) {
        screens[activeScreen].run.stdin.write(key);
    }
});

function setActiveScreen(id: number) {
    activeScreen = id;
    console.clear();
    screens[activeScreen].data.forEach(
        ({ writeStream, data }) => writeStream.write(data),
    );
    screens[activeScreen].missedError = 0;
}
