import { Screen, RunScreen } from './RunScreen';
export interface ScreenConfig {
    before?: (id: number, screenConfig: ScreenConfig, runScreen: RunScreen) => Promise<void> | void;
    after?: (screen: Screen, runScreen: RunScreen) => Promise<void> | void;
    cmd: string;
}
export interface Config {
    screens: ScreenConfig[];
}
export declare function loadConfig(args: string[]): ScreenConfig[];
