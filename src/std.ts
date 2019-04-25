import { Data } from './types';
import { dashboard } from './dashboard';
import { RunScreen } from './RunScreen';

export { Screen, Data } from './types';

const HISTORY_SIZE = 100;

export function stdWrite(runScreen: RunScreen, writeStream: NodeJS.WriteStream, id: number, data: Data) {
    const { screens, activeScreen } = runScreen;
    if (activeScreen === -1) {
        dashboard(screens);
    } else if (id === activeScreen) {
        writeStream.write(data);
    }
    runScreen.screens[id].data = [
        ...screens[id].data,
        { writeStream, data },
    ].slice(-HISTORY_SIZE);
}

export function stdout(runScreen: RunScreen, id: number, data: Data) {
    if (id !== runScreen.activeScreen) {
        runScreen.screens[id].missedOutput++;
    }
    stdWrite(runScreen, process.stdout, id, data);
}

export function stderr(runScreen: RunScreen, id: number, data: Data) {
    if (id !== runScreen.activeScreen) {
        runScreen.screens[id].missedError++;
    }
    stdWrite(runScreen, process.stderr, id, data);
}
