import { SpaceLock } from './SpaceLock';
import { Task } from "./Task";
export declare class Ymir {
    spaceLocks: Array<SpaceLock>;
    static defaultOptions: {
        spaceSize: number;
        timeout: number;
    };
    options: any;
    constructor(options?: any);
    getSpaceLock(key: string, spaceLockOptions?: any): SpaceLock;
    checkIn(key: string): Promise<void>;
    checkOut(key: string): void;
    doOnce(key: string, func: any, timeout?: number, task_key?: string): Promise<any>;
    doOnce_untilOneDone(key: string, func: any, timeout?: number, tryTimesLimit?: number): Promise<any>;
    needOneCheckout(key: string, func: any): Promise<Task>;
    isLocked(key: string): boolean;
    isFull(key: string): boolean;
}
