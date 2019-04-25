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
const RunScreenBase_1 = require("./RunScreenBase");
class RunScreenStdin extends RunScreenBase_1.RunScreenBase {
    stdin() {
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }
    stdinOnData(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key === '\u0000') {
                const screen = this.screens[this.activeScreen];
                if (screen) {
                    if (screen.proc) {
                        this.stdout(this.activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                        yield utils_1.kill(screen);
                    }
                    else {
                        this.stdout(this.activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                        this.screens[this.activeScreen] = yield this.startScreen(screen);
                    }
                }
            }
            else if (key === '\u0003') {
                yield Promise.all(this.screens.map(utils_1.kill));
                process.stdin.resume();
                process.exit();
            }
            else if (key === '\u0009') {
                this.activeScreen = -1;
                dashboard_1.dashboard(this.screens);
            }
            else if (key === '>') {
                this.setActiveScreen(utils_1.getNextTab(this.screens, this.activeScreen));
            }
            else if (key === '<') {
                this.setActiveScreen(utils_1.getPrevTab(this.screens, this.activeScreen));
            }
            else if (!!this.screens[utils_1.getScreenId(key)]) {
                this.setActiveScreen(utils_1.getScreenId(key));
            }
            if (this.screens[this.activeScreen] && this.screens[this.activeScreen].proc) {
                this.screens[this.activeScreen].proc.stdin.write(key);
            }
        });
    }
}
exports.RunScreenStdin = RunScreenStdin;
//# sourceMappingURL=RunScreenStdin.js.map