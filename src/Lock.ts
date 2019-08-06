export class Lock {
    public key: string;
    private _: Promise<void>;

    public unlock = (): void => {};

    constructor(key: string) {
        this.key = key;
    }

    public lock() {
        this._ = new Promise((resolve) => {
            this.unlock = resolve;
        });
    }

    public wait(): Promise<void> {
        return this._;
    }
}
