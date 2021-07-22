import {GlobalDeps} from 'wlc-engine/modules/app/app.module';

import _keys from 'lodash-es/keys';

export interface IAbstractModelParams {
    from: string;
}
export abstract class AbstractModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    constructor(private $params?: IAbstractModelParams) {
    }

    public get data(): T {
        if (this.dataReady) {
            return this.objectData;
        } else {
            return null;
        }
    }

    public set data(data: T) {
        if (data) {
            this.objectData = data;
            this.checkData();
            this.dataReady = true;
        } else {
            this.dataReady = false;
            GlobalDeps.logService.sendLog({code: '7.0.0', flog: {from: this.$params?.from}});
        }
    }

    protected checkData(): void {
        const keys = _keys(this.objectData).length;

        if (!keys) {
            GlobalDeps.logService.sendLog({code: '7.0.1', flog: {from: this.$params?.from}});
        } else if (keys === 1 && this.objectData['data']) {
            GlobalDeps.logService.sendLog({code: '7.0.2', flog: {from: this.$params?.from}});
        }
    };
}
