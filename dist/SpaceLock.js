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
    get hasTask() {
        return this.TaskQueue.length > 0;
    }
    update() {
        for (; !this.isFull && this.hasTask;) {
            this.TaskQueue.shift().go();
        }
    }
    checkOut() {
        this.currentNumber--;
        this.update();
    }
    checkIn() {
        let task = {
            go: null,
            token: null,
        };
        task.token = new Promise((resolve) => {
            task.go = () => {
                this.currentNumber++;
                resolve();
            };
        });
        this.TaskQueue.push(task);
        this.update();
        return task.token;
    }
    doOnce(func) {
        let result;
        return this
            .checkIn()
            .then(async () => {
            result = await func();
        })
            .then(() => this.checkOut())
            .then(() => result);
    }
}
SpaceLock.defaultOptions = {
    spaceSize: 1,
};
exports.SpaceLock = SpaceLock;

//# sourceMappingURL=SpaceLock.js.map
