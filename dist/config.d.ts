export interface ScreenConfig {
    before?: (screen: any) => any;
    after?: (screen: any) => any;
    cmd: string;
}
export interface Config {
    screens: ScreenConfig[];
}
export declare function loadConfig(args: string[]): ScreenConfig[];
