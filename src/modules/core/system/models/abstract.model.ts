import {logService} from 'wlc-engine/modules/app/app.module';

import _keys from 'lodash-es/keys';
export abstract class AbstractModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    constructor() {
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
            logService.sendLog({code: '7.0.0'});
        }
    }

    protected checkData(): void {
        const keys = _keys(this.objectData).length;

        if (!keys) {
            logService.sendLog({code: '7.0.1'});
        } else if (keys === 1 && this.objectData['data']) {
            logService.sendLog({code: '7.0.2'});
        }
    };
}
