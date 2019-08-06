"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lock_1 = require("./Lock");
class Locks {
    constructor() {
        this.locked = [];
    }
    lock(key) {
        let _lock = new Lock_1.Lock(key);
        _lock.lock();
        this.locked.push(_lock);
        return _lock;
    }
    unlock(key) {
        this.locked.splice(this.locked.findIndex((x) => x.key === key), 1)[0].unlock();
    }
    wait(key) {
        let lock = this.locked.find((x) => x.key === key);
        return lock !== undefined
            ? lock.wait()
            : Promise.resolve();
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
