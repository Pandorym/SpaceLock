import { SpaceLock } from './SpaceLock';
import {Task} from "./Task";

export class Ymir {
    public spaceLocks: Array<SpaceLock> = [];

    public static defaultOptions: { spaceSize: number, timeout: number } = {
        spaceSize : 1,
        timeout : null,
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

    public doOnce(key: string, func: any, timeout: number = this.options.timeout, task_key? :string) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce(func, timeout, task_key);
    }

    public doOnce_untilOneDone(key: string, func: any, timeout: number = this.options.timeout, tryTimesLimit: number = null) {
        let spaceLock = this.getSpaceLock(key);
        return spaceLock.doOnce_untilOneDone(func, timeout, tryTimesLimit);
    }

  public needOneCheckout(key: string, func: any) : Promise<Task>{
    let spaceLock = this.getSpaceLock(key);
    return spaceLock.needOneCheckout(func);
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
