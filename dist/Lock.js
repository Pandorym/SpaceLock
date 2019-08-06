"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Lock {
    constructor(key) {
        this.unlock = () => { };
        this.key = key;
    }
    lock() {
        this._ = new Promise((resolve) => {
            this.unlock = resolve;
        });
    }
    wait() {
        return this._;
    }
}
exports.Lock = Lock;

//# sourceMappingURL=Lock.js.map
