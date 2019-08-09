import { SpaceLock } from './SpaceLock';
export declare class Ymir {
    locked: Array<SpaceLock>;
    static defaultOptions: {
        spaceSize: number;
    };
    options: any;
    constructor(options?: any);
    getSpaceLock(key: string, spaceLockOptions?: any): SpaceLock;
    checkIn(key: string): Promise<void>;
    checkOut(key: string): void;
    doOnce(key: string, func: any): Promise<any>;
    isLocked(key: string): boolean;
}
