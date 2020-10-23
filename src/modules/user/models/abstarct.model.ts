export class AbstractUserModel<T> {

    public dataReady: boolean = false;

    protected data: T;

    public setData(data: T = null): void {
        if (data) {
            this.dataReady = true;
        } else {
            this.dataReady = false;
        }
        this.data = data;
    }
}
