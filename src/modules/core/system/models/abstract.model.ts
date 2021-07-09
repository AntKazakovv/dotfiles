import {LogService} from 'wlc-engine/modules/core';
import {appInjector} from 'wlc-engine/modules/app/app.module';

export abstract class AbstractModel<T> {

    public dataReady: boolean = false;

    protected objectData: T;

    private logService: LogService;

    constructor() {
        this.logService = appInjector.get(LogService);
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
            this.logService.sendLog({code: '7.0.0'});
        }
    }

    protected checkData(): void {
        const keys = Object.keys(this.objectData).length;

        if (!keys) {
            this.logService.sendLog({code: '7.0.1'});
        } else if (keys === 1 && this.objectData['data']) {
            this.logService.sendLog({code: '7.0.2'});
        }
    };
}
