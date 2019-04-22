import { Screen } from '.';
export declare function clear(): void;
export declare function kill(screen: Screen): Promise<void>;
export declare function getScreenId(key: string): number;
