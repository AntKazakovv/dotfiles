import {GlobalDeps} from 'wlc-engine/modules/app/app.module';
import {
    IFromLog,
    ILogObj,
} from 'wlc-engine/modules/core/system/services/log/log.service';

import _keys from 'lodash-es/keys';
import _merge from 'lodash-es/merge';
import _assign from 'lodash-es/assign';

export interface IAbstractModelParams {
    from: IFromLog;
}
export abstract class AbstractModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    constructor(private $params: IAbstractModelParams) {
    }

    public get data(): T | null {
        if (this.dataReady) {
            return this.objectData;
        } else {
            return null;
        }
    }

    public set data(data: T) {
        if (data) {
            this.objectData = _assign(this.objectData, data);
            this.checkData();
            this.dataReady = true;
        } else {
            this.dataReady = false;
            this.sendLog({code: '7.0.0'});
        }
    }

    protected checkData(): void {
        const keys = _keys(this.objectData).length;

        if (!keys) {
            this.sendLog({code: '7.0.1'});
        } else if (keys === 1 && this.objectData['data' as keyof T]) {
            this.sendLog({code: '7.0.2'});
        }
    };

    protected sendLog(logObj: ILogObj): void {
        GlobalDeps.logService.sendLog(_merge({}, logObj, {from: this.$params?.from}));
    }
}
