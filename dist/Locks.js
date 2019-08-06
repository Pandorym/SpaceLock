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
        this.locked.find((x) => x.key === key).unlock();
    }
    wait(key) {
        return this.locked.find((x) => x.key === key).wait();
    }
}
exports.Locks = Locks;

//# sourceMappingURL=Locks.js.map
