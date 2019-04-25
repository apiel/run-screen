"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RunScreenStdin_1 = require("./RunScreenStdin");
const dashboard_1 = require("./dashboard");
class RunScreenStd extends RunScreenStdin_1.RunScreenStdin {
    stdWrite(writeStream, id, data) {
        if (this.activeScreen === -1) {
            dashboard_1.dashboard(this.screens);
        }
        else if (id === this.activeScreen) {
            writeStream.write(data);
        }
        this.screens[id].data = [
            ...this.screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }
    stdout(id, data) {
        if (id !== this.activeScreen) {
            this.screens[id].missedOutput++;
        }
        this.stdWrite(process.stdout, id, data);
    }
    stderr(id, data) {
        if (id !== this.activeScreen) {
            this.screens[id].missedError++;
        }
        this.stdWrite(process.stderr, id, data);
    }
}
exports.RunScreenStd = RunScreenStd;
//# sourceMappingURL=RunScreenStd.js.map