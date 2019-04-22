#!/usr/bin/env node
/// <reference types="node" />
import { ChildProcess } from 'child_process';
declare type Data = Buffer | Uint8Array | string;
interface ScreenData {
    writeStream: NodeJS.WriteStream;
    data: Data;
}
export interface Screen {
    id: number;
    cmd: string;
    run: ChildProcess;
    data: ScreenData[];
}
export {};
