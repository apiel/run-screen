"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = (n, text) => `\x1b[${n}m${text}\x1b[0m`;
exports.green = (text) => exports.color(32, text);
exports.red = (text) => exports.color(31, text);
exports.dim = (text) => exports.color(2, text);
//# sourceMappingURL=color.js.map