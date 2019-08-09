import { SpaceLock } from './SpaceLock';

export class Ymir {
    public locked: Array<SpaceLock> = [];

    public static defaultOptions = {
        spaceSize : 1,
    };

    public options: any;

    constructor(options?: any) {
        this.options = Object.assign({}, Ymir.defaultOptions, options);
    }

    public lock(key: string, options: any = this.options): SpaceLock {
        let _lock = this.locked.find((x) => x.key === key);

        if (_lock === undefined) {
            _lock = new SpaceLock(key, options);
            this.locked.push(_lock);
        }

        _lock.lock();
        return _lock;
    }

    public unlock(key: string) {

        let lockIndex = this.locked.findIndex((x) => x.key === key);

        if (lockIndex === -1) return;

        let lock = this.locked[lockIndex];

        lock.unlock();
    }

    public get(key: string) {
        return this.locked.find((x) => x.key === key);
    }

    public isLocked(key: string) {
        let lock = this.get(key);
        return lock !== undefined && lock.isLocked;
    }

    public wait(key: string): Promise<void> {
        let lock = this.locked.find((x) => x.key === key);

        if (lock === undefined) {
            lock = new SpaceLock(key, this.options);
            this.locked.push(lock);
        }

        return lock.wait();
    }

    public waitAndLockOnce(key: string, function1: any): Promise<any> {
        let result: any;
        return this
            .wait(key)
            .then(async () => {
                result = await function1();
            })
            .then(() => this.unlock(key))
            .then(() => result);
    }
}
