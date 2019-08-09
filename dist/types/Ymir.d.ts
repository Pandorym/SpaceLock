import { SpaceLock } from './SpaceLock';
export declare class Ymir {
    locked: Array<SpaceLock>;
    static defaultOptions: {
        spaceSize: number;
    };
    options: any;
    constructor(options?: any);
    lock(key: string, options?: any): SpaceLock;
    unlock(key: string): void;
    get(key: string): SpaceLock;
    isLocked(key: string): boolean;
    wait(key: string): Promise<void>;
    waitAndLockOnce(key: string, function1: any): Promise<any>;
}
