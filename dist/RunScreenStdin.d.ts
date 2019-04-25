import { RunScreenBase } from './RunScreenBase';
export declare abstract class RunScreenStdin extends RunScreenBase {
    lastActiveScreen: number;
    stdin(): void;
    protected toggleProcess(): Promise<void>;
    protected killProcess(): Promise<void>;
    protected toggleDashboard(): void;
    stdinOnData(key: string): Promise<void>;
}
