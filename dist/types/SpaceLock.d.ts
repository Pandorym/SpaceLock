import { Task } from './Task';
export declare class SpaceLock {
    key: string;
    private _;
    spaceSize: number;
    timeout: number;
    waitTaskQueue: Array<Task>;
    insideTaskQueue: Array<Task>;
    readonly currentNumber: number;
    static defaultOptions: {
        spaceSize: number;
        timeout: number;
    };
    readonly isFull: boolean;
    readonly isLocked: boolean;
    readonly hasWaitTask: boolean;
    constructor(key: string, options?: any);
    update(): void;
    checkOut(task_key?: string): void;
    checkIn(task: Task): Promise<void>;
    checkIn(task_key?: string, func?: any): Promise<void>;
    doOnce(func: any, timeout?: number, task_key?: string): Promise<any>;
    doOnce_untilOneDone(func: any, timeout?: number): Promise<any>;
}
