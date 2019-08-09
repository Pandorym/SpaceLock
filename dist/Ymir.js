"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpaceLock_1 = require("./SpaceLock");
class Ymir {
    constructor(options) {
        this.locked = [];
        this.options = Object.assign({}, Ymir.defaultOptions, options);
    }
    lock(key, options = this.options) {
        let _lock = this.locked.find((x) => x.key === key);
        if (_lock === undefined) {
            _lock = new SpaceLock_1.SpaceLock(key, options);
            this.locked.push(_lock);
        }
        _lock.lock();
        return _lock;
    }
    unlock(key) {
        let lockIndex = this.locked.findIndex((x) => x.key === key);
        if (lockIndex === -1)
            return;
        let lock = this.locked[lockIndex];
        lock.unlock();
    }
    get(key) {
        return this.locked.find((x) => x.key === key);
    }
    isLocked(key) {
        let lock = this.get(key);
        return lock !== undefined && lock.isLocked;
    }
    wait(key) {
        let lock = this.locked.find((x) => x.key === key);
        if (lock === undefined) {
            lock = new SpaceLock_1.SpaceLock(key, this.options);
            this.locked.push(lock);
        }
        return lock.wait();
    }
    waitAndLockOnce(key, function1) {
        let result;
        return this
            .wait(key)
            .then(async () => {
            result = await function1();
        })
            .then(() => this.unlock(key))
            .then(() => result);
    }
}
Ymir.defaultOptions = {
    spaceSize: 1,
};
exports.Ymir = Ymir;

//# sourceMappingURL=Ymir.js.map
