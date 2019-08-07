"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lock_1 = require("./Lock");
class Locks {
    constructor(gateWidth = 1) {
        this.locked = [];
        this.gateWidth = gateWidth;
    }
    lock(key, gateWidth = this.gateWidth) {
        let _lock = this.locked.find((x) => x.key === key);
        if (_lock === undefined) {
            _lock = new Lock_1.Lock(key, gateWidth);
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
            lock = new Lock_1.Lock(key, this.gateWidth);
            this.locked.push(lock);
        }
        return lock.wait();
    }
    waitAndLock(key) {
        return this
            .wait(key)
            .then(() => this.lock(key));
    }
    waitAndLockOnce(key, function1) {
        let result;
        return this
            .waitAndLock(key)
            .then(async () => {
            result = await function1();
        })
            .then(() => this.unlock(key))
            .then(() => result);
    }
}
exports.Locks = Locks;

//# sourceMappingURL=Locks.js.map
