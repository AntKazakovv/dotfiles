import {Injectable} from '@angular/core';

import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as wlcConfig from 'wlc-engine/modules/core/system/config/default.config';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    LocalStorageService,
    SessionStorageService,
} from 'ngx-webstorage';
import {
    BehaviorSubject,
    fromEvent,
    Observable,
} from 'rxjs';
import {
    IGlobalConfig,
    IGetParams,
    ISetParams,
} from './config.interface';
import {DeviceModel, IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';

export * from './app-config.model';
export * from './config.interface';

export enum storageType {
    'localStorage' = 'localStorageService',
    'sessionStorage' = 'sessionStorageService'
}

import {
    mergeWith as _mergeWith,
    get as _get,
    set as _set,
    isObject as _isObject,
} from 'lodash';

/**
 * Examples of getter and setter:
 * SET: this.config.set({name: 'url', value: 'google.com'}

);
 * GET: this.config.get<boolean>('appConfig.mobile');
 */

@Injectable()
export class ConfigService {

    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });

    private appConfig: AppConfigModel;
    private $resolve: () => void;
    private global: Partial<IGlobalConfig> = {};

    constructor(
        private data: DataService,
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
        this.getCountries();
    }

    /**
     * Load main appConfig on start app in AppModule;
     */
    public load(): Promise<IData> {
        return this.data.request({
            name: 'bootstrap',
            system: 'config',
            url: '/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            mapFunc: (res) => this.prepareData(res),
            events: {
                success: 'LOAD_BOOTSTRAP_SUCCESS',
                fail: 'LOAD_BOOTSTRAP_FAIL',
            },
        });
    }

    /**
     * Getter with generic type, accepts as arg getParams object or string with path of global config.
     */
    public get<T>(getParams: string | IGetParams): T {

        if (_isObject(getParams)) {
            if (getParams.storageType) {
                return _get(this, storageType[getParams.storageType])?.strategy.get(getParams.name);
            } else {
                return _get(this.global, getParams.name);
            }
        }

        return _get(this.global, getParams as string);
    }

    public set<T>(setParams: ISetParams<T>): void {
        if (setParams.storageType || setParams.storageClear) {
            if (storageType[setParams.storageClear]) {
                _get(this, storageType[setParams.storageClear]).remove(setParams.name);
            } else if (storageType[setParams.storageType]) {
                _get(this, storageType[setParams.storageType]).set(setParams.name, setParams.value);
            }
            return;
        }

        if (setParams.replace) {
            _set(this.global, setParams.name, setParams.value);
        } else {
            _get(this.global, setParams.name) ?
                _mergeWith(_get(this.global, setParams.name), setParams.value) :
                _set(this.global, setParams.name, setParams.value);
        }

        if (setParams.freeze) {
            Object.freeze(_get(this.global, setParams.name));
        }
    }

    protected prepareData(response: unknown): AppConfigModel {
        this.global.appConfig = new AppConfigModel(response);
        this.set<boolean>({name: '$user.isAuthenticated', value: this.global.appConfig.loggedIn === '1'});
        this.addSiteConfig();

        this.set<any>({
            name: 'countries',
            value: new BehaviorSubject({}),
        });

        this.set<DeviceModel>({
            name: 'device',
            value: new DeviceModel(this.get<IDeviceConfig>('$base.device')),
        });

        this.$resolve();
        return this.appConfig;
    }

    protected addSiteConfig(): void {
        _mergeWith(this.global, wlcConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        _mergeWith(this.global, appConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        GlobalHelper.deepFreeze(this.global.appConfig);
    }

    private async getCountries(): Promise<void> {
        this.data.request({
            name: 'countries',
            url: '/countries',
            system: 'user',
            type: 'GET',
        }).then(async (data: IData) => {
            await this.ready;
            this.get<BehaviorSubject<any>>('countries').next(data.data.countries);
        });
    }
}
