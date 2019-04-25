import { extname } from 'path';
import { Screen } from '.';

function invalidConfigFormat(message: string) {
    console.log(
        `Invalid config format
...

${message}`,
    );
    process.exit();
}

export interface ScreenConfig {
    before?: (id: number, screenConfig: ScreenConfig) => Promise<void> | void;
    after?: (screen: Screen) => Promise<void> | void;
    cmd: string;
}

export interface Config {
    screens: ScreenConfig[];
}

export function loadConfig(args: string[]): ScreenConfig[] {
    if (extname(args[0]) === '.js') { // we could check that's not executable file and `#!/usr/bin/env node` is not on top
        const configPath = require.resolve(
            args[0],
            { paths: [process.cwd()] },
        );
        const config: Config = require(configPath); // tslint:disable-line

        if (!config.screens) {
            invalidConfigFormat('Screens settings are missings');
        }
        const screens = config.screens.filter(screen => screen.cmd);
        if (!screens.length) {
            invalidConfigFormat('Commands are missings in screens');
        }
        return screens;
    }
    return args.map(cmd => ({ cmd }));
}
