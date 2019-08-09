"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SpaceLock {
    constructor(key, options) {
        let _options = Object.assign({}, SpaceLock.defaultOptions, options);
        this.spaceSize = _options.spaceSize;
        this.key = key;
        this.TaskQueue = [];
        this.currentNumber = 0;
    }
    get isFull() {
        return !(this.currentNumber < this.spaceSize);
    }
    get isLocked() {
        return this.isFull;
    }
    get hasWait() {
        return this.TaskQueue.length > 0;
    }
    update() {
        for (; !this.isFull && this.hasWait; this.currentNumber++) {
            this.TaskQueue.shift().go();
        }
    }
    lock() {
        this.currentNumber++;
    }
    unlock() {
        this.currentNumber--;
        this.update();
    }
    wait() {
        let wait = {
            go: null,
            token: null,
        };
        wait.token = new Promise((resolve) => {
            wait.go = resolve;
        });
        this.TaskQueue.push(wait);
        this.update();
        return wait.token;
    }
}
SpaceLock.defaultOptions = {
    spaceSize: 1,
};
exports.SpaceLock = SpaceLock;

//# sourceMappingURL=SpaceLock.js.map
