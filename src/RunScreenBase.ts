import { ScreenConfig, Config } from './config';
import { ChildProcess } from 'child_process';

export type Data = Buffer | Uint8Array | string;
export interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}

export interface Screen {
    id: number;
    config: ScreenConfig;
    proc: ChildProcess;
    data: ScreenData[];
    missedError: number;
}

export abstract class RunScreenBase {
    abstract config: Config;
    abstract dataHistorySize: number;
    abstract activeScreen: number;
    abstract screens: Screen[];

    abstract stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data): void;
    abstract stdout(id: number, data: Data): void;
    abstract stderr(id: number, data: Data): void;
    abstract handleError(id: number): void;
    abstract startProcess({ cmd }: ScreenConfig, id: number): ChildProcess;
    abstract async startScreen(screen: Screen): Promise<Screen>;
    abstract setActiveScreen(id: number): void;
    abstract stdin(): void;
    abstract async stdinOnData(key: string): Promise<void>;
}
