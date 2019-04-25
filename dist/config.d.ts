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
export declare function loadConfig(args: string[]): Config;
