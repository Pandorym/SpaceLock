import { Lock } from './Lock';

export class Locks {
    public locked: Array<Lock> = [];

    public gateWidth: number;

    constructor(gateWidth: number = null) {
        this.gateWidth = gateWidth;
    }

    public lock(key: string, gateWidth: number = this.gateWidth): Lock {
        let _lock = this.locked.find((x) => x.key === key);
        if (_lock === undefined) {
            _lock = new Lock(key, gateWidth);
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

    public wait(key: string): Promise<void> {
        let lock = this.locked.find((x) => x.key === key);

        if (lock === undefined) {
            lock = new Lock(key, this.gateWidth);
            this.locked.push(lock);
        }

        return lock.wait();
    }

    public waitAndLock(key: string): Promise<Lock> {
        return this
            .wait(key)
            .then(() => this.lock(key));
    }

    public waitAndLockOnce(key: string, function1: any): Promise<any> {
        let result: any;
        return this
            .waitAndLock(key)
            .then(async () => {
                result = await function1();
            })
            .then(() => this.unlock(key))
            .then(() => result);
    }
}
