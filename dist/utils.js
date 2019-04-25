"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pidtree = require("pidtree");
const util_1 = require("util");
function kill(screen) {
    return __awaiter(this, void 0, void 0, function* () {
        if (screen.proc) {
            const pids = yield util_1.promisify(pidtree)(screen.proc.pid, { root: true });
            pids.forEach((pid) => {
                try {
                    process.kill(pid);
                }
                catch (error) {
                    console.error(`Could not kill ${pid}`);
                }
            });
        }
    });
}
exports.kill = kill;
function getScreenId(key) {
    const id = parseInt(key, 10);
    if (!isNaN(id)) {
        return (id - 1) % 10;
    }
    return -1;
}
exports.getScreenId = getScreenId;
function getNextTab(screens, activeScreen, direction = 1) {
    return Math.abs((activeScreen + direction) % screens.length);
}
exports.getNextTab = getNextTab;
function getPrevTab(screens, activeScreen) {
    return getNextTab(screens, activeScreen, -1);
}
exports.getPrevTab = getPrevTab;
//# sourceMappingURL=utils.js.map