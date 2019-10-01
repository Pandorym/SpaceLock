import { Promise } from 'bluebird';

export class Task {
    public key: string;
    public status: 'wait' | 'inside' | 'leave';

    private _func_cancel: any;
    private _func: any;
    public set func(val: any) {
        this._func = () => {
            return Promise.race([val(), new Promise((resolve, reject) => {
                this._func_cancel = reject;
            })]);
        };
    }

    public token: Promise<void>;
    private _token_resolve: any;
    private _token_reject: any;

    constructor(key: string, func_task?: any) {
        this.key = key;
        this.status = 'wait';

        this.token = new Promise((resolve, reject) => {
            this._token_resolve = resolve;
            this._token_reject = reject;
        });

        if (func_task !== undefined) {
            this.func = func_task;
        }
    }

    public checkIn() {
        this.status = 'inside';
        this._token_resolve();
    }

    public checkOut() {
        this.status = 'leave';
    };

    public cancel(...arg: any[]) {
        if (this._func_cancel !== undefined) {
            this._func_cancel(...arg);
        }
    }

    public exec() {
        if (this._func !== undefined) {
            return this._func();
        }
    }
}
