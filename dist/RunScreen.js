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
exports.RunScreen = void 0;
const spawn = require("cross-spawn");
const shell_quote_1 = require("shell-quote");
const std_1 = require("./std");
class RunScreen {
    constructor(config) {
        this.config = config;
        this.spawnOptions = {
            env: Object.assign({ FORCE_COLOR: 'true', COLUMNS: process.stdout.columns.toString(), LINES: process.stdout.rows.toString() }, process.env),
            shell: true,
        };
        this.dataHistorySize = 100;
        this.activeScreen = 0;
        this.screens = [];
    }
    run() {
        this.config.screens.forEach((screenConfig, id) => {
            const screen = {
                proc: null,
                config: screenConfig,
                id, data: [],
                missedError: 0,
                missedOutput: 0,
            };
            this.screens.push(screen);
            this.startScreen(screen);
        });
    }
    startProcess({ cmd }, id) {
        const [command, ...params] = shell_quote_1.parse(cmd, process.env);
        const proc = spawn(command, params, this.spawnOptions);
        proc.stdout.on('data', (data) => std_1.stdout(this, id, data));
        proc.stderr.on('data', (data) => std_1.stderr(this, id, data));
        proc.on('close', (code) => {
            std_1.stdout(this, id, `child process exited with code ${code}`);
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
        this.screens[this.activeScreen].missedOutput = 0;
    }
}
exports.RunScreen = RunScreen;
//# sourceMappingURL=RunScreen.js.map