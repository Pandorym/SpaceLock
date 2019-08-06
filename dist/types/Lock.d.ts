export declare class Lock {
    key: string;
    private _;
    isLocked: boolean;
    gateWidth: number;
    currentNumber: number;
    waitList: Array<{
        go: any;
        token: Promise<void>;
    }>;
    constructor(key: string, gateWidth?: number);
    lock(): void;
    unlock(): void;
    wait(): Promise<void>;
}
