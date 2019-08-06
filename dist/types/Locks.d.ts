import { Lock } from './Lock';
export declare class Locks {
    locked: Array<Lock>;
    gateWidth: number;
    constructor(gateWidth?: number);
    lock(key: string, gateWidth?: number): Lock;
    unlock(key: string): void;
    wait(key: string): Promise<void>;
    waitAndLock(key: string): Promise<Lock>;
    waitAndLockOnce(key: string, function1: any): Promise<any>;
}
