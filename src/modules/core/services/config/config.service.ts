import {Injectable} from '@angular/core';
import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import {layouts} from 'wlc-engine/config/layout.config';
import {get} from 'lodash';

@Injectable()
export class ConfigService {

    public ready: Promise<void> = new Promise((resolve) => {
        this.$resolve = resolve;
    });

    private $data: AppConfigModel;
    private $resolve: any;

    constructor(
        private data: DataService
    ) {
    }

    public async load(): Promise<any> {
        return this.data.request({
            name: 'botostrap',
            system: 'config',
            url: '/api/v1/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            mapFunc: (res) => this.prepareData(res),
        }).toPromise();
    }

    public get(key: string) {
        return get(this.$data, key);
    }

    protected prepareData(response: IData): AppConfigModel {
        this.$data = new AppConfigModel(response);
        this.addSiteConfig();
        this.$resolve();
        return this.$data;
    }

    protected addSiteConfig(): void {
        this.$data.siteconfig.layouts = layouts;
    }
}
