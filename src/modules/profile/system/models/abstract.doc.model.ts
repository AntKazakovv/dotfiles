import {LoaderStatus} from 'wlc-engine/modules/profile';

export abstract class AbstractDocModel {
    private _loadingStatus: LoaderStatus = LoaderStatus.Ready;

    public switchLoader(status: LoaderStatus): void {
        this._loadingStatus = status;
    }

    public get loadingStatus(): LoaderStatus {
        return this._loadingStatus;
    }

    public get pending(): boolean {
        return this.loadingStatus !== LoaderStatus.Ready;
    }
}
