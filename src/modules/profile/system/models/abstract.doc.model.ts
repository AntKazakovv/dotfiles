import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {LoaderStatus} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

export abstract class AbstractDocModel<T> extends AbstractModel<T> {
    private _loadingStatus: LoaderStatus = LoaderStatus.Ready;

    constructor(from: IFromLog, data: T) {
        super({from});
        this.data = data;
    }

    /**
     * Set loading status
     *
     * @param status{LoaderStatus}
     */
    public switchLoader(status: LoaderStatus): void {
        this._loadingStatus = status;
    }

    /**
     * Get loading status
     *
     * @return {LoaderStatus}
     */
    public get loadingStatus(): LoaderStatus {
        return this._loadingStatus;
    }

    /**
     * Is ready?
     *
     * @return {boolean}
     */
    public get pending(): boolean {
        return this.loadingStatus !== LoaderStatus.Ready;
    }
}
