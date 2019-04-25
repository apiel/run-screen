"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
function invalidConfigFormat(message) {
    console.log(`Invalid config format
...

${message}`);
    process.exit();
}
function loadConfig(args) {
    if (path_1.extname(args[0]) === '.js') {
        const configPath = require.resolve(args[0], { paths: [process.cwd()] });
        const config = require(configPath);
        if (!config.screens) {
            invalidConfigFormat('Screens settings are missings');
        }
        const screens = config.screens.filter(screen => screen.cmd);
        if (!screens.length) {
            invalidConfigFormat('Commands are missings in screens');
        }
        return screens;
    }
    return args.map(cmd => ({ cmd }));
}
exports.loadConfig = loadConfig;
//# sourceMappingURL=config.js.map