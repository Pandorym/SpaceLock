import { Lock } from './Lock';
export declare class Locks {
    locked: Array<Lock>;
    constructor();
    lock(key: string): Lock;
    unlock(key: string): void;
    wait(key: string): Promise<void>;
}
