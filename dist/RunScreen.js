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
const spawn = require("cross-spawn");
const shell_quote_1 = require("shell-quote");
const utils_1 = require("./utils");
const dashboard_1 = require("./dashboard");
class RunScreen {
    constructor() {
        this.spawnOptions = {};
        this.dataHistorySize = 100;
        this.activeScreen = 0;
        this.screens = [];
    }
    run(screenConfigs) {
        screenConfigs.forEach((screenConfig, id) => {
            const screen = { proc: null, config: screenConfig, id, data: [], missedError: 0 };
            this.screens.push(screen);
            this.startScreen(screen);
        });
        this.stdin();
    }
    stdWrite(writeStream, id, data) {
        if (id === this.activeScreen) {
            writeStream.write(data);
        }
        this.screens[id].data = [
            ...this.screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }
    stdout(id, data) {
        this.stdWrite(process.stdout, id, data);
    }
    stderr(id, data) {
        this.stdWrite(process.stderr, id, data);
        this.handleError(id);
    }
    handleError(id) {
        if (id !== this.activeScreen) {
            this.screens[id].missedError++;
        }
        if (this.activeScreen === -1) {
            dashboard_1.dashboard(this.screens);
        }
    }
    startProcess({ cmd }, id) {
        const [command, ...params] = shell_quote_1.parse(cmd, process.env);
        const proc = spawn(command, params, this.spawnOptions);
        proc.stdout.on('data', (data) => this.stdout(id, data));
        proc.stderr.on('data', (data) => this.stderr(id, data));
        proc.on('close', (code) => {
            this.stdout(id, `child process exited with code ${code}`);
            this.screens[id].proc = null;
        });
        return proc;
    }
    startScreen(screen) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, config } = screen;
            const { before, after } = config;
            if (before) {
                yield before(id, config, this);
            }
            screen.proc = this.startProcess(config, id);
            if (after) {
                yield after(screen, this);
            }
            return screen;
        });
    }
    setActiveScreen(id) {
        this.activeScreen = id;
        console.clear();
        this.screens[this.activeScreen].data.forEach(({ writeStream, data }) => writeStream.write(data));
        this.screens[this.activeScreen].missedError = 0;
    }
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
exports.RunScreen = RunScreen;
//# sourceMappingURL=RunScreen.js.map