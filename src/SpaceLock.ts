import { Promise } from 'bluebird';
import { Task } from './Task';

export class SpaceLock {
    public key: string;
    private _: Promise<void>;

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
        this.insideTaskQueue.splice(taskIndex, 1);

        this.update();
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
                    result = await task.exec()
                                       .timeout(timeout);
                }
            })
            .then(() => this.checkOut(task_key))
            .then(() => result)
            .catch((err) => {
                this.checkOut(task_key);
                return Promise.reject(err);
            });
    }

    public doOnce_untilOneDone(func: any, timeout: number = this.timeout): Promise<any> {
        let result: any;
        let task = new Task(undefined, func);

        return this
            .checkIn(task)
            .then(async () => {
                let retry: boolean;
                do {
                    retry = false;
                    try {
                        if (timeout === null) {
                            result = await task.exec();
                        } else {
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
                return Promise.reject(err);
            });
    }
}
