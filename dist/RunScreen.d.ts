/// <reference types="node" />
import { ChildProcess, SpawnOptions } from 'child_process';
import { Config, ScreenConfig } from './config';
import { Screen } from './RunScreenBase';
import { RunScreenStd } from './RunScreenStd';
export { Screen, Data } from './RunScreenBase';
export declare class RunScreen extends RunScreenStd {
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
