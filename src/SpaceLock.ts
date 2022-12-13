import *as events from 'events'
import { Task } from './Task';

export class SpaceLock {
    public key: string;
    private _: Promise<void>;
    private emitter = new events.EventEmitter()

    public spaceSize: number;
    public timeout: number;

    public waitTaskQueue: Array<Task>;
    public insideTaskQueue: Array<Task>;

    public get currentNumber(): number {
        return this.insideTaskQueue.length;
    };

    public static defaultOptions: { spaceSize: number, timeout: number } = {
        spaceSize : 1,
        timeout : null,
    };

    public get isFull() {
        return !(this.currentNumber < this.spaceSize);
    }

    public get isLocked() {
        return this.isFull;
    }

    public get hasWaitTask() {
        return this.waitTaskQueue.length > 0;
    }

    public get hasExistTask() {
      return 0 < this.insideTaskQueue.length + this.waitTaskQueue.length
    }

    constructor(key: string, options?: any) {

        let _options = Object.assign({}, SpaceLock.defaultOptions, options);

        this.spaceSize = _options.spaceSize;
        this.timeout = _options.timeout;

        this.key = key;
        this.waitTaskQueue = [];
        this.insideTaskQueue = [];
    }

    public update() {
        for (; !this.isFull && this.hasWaitTask;) {
            let task = this.waitTaskQueue.shift();
            task.checkIn();
            this.insideTaskQueue.push(task);
        }
    }

    public checkOut(task_key?: string) {
        let taskIndex = this.insideTaskQueue.findIndex((x) => x.key === task_key);
        let task = this.insideTaskQueue[taskIndex]
        this.insideTaskQueue.splice(taskIndex, 1);

        this.update();

        this.emitter.emit('checkout', task)
    }

    public checkIn(task: Task): Promise<void>
    public checkIn(task_key?: string, func?: any): Promise<void>
    public checkIn(x?: string | Task, y?: any): Promise<void> {
        let _task;
        if (typeof x === 'object') {
            _task = x;
        } else {
            _task = new Task(x, y);
        }

        this.waitTaskQueue.push(_task);

        this.update();

        return _task.token;
    }

    public doOnce(func: any, timeout: number = this.timeout, task_key? :string): Promise<any> {
        let result: any;
        let task = new Task(task_key, func);

        return this
            .checkIn(task)
            .then(async () => {
                if (timeout === null) {
                    result = await task.exec();
                } else {
                    result = await Promise.race([task.exec(), new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), timeout))])
                }
            })
            .then(() => this.checkOut(task_key))
            .then(() => result)
            .catch((err) => {
                this.checkOut(task_key);
                return Promise.reject(err);
            });
    }

    public doOnce_untilOneDone(func: any, timeout: number = this.timeout, tryTimesLimit: number = null): Promise<any> {
        let result: any;
        let task = new Task(undefined, func);

        return this
            .checkIn(task)
            .then(async () => {
                let retry: boolean;
                let try_time = 0;
                do {
                    try_time++;
                    retry = false;
                    try {
                        if (timeout === null) {
                            result = await task.exec();
                        } else {
                            result = await Promise.race([task.exec(), new Promise((resolve, reject) => setTimeout(() => reject('Timeout'), timeout))])
                        }
                    }
                    catch (e) {
                        if (tryTimesLimit !== null && try_time >= tryTimesLimit) {
                            return Promise.reject(e);
                        }
                        retry = true;
                    }
                } while (retry);
            })
            .then(() => this.checkOut())
            .then(() => result)
            .catch((err) => {
                // console.log('doOnce_untilOneDone error:', err);
                this.checkOut();
                return Promise.reject(err);
            });
    }

    public needOneCheckout(func: any) : Promise<Task>{
      return new Promise(resolved  => {
        this.emitter.once('checkout', resolved)
        if (!this.hasExistTask) {
          this.doOnce(func).then()
        }
      })
    }
}
