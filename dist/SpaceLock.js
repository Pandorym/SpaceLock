"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = require("bluebird");
const Task_1 = require("./Task");
class SpaceLock {
    constructor(key, options) {
        let _options = Object.assign({}, SpaceLock.defaultOptions, options);
        this.spaceSize = _options.spaceSize;
        this.timeout = _options.timeout;
        this.key = key;
        this.waitTaskQueue = [];
        this.insideTaskQueue = [];
    }
    get currentNumber() {
        return this.insideTaskQueue.length;
    }
    ;
    get isFull() {
        return !(this.currentNumber < this.spaceSize);
    }
    get isLocked() {
        return this.isFull;
    }
    get hasWaitTask() {
        return this.waitTaskQueue.length > 0;
    }
    update() {
        for (; !this.isFull && this.hasWaitTask;) {
            let task = this.waitTaskQueue.shift();
            task.checkIn();
            this.insideTaskQueue.push(task);
        }
    }
    checkOut(task_key) {
        let taskIndex = this.insideTaskQueue.findIndex((x) => x.key === task_key);
        this.insideTaskQueue.splice(taskIndex, 1);
        this.update();
    }
    checkIn(x, y) {
        let _task;
        if (typeof x === 'object') {
            _task = x;
        }
        else {
            _task = new Task_1.Task(x, y);
        }
        this.waitTaskQueue.push(_task);
        this.update();
        return _task.token;
    }
    doOnce(func, timeout = this.timeout, task_key) {
        let result;
        let task = new Task_1.Task(task_key, func);
        return this
            .checkIn(task)
            .then(async () => {
            if (timeout === null) {
                result = await task.exec();
            }
            else {
                result = await task.exec()
                    .timeout(timeout);
            }
        })
            .then(() => this.checkOut(task_key))
            .then(() => result)
            .catch((err) => {
            this.checkOut(task_key);
            return bluebird_1.Promise.reject(err);
        });
    }
    doOnce_untilOneDone(func, timeout = this.timeout) {
        let result;
        let task = new Task_1.Task(undefined, func);
        return this
            .checkIn(task)
            .then(async () => {
            let retry;
            do {
                retry = false;
                try {
                    if (timeout === null) {
                        result = await task.exec();
                    }
                    else {
                        result = await task.exec()
                            .timeout(timeout);
                    }
                }
                catch (e) {
                    retry = true;
                }
            } while (retry);
        })
            .then(() => this.checkOut())
            .then(() => result)
            .catch((err) => {
            console.log(err);
            this.checkOut();
            return bluebird_1.Promise.reject(err);
        });
    }
}
SpaceLock.defaultOptions = {
    spaceSize: 1,
    timeout: null,
};
exports.SpaceLock = SpaceLock;

//# sourceMappingURL=SpaceLock.js.map
