import { Lock } from './Lock';

export class Locks {
    public locked: Array<Lock> = [];

    constructor() {
    }

    public lock(key: string): Lock {
        let _lock = new Lock(key);
        _lock.lock();
        this.locked.push(_lock);

        return _lock;
    }

    public unlock(key: string) {
        this.locked.splice(
            this.locked.findIndex((x) => x.key === key),
            1,
        )[0].unlock();
    }

    public wait(key: string): Promise<void> {
        let lock = this.locked.find((x) => x.key === key);

        return lock !== undefined
            ? lock.wait()
            : Promise.resolve();
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
