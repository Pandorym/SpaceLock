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
    doOnce(key, func) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce(func);
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
};
exports.Ymir = Ymir;

//# sourceMappingURL=Ymir.js.map
