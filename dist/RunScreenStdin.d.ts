import { RunScreenBase } from './RunScreenBase';
export declare abstract class RunScreenStdin extends RunScreenBase {
    stdin(): void;
    protected toggleProcess(): Promise<void>;
    protected killProcess(): Promise<void>;
    stdinOnData(key: string): Promise<void>;
}
