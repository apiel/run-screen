import { kill, getScreenId, getNextTab, getPrevTab } from './utils';
import { dashboard } from './dashboard';
import { RunScreenBase } from './RunScreenBase';

export abstract class RunScreenStdin extends RunScreenBase {
    stdin() {
        // process.stdin.setEncoding('utf8');
        process.stdin.setEncoding('ascii');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', (key) => this.stdinOnData(key));
    }

    async stdinOnData(key: string) {
        // '\u0012' ctrlR
        // console.log('key', key, !!screens[key], key.charCodeAt(0), `\\u00${key.charCodeAt(0).toString(16)}`);
        if (key === '\u0000') { // ctrlSpace
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
        } else if (key === '\u0003') {
            await Promise.all(this.screens.map(kill));
            // console.clear(); // ??? for htop but in most of the case clearing is not nice
            process.stdin.resume();
            process.exit();
        } else if (key === '\u0009') { // tab
            this.activeScreen = -1;
            dashboard(this.screens);
        } else if (key === '>') {
            this.setActiveScreen(getNextTab(this.screens, this.activeScreen));
        } else if (key === '<') {
            this.setActiveScreen(getPrevTab(this.screens, this.activeScreen));
        } else if (!!this.screens[getScreenId(key)]) {
            this.setActiveScreen(getScreenId(key));
        }
        if (this.screens[this.activeScreen] && this.screens[this.activeScreen].proc) {
            this.screens[this.activeScreen].proc.stdin.write(key);
        }
    }
}
