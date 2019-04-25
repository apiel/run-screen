import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { RunScreen } from './RunScreen';

export class Stdin {
    lastActiveScreen = -1;

    constructor(private runScreen: RunScreen) {}

    stdin() {
        // process.stdin.setEncoding('utf8');
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }

    protected async toggleProcess() {
        const { screens, activeScreen } = this.runScreen;
        const screen = screens[activeScreen];
        if (screen) {
            if (screen.proc) {
                this.runScreen.std.stdout(activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                await kill(screen);
            } else {
                this.runScreen.std.stdout(activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                this.runScreen.screens[activeScreen] = await this.runScreen.startScreen(screen);
            }
        }
    }

    protected async killProcess() {
        await Promise.all(this.runScreen.screens.map(kill));
        // console.clear(); // ??? for htop but in most of the case clearing is not nice
        process.stdin.resume();
        process.exit();
    }

    protected toggleDashboard() {
        const { screens, activeScreen } = this.runScreen;

        if (activeScreen !== -1) {
            this.lastActiveScreen = activeScreen;
            this.runScreen.activeScreen = -1;
            dashboard(screens);
        } else if (this.lastActiveScreen !== -1) {
            this.runScreen.setActiveScreen(this.lastActiveScreen);
        }
    }

    async stdinOnData(key: string) {
        const { config: { keys }, activeScreen, screens } = this.runScreen;

        const {
            TOGGLE_PROCESS,
            KILL_PROCESS,
            TOGGLE_DASHBOARD,
            NEXT_SCREEN,
            PREV_SCREEN,
        } = keys;

        // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
        if (key === TOGGLE_PROCESS) {
            this.toggleProcess();
        } else if (key === KILL_PROCESS) {
            this.killProcess();
        } else if (key === TOGGLE_DASHBOARD) { // tab
            this.toggleDashboard();
        } else if (key === NEXT_SCREEN) {
            this.runScreen.setActiveScreen(getNextTab(screens, activeScreen));
        } else if (key === PREV_SCREEN) {
            this.runScreen.setActiveScreen(getPrevTab(screens, activeScreen));
        } else if (!!screens[getScreenId(key)]) {
            this.runScreen.setActiveScreen(getScreenId(key));
        }
        if (screens[activeScreen] && screens[activeScreen].proc) {
            screens[activeScreen].proc.stdin.write(key);
        }
    }
}
