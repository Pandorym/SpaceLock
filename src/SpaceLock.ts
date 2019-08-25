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

    public doOnce(func: any, timeout: number = this.timeout): Promise<any> {
        let result: any;
        let task = new Task(undefined, func);
        if (timeout !== null) {
            setTimeout(() => {task.cancel();}, timeout);
        }

        return this
            .checkIn(task)
            .then(async () => {
                result = await task.exec();
            })
            .then(() => this.checkOut())
            .then(() => result)
            .catch((err) => {
                this.checkOut();
                throw err;
            });
    }

    public doOnce_untilOneDone(func: any, timeout: number = this.timeout): Promise<any> {
        return this.doOnce(func, timeout)
                   .catch(() => this.doOnce_untilOneDone(func, timeout));
    }
}
