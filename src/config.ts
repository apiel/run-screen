import { extname } from 'path';
import { Screen, RunScreen } from './RunScreen';

function invalidConfigFormat(message: string) {
    console.log(
        `Invalid config format
...

${message}`,
    );
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
    OPEN_DASHBOARD: string;
    NEXT_SCREEN: string;
    PREV_SCREEN: string;
}

export interface Config {
    keys: Keys;
    screens: ScreenConfig[];
}

const defaultKeys: Keys = {
    TOGGLE_PROCESS: '\u0000', // ctrl+space
    KILL_PROCESS: '\u0003', // ctrl+c
    OPEN_DASHBOARD: '\u0009', // tab
    NEXT_SCREEN: '>',
    PREV_SCREEN: '<',
};

// const defaultConfig: Config = {
//     ,
//     screens: [],
// };

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
