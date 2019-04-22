"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color = (n, text) => `\x1b[${n}m${text}\x1b[0m`;
const red = (text) => color(31, text);
const dim = (text) => color(2, text);
const digit = (value) => color(45, ` ${value} `);
function dashboard(screens) {
    console.clear();
    process.stdout.write(dim(`There is ${screens.length} screens:\n\n`));
    screens.forEach(({ cmd, missedError }, index) => {
        const error = missedError ? red(` [${missedError} new error(s)]`) : '';
        process.stdout.write(`${digit(index + 1)} ${cmd}${error}\n`);
    });
}
exports.dashboard = dashboard;
//# sourceMappingURL=dashboard.js.map