import * as spawn from 'cross-spawn';
import { parse } from 'shell-quote';
import { ChildProcess, SpawnOptions } from 'child_process';

import { dashboard } from './dashboard';
import { ScreenConfig } from './config';
import { RunScreenStdin } from './RunScreenStdin';
import { Screen, Data } from './RunScreenBase';

export { Screen, Data } from './RunScreenBase';

export class RunScreen extends RunScreenStdin {
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
}
