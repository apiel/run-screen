import { RunScreenStdin } from './RunScreenStdin';
import { Data } from './RunScreenBase';
import { dashboard } from './dashboard';

export { Screen, Data } from './RunScreenBase';

export abstract class RunScreenStd extends RunScreenStdin {
    stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data) {
        if (this.activeScreen === -1) {
            dashboard(this.screens);
        } else if (id === this.activeScreen) {
            writeStream.write(data);
        }
        this.screens[id].data = [
            ...this.screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }

    stdout(id: number, data: Data) {
        if (id !== this.activeScreen) {
            this.screens[id].missedOutput++;
        }
        this.stdWrite(process.stdout, id, data);
    }

    stderr(id: number, data: Data) {
        if (id !== this.activeScreen) {
            this.screens[id].missedError++;
        }
        this.stdWrite(process.stderr, id, data);
    }
}
