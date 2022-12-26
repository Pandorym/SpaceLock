import { Task } from './Task';
export declare class SpaceLock {
    key: string;
    private _;
    private emitter;
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
    readonly hasExistTask: boolean;
    hasExistTaskSpeciallyTaskKey(task_key?: any): boolean;
    constructor(key: string, options?: any);
    update(): void;
    checkOut(task_key?: string): void;
    checkIn(task: Task): Promise<void>;
    checkIn(task_key?: string, func?: any): Promise<void>;
    doOnce(func: any, timeout?: number, task_key?: string): Promise<any>;
    doOnce_untilOneDone(func: any, timeout?: number, tryTimesLimit?: number): Promise<any>;
    /**
     * 要求得到一个从空间内签出的任务
     * <br> 该签出的任务状态可能是 leave 或 thrown
     * @param func 如果空间内不存在任务，签入执行 func
     * @param task_key 如不为 undef，要求得到具有相同的 task_key 的任务签出
     */
    needOneCheckout(func: any, task_key?: any): Promise<Task>;
}
