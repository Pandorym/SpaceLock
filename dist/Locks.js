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
}
exports.Locks = Locks;

//# sourceMappingURL=Locks.js.map
