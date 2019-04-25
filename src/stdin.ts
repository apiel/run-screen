import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { RunScreen } from './RunScreen';
import { stdout } from './std';

let lastActiveScreen = -1;

export function stdin(runScreen: RunScreen) {
    // process.stdin.setEncoding('utf8');
    process.stdin.setEncoding('ascii');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => stdinOnData(runScreen, key));
}

export async function toggleProcess(runScreen: RunScreen) {
    const { screens, activeScreen } = runScreen;
    const screen = screens[activeScreen];
    if (screen) {
        if (screen.proc) {
            stdout(runScreen, activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
            await kill(screen);
        } else {
            stdout(runScreen, activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
            runScreen.screens[activeScreen] = await runScreen.startScreen(screen);
        }
    }
}

export async function killProcess({ screens }: RunScreen) {
    await Promise.all(screens.map(kill));
    // console.clear(); // ??? for htop but in most of the case clearing is not nice
    process.stdin.resume();
    process.exit();
}

export function toggleDashboard(runScreen: RunScreen) {
    const { screens, activeScreen } = runScreen;

    if (activeScreen !== -1) {
        lastActiveScreen = activeScreen;
        runScreen.activeScreen = -1;
        dashboard(screens);
    } else if (lastActiveScreen !== -1) {
        runScreen.setActiveScreen(lastActiveScreen);
    }
}

export async function stdinOnData(runScreen: RunScreen, key: string) {
    const { config: { keys }, activeScreen, screens } = runScreen;

    const {
        TOGGLE_PROCESS,
        KILL_PROCESS,
        TOGGLE_DASHBOARD,
        NEXT_SCREEN,
        PREV_SCREEN,
    } = keys;

    // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
    if (key === TOGGLE_PROCESS) {
        toggleProcess(runScreen);
    } else if (key === KILL_PROCESS) {
        killProcess(runScreen);
    } else if (key === TOGGLE_DASHBOARD) { // tab
        toggleDashboard(runScreen);
    } else if (key === NEXT_SCREEN) {
        runScreen.setActiveScreen(getNextTab(screens, activeScreen));
    } else if (key === PREV_SCREEN) {
        runScreen.setActiveScreen(getPrevTab(screens, activeScreen));
    } else if (!!screens[getScreenId(key)]) {
        runScreen.setActiveScreen(getScreenId(key));
    }
    if (screens[activeScreen] && screens[activeScreen].proc) {
        screens[activeScreen].proc.stdin.write(key);
    }
}
