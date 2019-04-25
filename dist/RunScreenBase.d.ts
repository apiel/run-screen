/// <reference types="node" />
import { ScreenConfig, Config } from './config';
import { ChildProcess } from 'child_process';
export declare type Data = Buffer | Uint8Array | string;
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
    missedOutput: number;
}
export declare abstract class RunScreenBase {
    abstract config: Config;
    abstract dataHistorySize: number;
    abstract activeScreen: number;
    abstract screens: Screen[];
    abstract stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data): void;
    abstract stdout(id: number, data: Data): void;
    abstract stderr(id: number, data: Data): void;
    abstract startProcess({ cmd }: ScreenConfig, id: number): ChildProcess;
    abstract startScreen(screen: Screen): Promise<Screen>;
    abstract setActiveScreen(id: number): void;
    abstract stdin(): void;
    abstract stdinOnData(key: string): Promise<void>;
}
