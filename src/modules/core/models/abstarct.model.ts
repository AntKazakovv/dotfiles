export abstract class AbstractModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    public get data(): T {
        if (this.dataReady) {
            return this.objectData;
        } else {
            return null;
        }
    }

    public set data(data: T) {
        if (data) {
            this.dataReady = true;
        } else {
            this.dataReady = false;
        }
        this.objectData = data;
        this.checkData();
    }

    protected checkData(): void {
    };
}


