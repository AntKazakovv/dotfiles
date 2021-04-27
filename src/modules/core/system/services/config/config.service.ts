import {Injectable, Injector} from '@angular/core';

import {DataService, IData} from '../data/data.service';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as wlcConfig from 'wlc-engine/modules/core/system/config/default.config';
import {
    $layoutsAff,
    $panelsLayouts,
    $profileLayouts,
    $profileFirstLayouts,
    $layouts,
} from 'wlc-engine/modules/core/system/config/layouts';
import {ILayoutsConfig, IParamsLayoutConfig} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    LocalStorageService,
    SessionStorageService,
} from 'ngx-webstorage';
import {
    BehaviorSubject,
} from 'rxjs';
import {
    IGlobalConfig,
    IGetParams,
    ISetParams,
} from './config.interface';
import {DeviceModel, IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

export * from './app-config.model';
export * from './config.interface';

export enum storageType {
    'localStorage' = 'localStorageService',
    'sessionStorage' = 'sessionStorageService'
}

import _mergeWith from 'lodash-es/mergeWith';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _isObject from 'lodash-es/isObject';
import _cloneDeep from 'lodash-es/cloneDeep';

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
        private injector: Injector,
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
        this.setGlobals();

        setTimeout(() => {
            this.getCountries();
        }, 0);
    }

    /**
     * Load main appConfig on start app in AppModule;
     */
    public load(): Promise<IData> {
        return this.injector.get<DataService>(DataService).request({
            name: 'bootstrap',
            system: 'config',
            url: '/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            noUseLang: true,
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
                return _get(this, storageType[getParams.storageType]).retrieve(getParams.name);
            } else {
                return _get(this.global, getParams.name);
            }
        }

        return _get(this.global, getParams as string);
    }

    public set<T>(setParams: ISetParams<T>): void {
        if (setParams.storageType || setParams.storageClear) {
            if (storageType[setParams.storageClear]) {
                _get(this, storageType[setParams.storageClear]).clear(setParams.name);
            } else if (storageType[setParams.storageType]) {
                _get(this, storageType[setParams.storageType]).store(setParams.name, setParams.value);
            }
            return;
        }

        if (!setParams.merge) {
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

    public get globalConfig(): Partial<IGlobalConfig> {
        return _cloneDeep(this.global);
    }

    private setGlobals(): void {
        this.set<BehaviorSubject<UserProfile>>({name: '$user.userProfile$', value: new BehaviorSubject(null)});
    }

    private prepareData(response: unknown): AppConfigModel {
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

    private addSiteConfig(): void {
        wlcConfig.$base.app.type = appConfig.$base.app.type || 'wlc';
        wlcConfig.$base.profile.type = appConfig.$base.profile?.type || 'default';

        const layoutConfig = this.addLayoutConfig({
            appType: wlcConfig.$base.app.type,
            profileType: wlcConfig.$base.profile.type,
        });
        _mergeWith(this.global, wlcConfig, layoutConfig, (target, source) => (source?.replaceConfig) ? _cloneDeep(source) : undefined);
        _mergeWith(this.global, appConfig, (target, source) => (source?.replaceConfig) ? _cloneDeep(source) : undefined);
        GlobalHelper.deepFreeze(this.global.appConfig);
    }

    private addLayoutConfig(params: IParamsLayoutConfig): ILayoutsConfig {
        const mergedLayouts: ILayoutsConfig =
            params.profileType === 'first'
                ? _mergeWith($layouts, $profileFirstLayouts)
                : _mergeWith($layouts, $profileLayouts);

        switch (params.appType) {
            case 'aff':
                return {
                    $layouts: $layoutsAff,
                };
            default:
                return {
                    $layouts: mergedLayouts,
                    $panelsLayouts,
                };
        }
    }

    private async getCountries(): Promise<void> {
        this.injector.get<DataService>(DataService).request({
            name: 'countries',
            url: '/countries',
            cache: 120 * 60 * 1000,
            system: 'user',
            type: 'GET',
        }).then(async (data: IData) => {
            await this.ready;
            this.get<BehaviorSubject<any>>('countries').next(data.data.countries);
        });
    }
}
