import {Injectable} from '@angular/core';
import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as engConfig from 'wlc-engine/config/default.config';

import {
    merge as _merge,
    assign as _assign
} from 'lodash';

@Injectable()
export class ConfigService {

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    public appConfig: AppConfigModel;
    private $resolve: () => void;

    constructor(
        private data: DataService
    ) {
    }

    public load(): Promise<IData> {
        return this.data.request({
            name: 'botostrap',
            system: 'config',
            url: '/api/v1/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            mapFunc: (res) => this.prepareData(res),
        }).toPromise();
    }

    protected prepareData(response: IData): AppConfigModel {
        this.appConfig = new AppConfigModel(response);
        this.addSiteConfig();
        this.$resolve();
        return this.appConfig;
    }

    protected addSiteConfig(): void {
        _merge(this.appConfig, engConfig, appConfig);
    }
}
