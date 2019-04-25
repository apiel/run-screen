import { RunScreen } from './RunScreen';
export declare class Stdin {
    private runScreen;
    constructor(runScreen: RunScreen);
    lastActiveScreen: number;
    stdin(): void;
    protected toggleProcess(): Promise<void>;
    protected killProcess(): Promise<void>;
    protected toggleDashboard(): void;
    stdinOnData(key: string): Promise<void>;
}
