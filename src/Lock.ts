export class Lock {
    public key: string;
    private _: Promise<void>;

    public isLocked: boolean;

    public gateWidth: number;

    public currentNumber: number;
    public waitList: Array<{
        go: any,
        token: Promise<void>
    }>;

    constructor(key: string, gateWidth: number = null) {
        this.key = key;
        this.gateWidth = gateWidth;
        this.waitList = [];
        this.isLocked = false;
        this.currentNumber = 0;
    }

    public lock() {
        this.isLocked = true;
    }

    public unlock() {
        for (let num = 0; num < this.gateWidth; num++) {
            if (this.waitList.length > 0) this.waitList.shift().go();
        }
        if (this.waitList.length === 0)
            this.isLocked = false;
    }

    public wait(): Promise<void> {

        if (!this.isLocked) {
            this.isLocked = true;
            return Promise.resolve();
        }

        let wait: any = {
            go : null,
            token : null,
        };

        wait.token = new Promise((resolve) => {
            wait.go = resolve;
        });
        this.waitList.push(wait);

        return wait.token;
    }
}
