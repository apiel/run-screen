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
    missedOutput: number;
}
