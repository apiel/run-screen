"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stdinOnData = exports.toggleDashboard = exports.killProcess = exports.toggleProcess = exports.stdin = void 0;
const utils_1 = require("./utils");
const dashboard_1 = require("./dashboard");
const std_1 = require("./std");
let lastActiveScreen = -1;
function stdin(runScreen) {
    process.stdin.setEncoding('ascii');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => stdinOnData(runScreen, key));
}
exports.stdin = stdin;
function toggleProcess(runScreen) {
    return __awaiter(this, void 0, void 0, function* () {
        const { screens, activeScreen } = runScreen;
        const screen = screens[activeScreen];
        if (screen) {
            if (screen.proc) {
                std_1.stdout(runScreen, activeScreen, `\n\n > stop process: ${screen.config.cmd}\n\n`);
                yield utils_1.kill(screen);
            }
            else {
                std_1.stdout(runScreen, activeScreen, `\n\n > start process: ${screen.config.cmd}\n\n`);
                runScreen.screens[activeScreen] = yield runScreen.startScreen(screen);
            }
        }
    });
}
exports.toggleProcess = toggleProcess;
function killProcess({ screens }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(screens.map(utils_1.kill));
        process.stdin.resume();
        process.exit();
    });
}
exports.killProcess = killProcess;
function toggleDashboard(runScreen) {
    const { screens, activeScreen } = runScreen;
    if (activeScreen !== -1) {
        lastActiveScreen = activeScreen;
        runScreen.activeScreen = -1;
        dashboard_1.dashboard(screens);
    }
    else if (lastActiveScreen !== -1) {
        runScreen.setActiveScreen(lastActiveScreen);
    }
}
exports.toggleDashboard = toggleDashboard;
function stdinOnData(runScreen, key) {
    return __awaiter(this, void 0, void 0, function* () {
        const { config: { keys }, activeScreen, screens } = runScreen;
        const { TOGGLE_PROCESS, KILL_PROCESS, TOGGLE_DASHBOARD, NEXT_SCREEN, PREV_SCREEN, } = keys;
        if (key === TOGGLE_PROCESS) {
            toggleProcess(runScreen);
        }
        else if (key === KILL_PROCESS) {
            killProcess(runScreen);
        }
        else if (key === TOGGLE_DASHBOARD) {
            toggleDashboard(runScreen);
        }
        else if (key === NEXT_SCREEN) {
            runScreen.setActiveScreen(utils_1.getNextTab(screens, activeScreen));
        }
        else if (key === PREV_SCREEN) {
            runScreen.setActiveScreen(utils_1.getPrevTab(screens, activeScreen));
        }
        else if (!!screens[utils_1.getScreenId(key)]) {
            runScreen.setActiveScreen(utils_1.getScreenId(key));
        }
        if (screens[activeScreen] && screens[activeScreen].proc) {
            screens[activeScreen].proc.stdin.write(key);
        }
    });
}
exports.stdinOnData = stdinOnData;
//# sourceMappingURL=stdin.js.map