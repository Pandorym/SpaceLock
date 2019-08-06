export declare class Lock {
    key: string;
    private _;
    unlock: () => void;
    constructor(key: string);
    lock(): void;
    wait(): Promise<void>;
}
