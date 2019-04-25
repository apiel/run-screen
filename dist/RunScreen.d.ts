/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import { ScreenConfig } from './config';
declare type Data = Buffer | Uint8Array | string;
interface ScreenData {
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
export declare class RunScreen {
    spawnOptions: SpawnOptions;
    dataHistorySize: number;
    activeScreen: number;
    screens: Screen[];
    run(screenConfigs: ScreenConfig[]): void;
    stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data): void;
    stdout(id: number, data: Data): void;
    stderr(id: number, data: Data): void;
    handleError(id: number): void;
    startProcess({ cmd }: ScreenConfig, id: number): ChildProcess;
    startScreen(screen: Screen): Promise<Screen>;
    setActiveScreen(id: number): void;
    stdin(): void;
    stdinOnData(key: string): Promise<void>;
}
export {};
