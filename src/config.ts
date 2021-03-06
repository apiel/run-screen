import { extname } from 'path';
import { Screen, RunScreen } from './RunScreen';
import { dim, red } from './color';

function invalidConfigFormat(message: string) {
    console.log( // tslint:disable-line
        `Invalid config format

{
    keys: {
        TOGGLE_PROCESS: 'key', // e.g '\u0000' for ctrl+space
        KILL_PROCESS: 'key', // e.g 'k'
        TOGGLE_DASHBOARD: 'key', // e.g '#'
        NEXT_SCREEN: 'key', // e.g '<'
        PREV_SCREEN: 'key', // ...
    },
    screens: [
        {
            before: Function, // function to run before executing the command
            cmd: 'yarn foo', // required
            after: Function, // function to run after the command was started inside a screen
        },
    ],
}

${dim(`Before function is of type:
before: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;

After function is of type:
after: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;`)}

${red(message)}
    `);
    process.exit();
}

export interface ScreenConfig {
    before?: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;
    after?: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;
    cmd: string;
}

export interface Keys {
    TOGGLE_PROCESS: string;
    KILL_PROCESS: string;
    TOGGLE_DASHBOARD: string;
    NEXT_SCREEN: string;
    PREV_SCREEN: string;
}

export interface Config {
    keys: Keys;
    screens: ScreenConfig[];
}

const defaultKeys: Keys = {
    TOGGLE_PROCESS: '.', // ctrl+space
    KILL_PROCESS: '\u0003', // ctrl+c
    TOGGLE_DASHBOARD: '\u0009', // tab
    NEXT_SCREEN: '>',
    PREV_SCREEN: '<',
};

// tslint:disable-next-line
export const helpinfo = `
    You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 1 to 10.
    To exit, press key combination "ctrl+c"
    Stop/start process, press key "."
    Next screen, press key ">"
    Previous screen, press key "<"
    Dashboard, press key "tab"`;

export function loadConfig(args: string[]): Config {
    if (extname(args[0]) === '.js') { // we could check that's not executable file and `#!/usr/bin/env node` is not on top
        return loadConfigFromFile(args[0]);
    }
    const screens = args.map(cmd => ({ cmd }));
    return {
        keys: defaultKeys,
        screens,
    };
}

function loadConfigFromFile(file: string): Config {
    const configPath = require.resolve(
        file,
        { paths: [process.cwd()] },
    );
    const config: Config = require(configPath); // tslint:disable-line

    if (!config.screens) {
        invalidConfigFormat('Screens settings are missings');
    }
    const screens = config.screens.filter(screen => screen.cmd);
    if (!screens.length) {
        invalidConfigFormat('Commands are missings in screens');
    }

    const keys = config.keys ? { ...defaultKeys, ...config.keys } : defaultKeys;
    return {
        keys,
        screens,
    };
}
