import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess, SpawnOptions } from 'child_process';

import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { ScreenConfig } from './config';

type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}

export interface Screen {
    id: number;
    config: ScreenConfig;
    proc: ChildProcess;
    data: ScreenData[];
    missedError: number;
}

export class RunScreen {
    spawnOptions: SpawnOptions = {
        // cwd: process.cwd(),
    };
    dataHistorySize = 100;
    activeScreen = 0;
    screens: Screen[] = [];

    run(screenConfigs: ScreenConfig[]) {
        screenConfigs.forEach((screenConfig, id) => {
            const screen = { proc: null, config: screenConfig, id, data: [], missedError: 0 };
            this.screens.push(screen);
            this.startScreen(screen);
        });
        this.stdin();
    }

    stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data) {
        if (id === this.activeScreen) {
            writeStream.write(data);
        }
        this.screens[id].data = [
            ...this.screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }

    stdout(id: number, data: Data) {
        this.stdWrite(process.stdout, id, data);
    }

    stderr(id: number, data: Data) {
        this.stdWrite(process.stderr, id, data);
        this.handleError(id);
    }

    handleError(id: number) {
        if (id !== this.activeScreen) {
            this.screens[id].missedError++;
        }
        if (this.activeScreen === -1) {
            dashboard(this.screens);
        }
    }

    startProcess({ cmd }: ScreenConfig, id: number): ChildProcess {
        const [command, ...params] = parse(cmd, process.env);

        const proc = spawn(command as string, params as string[], this.spawnOptions);

        proc.stdout.on('data', (data) => this.stdout(id, data));
        proc.stderr.on('data', (data) => this.stderr(id, data));

        proc.on('close', (code) => {
            this.stdout(id, `child process exited with code ${code}`);
            this.screens[id].proc = null;
        });

        return proc;
    }

    async startScreen(screen: Screen) {
        const { id, config } = screen;
        const { before, after } = config;

        if (before) {
            await before(id, config, this);
        }
        screen.proc = this.startProcess(config, id);
        if (after) {
            await after(screen, this);
        }
        return screen;
    }

    setActiveScreen(id: number) {
        this.activeScreen = id;
        console.clear();
        this.screens[this.activeScreen].data.forEach(
            ({ writeStream, data }) => writeStream.write(data),
        );
        this.screens[this.activeScreen].missedError = 0;
    }

    stdin() {
        // process.stdin.setEncoding('utf8');
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }

    async stdinOnData(key: string) {
        // '\u0012' ctrlR
        // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
        if (key === '\u0000') { // ctrlSpace
            const screen = this.screens[this.activeScreen];
            if (screen) {
                if (screen.proc) {
                    this.stdout(this.activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                    await kill(screen);
                } else {
                    this.stdout(this.activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                    this.screens[this.activeScreen] = await this.startScreen(screen);
                }
            }
        } else if (key === '\u0003') {
            await Promise.all(this.screens.map(kill));
            // console.clear(); // ??? for htop but in most of the case clearing is not nice
            process.stdin.resume();
            process.exit();
        } else if (key === '\u0009') { // tab
            this.activeScreen = -1;
            dashboard(this.screens);
        } else if (key === '>') {
            this.setActiveScreen(getNextTab(this.screens, this.activeScreen));
        } else if (key === '<') {
            this.setActiveScreen(getPrevTab(this.screens, this.activeScreen));
        } else if (!!this.screens[getScreenId(key)]) {
            this.setActiveScreen(getScreenId(key));
        }
        if (this.screens[this.activeScreen] && this.screens[this.activeScreen].proc) {
            this.screens[this.activeScreen].proc.stdin.write(key);
        }
    }
}
