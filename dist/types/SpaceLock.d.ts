export declare class SpaceLock {
    key: string;
    private _;
    spaceSize: number;
    currentNumber: number;
    TaskQueue: Array<{
        go: any;
        token: Promise<void>;
    }>;
    static defaultOptions: {
        spaceSize: number;
    };
    readonly isFull: boolean;
    readonly isLocked: boolean;
    readonly hasWait: boolean;
    constructor(key: string, options?: any);
    update(): void;
    lock(): void;
    unlock(): void;
    wait(): Promise<void>;
}
