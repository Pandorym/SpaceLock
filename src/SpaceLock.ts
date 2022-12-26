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

    public hasExistTaskSpeciallyTaskKey(task_key?: any) {
      if (task_key === undefined) return this.hasExistTask
      return 0 < this.insideTaskQueue.filter(task => task.key === task_key).length
        + this.waitTaskQueue.filter(task => task.key === task_key).length
    }

    constructor(key: string, options?: any) {

        let _options = Object.assign({}, SpaceLock.defaultOptions, options);

        this.spaceSize = _options.spaceSize;
        this.timeout = _options.timeout;

        this.key = key;
        this.waitTaskQueue = [];
        this.insideTaskQueue = [];

        this.emitter.setMaxListeners(Number.MAX_SAFE_INTEGER);
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
            .then(() => {
              task.status = 'leave'
              this.checkOut(task_key)
            })
            .then(() => result)
            .catch((err) => {
                task.status = 'thrown'
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
            .then(() => {
              task.status = 'leave'
              this.checkOut()
            })
            .then(() => result)
            .catch((err) => {
                // console.log('doOnce_untilOneDone error:', err);
                task.status = 'thrown'
                this.checkOut();
                return Promise.reject(err);
            });
    }

  /**
   * 要求得到一个从空间内签出的任务
   * <br> 该签出的任务状态可能是 leave 或 thrown
   * @param func 如果空间内不存在任务，签入执行 func
   * @param task_key 如不为 undef，要求得到具有相同的 task_key 的任务签出
   */
  public needOneCheckout(func: any, task_key?: any) : Promise<Task>{
      return new Promise(resolved  => {

        let that = this

        function wrap(task: Task) {
          if (task_key === undefined || task.key === task_key) {
            that.emitter.removeListener('checkout', wrap);
            resolved(task)
          }
        }

        this.emitter.on('checkout', wrap)

        if (!this.hasExistTaskSpeciallyTaskKey(task_key)) {
          this.doOnce(func, undefined, task_key).catch(() => null)
        }
      })
    }
}
