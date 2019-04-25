import { Data } from './types';
import { dashboard } from './dashboard';
import { RunScreen } from './RunScreen';

export { Screen, Data } from './types';

export class Std {
    dataHistorySize = 100;

    constructor(private runScreen: RunScreen) {}

    stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data) {
        const { screens, activeScreen } = this.runScreen;
        if (activeScreen === -1) {
            dashboard(screens);
        } else if (id === activeScreen) {
            writeStream.write(data);
        }
        this.runScreen.screens[id].data = [
            ...screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }

    stdout(id: number, data: Data) {
        if (id !== this.runScreen.activeScreen) {
            this.runScreen.screens[id].missedOutput++;
        }
        this.stdWrite(process.stdout, id, data);
    }

    stderr(id: number, data: Data) {
        if (id !== this.runScreen.activeScreen) {
            this.runScreen.screens[id].missedError++;
        }
        this.stdWrite(process.stderr, id, data);
    }
}
