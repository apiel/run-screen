/// <reference types="node" />
import { RunScreenStdin } from './RunScreenStdin';
import { Data } from './RunScreenBase';
export { Screen, Data } from './RunScreenBase';
export declare abstract class RunScreenStd extends RunScreenStdin {
    stdWrite(writeStream: NodeJS.WriteStream, id: number, data: Data): void;
    stdout(id: number, data: Data): void;
    stderr(id: number, data: Data): void;
}
