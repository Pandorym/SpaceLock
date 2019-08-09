export class SpaceLock {
    public key: string;
    private _: Promise<void>;

    public spaceSize: number;

    public currentNumber: number;
    public TaskQueue: Array<{
        go: any,
        token: Promise<void>
    }>;

    public static defaultOptions = {
        spaceSize : 1,
    };

    public get isFull() {
        return !(this.currentNumber < this.spaceSize);
    }

    public get isLocked() {
        return this.isFull;
    }

    public get hasWait() {
        return this.TaskQueue.length > 0;
    }

    constructor(key: string, options?: any) {

        let _options = Object.assign({}, SpaceLock.defaultOptions, options);

        this.spaceSize = _options.spaceSize;

        this.key = key;
        this.TaskQueue = [];
        this.currentNumber = 0;
    }

    public update() {
        for (; !this.isFull && this.hasWait; this.currentNumber++) {
            this.TaskQueue.shift().go();
        }
    }

    public lock() {
        this.currentNumber++;
    }

    public unlock() {
        this.currentNumber--;
        this.update();
    }

    public wait(): Promise<void> {
        let wait: any = {
            go : null,
            token : null,
        };

        wait.token = new Promise((resolve) => {
            wait.go = resolve;
        });
        this.TaskQueue.push(wait);

        this.update();

        return wait.token;
    }
}
