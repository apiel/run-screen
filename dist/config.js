"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function invalidConfigFormat(message) {
    console.log(`Invalid config format
...

${message}`);
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