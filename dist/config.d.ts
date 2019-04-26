import { Screen, RunScreen } from './RunScreen';
export interface ScreenConfig {
    before?: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;
    after?: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;
    cmd: string;
}
export interface Keys {
    TOGGLE_PROCESS: string;
    KILL_PROCESS: string;
    TOGGLE_DASHBOARD: string;
    NEXT_SCREEN: string;
    PREV_SCREEN: string;
}
export interface Config {
    keys: Keys;
    screens: ScreenConfig[];
}
export declare const helpinfo = "\n    You can have up to 10 process in parallel, switching from one screen to the other by the numeric key of your keyboard, from 1 to 10.\n    To exit, press key combination \"ctrl+c\"\n    Stop/start process, press key \".\"\n    Next screen, press key \">\"\n    Previous screen, press key \"<\"\n    Dashboard, press key \"tab\"";
export declare function loadConfig(args: string[]): Config;
