export abstract class AbstractUserModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    public set data(data: T) {
        if (data) {
            this.dataReady = true;
        } else {
            this.dataReady = false;
        }
        this.objectData = data;
        this.checkData();
    }

    protected checkData(): void {};
}
