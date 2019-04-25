#!/usr/bin/env node
/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { ScreenConfig } from './config';
declare type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}
export interface Screen {
    id: number;
    config: ScreenConfig;
    run: ChildProcess;
    data: ScreenData[];
    missedError: number;
}
export {};
