import * as pidtree from 'pidtree';
import { promisify } from 'util';

import { Screen } from '.';

export function clear() {
    process.stdout.write('\x1b[2J');
}

export async function kill(screen: Screen) {
    if (screen.run) {
        const pids: number[] = await promisify(pidtree)(screen.run.pid, { root: true });
        pids.forEach((pid) => {
            try {
                process.kill(pid);
            } catch (error) {
                console.error(`Could not kill ${pid}`); // tslint:disable-line
            }
        });
    }
}

export function getScreenId(key: string) {
    const id = parseInt(key, 10);
    if (!isNaN(id)) {
        return (id - 1) % 10;
    }
    return -1;
}

export function getNextTab(screens: Screen[], activeScreen: number, direction = 1) {
    return (activeScreen + direction) % screens.length;
}

export function getPrevTab(screens: Screen[], activeScreen: number) {
    return getNextTab(screens, activeScreen, -1);
}
