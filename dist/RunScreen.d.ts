/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import { Config, ScreenConfig } from './config';
import { Screen } from './types';
export { Screen, Data } from './types';
export declare class RunScreen {
    readonly config: Config;
    spawnOptions: SpawnOptions;
    dataHistorySize: number;
    activeScreen: number;
    screens: Screen[];
    constructor(config: Config);
    run(): void;
    startProcess({ cmd }: ScreenConfig, id: number): ChildProcess;
    startScreen(screen: Screen): Promise<Screen>;
    setActiveScreen(id: number): void;
}
