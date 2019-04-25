"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RunScreenStdin_1 = require("./RunScreenStdin");
class RunScreenStd extends RunScreenStdin_1.RunScreenStdin {
    stdWrite(writeStream, id, data) {
        if (id === this.activeScreen) {
            writeStream.write(data);
        }
        this.screens[id].data = [
            ...this.screens[id].data,
            { writeStream, data },
        ].slice(-this.dataHistorySize);
    }
    stdout(id, data) {
        this.stdWrite(process.stdout, id, data);
    }
    stderr(id, data) {
        this.stdWrite(process.stderr, id, data);
        this.handleError(id);
    }
}
exports.RunScreenStd = RunScreenStd;
//# sourceMappingURL=RunScreenStd.js.map