import { SpaceLock } from './SpaceLock';

export class Ymir {
    public spaceLocks: Array<SpaceLock> = [];

    public static defaultOptions = {
        spaceSize : 1,
    };

    public options: any;

    constructor(options?: any) {
        this.options = Object.assign({}, Ymir.defaultOptions, options);
    }

    public getSpaceLock(key: string, spaceLockOptions: any = this.options): SpaceLock {
        let spaceLock = this.spaceLocks.find((x) => x.key === key);

        if (spaceLock === undefined) {
            spaceLock = new SpaceLock(key, spaceLockOptions);
            this.spaceLocks.push(spaceLock);
        }

        return spaceLock;
    }

    public checkIn(key: string) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.checkIn();
    }

    public checkOut(key: string) {
        let spaceLock = this.getSpaceLock(key);

        spaceLock.checkOut();
    }

    public doOnce(key: string, func: any) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce(func);
    }

    public isLocked(key: string) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.isLocked;
    }

    public isFull(key: string) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.isFull;
    }
}
