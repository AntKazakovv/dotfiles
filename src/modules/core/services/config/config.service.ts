import {Injectable} from '@angular/core';
import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as wlcConfig from 'wlc-engine/config/default.config';
import {GlobalHelper} from 'wlc-engine/helpers/global.helper';
import {
    CookiesStorageService,
    LocalStorageService,
    SessionStorageService,
} from 'ngx-store';
import {
    IGlobalConfig,
    IGetParams,
    ISetParams,
    IStorageType,
} from './config.interface';

export * from './app-config.model';
export * from './config.interface';

export enum storageType {
    'localStorage' = 'localStorageService',
    'sessionStorage' = 'sessionStorageService',
    'cookiesStorage' = 'cookiesStorageService',
}

import {
    mergeWith as _mergeWith,
    cloneDeep as _cloneDeep,
    get as _get,
    set as _set,
    forEach as _forEach,
    find as _find,
    isObject as _isObject,
    includes as _includes,
} from 'lodash';

/**
 * Examples of getter and setter:
 * SET: this.config.set({name: 'url', value: 'google.com'});
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
        private cookiesStorageService: CookiesStorageService,
    ) {
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
        });
    }

    /**
     * Getter with generic type, accepts as arg getParams object or string with path of global config.
     */
    public get<T>(getParams: string | IGetParams): T {

        if (_isObject(getParams)) {
            if (getParams.storageType) {
                return _get(this, storageType[getParams.storageType]).get(getParams.name);
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

    protected prepareData(response: IData): AppConfigModel {
        this.global.appConfig = new AppConfigModel(response);
        this.set<boolean>({name: '$user.isAuthenticated', value: this.global.appConfig.loggedIn === '1'});
        this.addSiteConfig();
        this.$resolve();
        return this.appConfig;
    }

    protected addSiteConfig(): void {
        _mergeWith(this.global, wlcConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        _mergeWith(this.global, appConfig, (target, source) => (source.replaceConfig) ? source : undefined);
        GlobalHelper.deepFreeze(this.global.appConfig);
    }
}
