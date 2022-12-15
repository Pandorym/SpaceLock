export declare class Task {
    key: string;
    status: 'wait' | 'inside' | 'leave' | 'thrown';
    result: any;
    private _func_cancel;
    private _func;
    func: any;
    token: Promise<void>;
    private _token_resolve;
    private _token_reject;
    constructor(key: string, func_task?: any);
    checkIn(): void;
    checkOut(): void;
    cancel(...arg: any[]): void;
    exec(): any;
}
