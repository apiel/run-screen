"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const color_1 = require("./color");
function invalidConfigFormat(message) {
    console.log(`Invalid config format

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

${color_1.dim(`Before function is of type:
before: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;

After function is of type:
after: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;`)}

${color_1.red(message)}
    `);
    process.exit();
}
const defaultKeys = {
    TOGGLE_PROCESS: '\u0000',
    KILL_PROCESS: '\u0003',
    TOGGLE_DASHBOARD: '\u0009',
    NEXT_SCREEN: '>',
    PREV_SCREEN: '<',
};
function loadConfig(args) {
    if (path_1.extname(args[0]) === '.js') {
        return loadConfigFromFile(args[0]);
    }
    const screens = args.map(cmd => ({ cmd }));
    return {
        keys: defaultKeys,
        screens,
    };
}
exports.loadConfig = loadConfig;
function loadConfigFromFile(file) {
    const configPath = require.resolve(file, { paths: [process.cwd()] });
    const config = require(configPath);
    if (!config.screens) {
        invalidConfigFormat('Screens settings are missings');
    }
    const screens = config.screens.filter(screen => screen.cmd);
    if (!screens.length) {
        invalidConfigFormat('Commands are missings in screens');
    }
    const keys = config.keys ? Object.assign({}, defaultKeys, config.keys) : defaultKeys;
    return {
        keys,
        screens,
    };
}
//# sourceMappingURL=config.js.map