import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { RunScreenBase } from './RunScreenBase';

export abstract class RunScreenStdin extends RunScreenBase {
    lastActiveScreen = -1;

    stdin() {
        // process.stdin.setEncoding('utf8');
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }

    protected async toggleProcess() {
        const screen = this.screens[this.activeScreen];
        if (screen) {
            if (screen.proc) {
                this.stdout(this.activeScreen, `\n\nctrl+space > stop process: ${screen.config.cmd}\n\n`);
                await kill(screen);
            } else {
                this.stdout(this.activeScreen, `\n\nctrl+space > start process: ${screen.config.cmd}\n\n`);
                this.screens[this.activeScreen] = await this.startScreen(screen);
            }
        }
    }

    protected async killProcess() {
        await Promise.all(this.screens.map(kill));
        // console.clear(); // ??? for htop but in most of the case clearing is not nice
        process.stdin.resume();
        process.exit();
    }

    protected toggleDashboard() {
        if (this.activeScreen !== -1) {
            this.lastActiveScreen = this.activeScreen;
            this.activeScreen = -1;
            dashboard(this.screens);
        } else if (this.lastActiveScreen !== -1) {
            this.setActiveScreen(this.lastActiveScreen);
        }
    }

    async stdinOnData(key: string) {
        const {
            TOGGLE_PROCESS,
            KILL_PROCESS,
            TOGGLE_DASHBOARD,
            NEXT_SCREEN,
            PREV_SCREEN,
        } = this.config.keys;

        // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
        if (key === TOGGLE_PROCESS) {
            this.toggleProcess();
        } else if (key === KILL_PROCESS) {
            this.killProcess();
        } else if (key === TOGGLE_DASHBOARD) { // tab
            this.toggleDashboard();
        } else if (key === NEXT_SCREEN) {
            this.setActiveScreen(getNextTab(this.screens, this.activeScreen));
        } else if (key === PREV_SCREEN) {
            this.setActiveScreen(getPrevTab(this.screens, this.activeScreen));
        } else if (!!this.screens[getScreenId(key)]) {
            this.setActiveScreen(getScreenId(key));
        }
        if (this.screens[this.activeScreen] && this.screens[this.activeScreen].proc) {
            this.screens[this.activeScreen].proc.stdin.write(key);
        }
    }
}
