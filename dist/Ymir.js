"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SpaceLock_1 = require("./SpaceLock");
class Ymir {
    constructor(options) {
        this.spaceLocks = [];
        this.options = Object.assign({}, Ymir.defaultOptions, options);
    }
    getSpaceLock(key, spaceLockOptions = this.options) {
        let spaceLock = this.spaceLocks.find((x) => x.key === key);
        if (spaceLock === undefined) {
            spaceLock = new SpaceLock_1.SpaceLock(key, spaceLockOptions);
            this.spaceLocks.push(spaceLock);
        }
        return spaceLock;
    }
    checkIn(key) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.checkIn();
    }
    checkOut(key) {
        let spaceLock = this.getSpaceLock(key);
        spaceLock.checkOut();
    }
    doOnce(key, func, timeout = this.options.timeout, task_key) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce(func, timeout, task_key);
    }
    doOnce_untilOneDone(key, func, timeout = this.options.timeout, tryTimesLimit = null) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce_untilOneDone(func, timeout, tryTimesLimit);
    }
    needOneCheckout(key, func) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.needOneCheckout(func);
    }
    isLocked(key) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.isLocked;
    }
    isFull(key) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.isFull;
    }
}
Ymir.defaultOptions = {
    spaceSize: 1,
    timeout: null,
};
exports.Ymir = Ymir;

//# sourceMappingURL=Ymir.js.map
