"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
class Task {
    set func(val) {
        this._func = () => {
            return bluebird_1.Promise.race([val(), new bluebird_1.Promise((resolve, reject) => {
                    this._func_cancel = reject;
                })]);
        };
    }
    constructor(key, func_task) {
        this.key = key;
        this.status = 'wait';
        this.token = new bluebird_1.Promise((resolve, reject) => {
            this._token_resolve = resolve;
            this._token_reject = reject;
        });
        if (func_task !== undefined) {
            this.func = func_task;
        }
    }
    checkIn() {
        this.status = 'inside';
        this._token_resolve();
    }
    checkOut() {
        this.status = 'leave';
    }
    ;
    cancel(...arg) {
        if (this._func_cancel !== undefined) {
            this._func_cancel(...arg);
        }
    }
    exec() {
        if (this._func !== undefined) {
            return this._func();
        }
    }
}
exports.Task = Task;

//# sourceMappingURL=Task.js.map
