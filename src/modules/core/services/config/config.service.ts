import {Injectable} from '@angular/core';
import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as wlcConfig from 'wlc-engine/config/default.config';
import {GlobalHelper} from 'wlc-engine/helpers/global.helper';

export * from './app-config.model';

import {
    mergeWith as _mergeWith,
} from 'lodash';

@Injectable()
export class ConfigService {
    static instance: ConfigService;

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    public appConfig: AppConfigModel;
    private $resolve: () => void;

    constructor(
        private data: DataService,
    ) {
        ConfigService.instance = this;
    }

    public load(): Promise<IData> {
        return this.data.request({
            name: 'bootstrap',
            system: 'config',
            url: '/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            mapFunc: (res) => this.prepareData(res),
        });
    }

    protected prepareData(response: IData): AppConfigModel {
        this.appConfig = new AppConfigModel(response);
        this.addSiteConfig();
        this.$resolve();
        return this.appConfig;
    }

    protected addSiteConfig(): void {
        _mergeWith(this.appConfig, wlcConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        _mergeWith(this.appConfig, appConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        GlobalHelper.deepFreeze(this.appConfig);
    }
}
