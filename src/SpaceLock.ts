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

    public get hasTask() {
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
        for (; !this.isFull && this.hasTask;) {
            this.TaskQueue.shift().go();
        }
    }

    public checkOut() {
        this.currentNumber--;
        this.update();
    }

    public checkIn(): Promise<void> {
        let task: any = {
            go : null,
            token : null,
        };

        task.token = new Promise((resolve) => {
            task.go = () => {
                this.currentNumber++;
                resolve();
            };
        });
        this.TaskQueue.push(task);

        this.update();

        return task.token;
    }

    public doOnce(func: any): Promise<any> {
        let result: any;
        return this
            .checkIn()
            .then(async () => {
                result = await func();
            })
            .then(() => this.checkOut())
            .then(() => result);
    }
}
