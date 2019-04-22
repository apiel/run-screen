import { Screen } from '.';
export declare function kill(screen: Screen): Promise<void>;
export declare function getScreenId(key: string): number;
export declare function getNextTab(screens: Screen[], activeScreen: number, direction?: number): number;
export declare function getPrevTab(screens: Screen[], activeScreen: number): number;
