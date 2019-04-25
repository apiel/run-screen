import { RunScreen } from './RunScreen';
export declare function stdin(runScreen: RunScreen): void;
export declare function toggleProcess(runScreen: RunScreen): Promise<void>;
export declare function killProcess({ screens }: RunScreen): Promise<void>;
export declare function toggleDashboard(runScreen: RunScreen): void;
export declare function stdinOnData(runScreen: RunScreen, key: string): Promise<void>;
