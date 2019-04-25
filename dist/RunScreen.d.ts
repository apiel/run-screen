/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import { ScreenConfig } from './config';
import { RunScreenStdin } from './RunScreenStdin';
import { Screen, Data } from './RunScreenBase';
export { Screen, Data } from './RunScreenBase';
export declare class RunScreen extends RunScreenStdin {
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
}
