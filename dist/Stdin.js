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
const utils_1 = require("./utils");
const dashboard_1 = require("./dashboard");
class Stdin {
    constructor(runScreen) {
        this.runScreen = runScreen;
        this.lastActiveScreen = -1;
    }
    stdin() {
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }
    toggleProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            const { screens, activeScreen, stdout, startScreen } = this.runScreen;
            const screen = screens[activeScreen];
            if (screen) {
                if (screen.proc) {
                    stdout(activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                    yield utils_1.kill(screen);
                }
                else {
                    stdout(activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                    this.runScreen.screens[activeScreen] = yield startScreen(screen);
                }
            }
        });
    }
    killProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.runScreen.screens.map(utils_1.kill));
            process.stdin.resume();
            process.exit();
        });
    }
    toggleDashboard() {
        const { screens, activeScreen, setActiveScreen } = this.runScreen;
        if (activeScreen !== -1) {
            this.lastActiveScreen = activeScreen;
            this.runScreen.activeScreen = -1;
            dashboard_1.dashboard(screens);
        }
        else if (this.lastActiveScreen !== -1) {
            setActiveScreen(this.lastActiveScreen);
        }
    }
    stdinOnData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const { config: { keys }, activeScreen, setActiveScreen, screens } = this.runScreen;
            const { TOGGLE_PROCESS, KILL_PROCESS, TOGGLE_DASHBOARD, NEXT_SCREEN, PREV_SCREEN, } = keys;
            if (key === TOGGLE_PROCESS) {
                this.toggleProcess();
            }
            else if (key === KILL_PROCESS) {
                this.killProcess();
            }
            else if (key === TOGGLE_DASHBOARD) {
                this.toggleDashboard();
            }
            else if (key === NEXT_SCREEN) {
                setActiveScreen(utils_1.getNextTab(screens, activeScreen));
            }
            else if (key === PREV_SCREEN) {
                setActiveScreen(utils_1.getPrevTab(screens, activeScreen));
            }
            else if (!!screens[utils_1.getScreenId(key)]) {
                setActiveScreen(utils_1.getScreenId(key));
            }
            if (screens[activeScreen] && screens[activeScreen].proc) {
                screens[activeScreen].proc.stdin.write(key);
            }
        });
    }
}
exports.Stdin = Stdin;
//# sourceMappingURL=Stdin.js.map