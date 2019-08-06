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
        this.locked.find((x) => x.key === key).unlock();
    }

    public wait(key: string): Promise<void> {
        return this.locked.find((x) => x.key === key).wait();
    }
}
