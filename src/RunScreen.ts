import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess, SpawnOptions } from 'child_process';

import { Config, ScreenConfig } from './config';
import { Screen } from './RunScreenBase';
import { RunScreenStd } from './RunScreenStd';

export { Screen, Data } from './RunScreenBase';

export class RunScreen extends RunScreenStd {
    spawnOptions: SpawnOptions = {
        // cwd: process.cwd(),
    };
    dataHistorySize = 100;
    activeScreen = 0;
    screens: Screen[] = [];

    constructor(readonly config: Config) {
        super();
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
        this.stdin();
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
        this.screens[this.activeScreen].missedOutput = 0;
    }
}
