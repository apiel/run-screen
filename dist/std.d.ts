/// <reference types="node" />
import { Data } from './types';
import { RunScreen } from './RunScreen';
export { Screen, Data } from './types';
export declare function stdWrite(runScreen: RunScreen, writeStream: NodeJS.WriteStream, id: number, data: Data): void;
export declare function stdout(runScreen: RunScreen, id: number, data: Data): void;
export declare function stderr(runScreen: RunScreen, id: number, data: Data): void;
