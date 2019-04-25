import { RunScreenBase } from './RunScreenBase';
export declare abstract class RunScreenStdin extends RunScreenBase {
    stdin(): void;
    stdinOnData(key: string): Promise<void>;
}
