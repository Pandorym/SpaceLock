"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Lock {
    constructor(key, gateWidth = null) {
        this.key = key;
        this.gateWidth = gateWidth;
        this.waitList = [];
        this.isLocked = false;
        this.currentNumber = 0;
    }
    lock() {
        this.isLocked = true;
    }
    unlock() {
        for (let num = 0; num < this.gateWidth; num++) {
            if (this.waitList.length > 0)
                this.waitList.shift().go();
        }
        if (this.waitList.length === 0)
            this.isLocked = false;
    }
    wait() {
        if (!this.isLocked) {
            this.isLocked = true;
            return Promise.resolve();
        }
        let wait = {
            go: null,
            token: null,
        };
        wait.token = new Promise((resolve) => {
            wait.go = resolve;
        });
        this.waitList.push(wait);
        return wait.token;
    }
}
exports.Lock = Lock;

//# sourceMappingURL=Lock.js.map
