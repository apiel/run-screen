"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stderr = exports.stdout = exports.stdWrite = void 0;
const dashboard_1 = require("./dashboard");
const HISTORY_SIZE = 100;
function stdWrite(runScreen, writeStream, id, data) {
    const { screens, activeScreen } = runScreen;
    if (activeScreen === -1) {
        dashboard_1.dashboard(screens);
    }
    else if (id === activeScreen) {
        writeStream.write(data);
    }
    runScreen.screens[id].data = [
        ...screens[id].data,
        { writeStream, data },
    ].slice(-HISTORY_SIZE);
}
exports.stdWrite = stdWrite;
function stdout(runScreen, id, data) {
    if (id !== runScreen.activeScreen) {
        runScreen.screens[id].missedOutput++;
    }
    stdWrite(runScreen, process.stdout, id, data);
}
exports.stdout = stdout;
function stderr(runScreen, id, data) {
    if (id !== runScreen.activeScreen) {
        runScreen.screens[id].missedError++;
    }
    stdWrite(runScreen, process.stderr, id, data);
}
exports.stderr = stderr;
//# sourceMappingURL=std.js.map