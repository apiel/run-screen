"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboard = void 0;
const color_1 = require("./color");
const config_1 = require("./config");
const digit = (value) => color_1.color(45, ` ${value} `);
function dashboard(screens) {
    console.clear();
    process.stdout.write(color_1.dim(`There is ${screens.length} screens:\n\n`));
    screens.forEach(({ config: { cmd }, proc, missedError, missedOutput }, index) => {
        const error = missedError ? color_1.red(` [${missedError} new error(s)]`) : '';
        const stopped = proc ? '' : color_1.red(` [stopped]`);
        const newData = missedOutput ? color_1.green(' new') : '';
        process.stdout.write(`${digit(index + 1)} ${cmd}${error}${stopped}${newData}\n`);
    });
    process.stdout.write(color_1.dim(`${config_1.helpinfo}\n`));
}
exports.dashboard = dashboard;
//# sourceMappingURL=dashboard.js.map