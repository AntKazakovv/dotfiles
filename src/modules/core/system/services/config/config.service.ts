import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {TranslateService} from '@ngx-translate/core';
import {
    Injectable,
    Injector,
} from '@angular/core';
import {
    LocalStorageService,
    SessionStorageService,
} from 'ngx-webstorage';
import {
    BehaviorSubject,
} from 'rxjs';

import {
    DataService,
    IData,
} from '../data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {
    DeviceModel,
    IDeviceConfig,
} from 'wlc-engine/modules/core/system/models/device.model';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
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
import {
    IParamsLayoutConfig,
    ILayoutsConfig,
    IBootstrap,
} from 'wlc-engine/modules/core/system/interfaces';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {CookieHelper} from 'wlc-engine/modules/core/system/helpers/cookie.helper';
import {
    IGlobalConfig,
    IGetParams,
    ISetParams,
} from './config.interface';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';

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

    private $resolve: () => void;
    private global: Partial<IGlobalConfig> = {};

    constructor(
        private injector: Injector,
        private translateService: TranslateService,
        // Be patient, take a breath, take a look at code again, do everything you can
        // to not delete next two lines. You will be thanked.
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
    ) {
        this.setGlobals();
        this.pcEmulation();

        this.translateService.onLangChange
            .subscribe(() => {
                this.getCountries();
            });
    }

    /**
     * Load main appConfig on start app in AppModule;
     */
    public load(): Promise<IData> | Promise<unknown> {
        return this.injector.get<DataService>(DataService).request({
            name: 'bootstrap',
            system: 'config',
            url: '/bootstrap',
            type: 'GET',
            preload: 'bootstrap',
            noUseLang: true,
            events: {
                fail: 'LOAD_BOOTSTRAP_FAIL',
            },
        })
            .then((data: IData) => {
                this.prepareData(data.data);
                this.injector.get(EventService).emit({name: 'LOAD_BOOTSTRAP_SUCCESS'});
            })
            .catch(() => {
                this.injector.get<LogService>(LogService).sendLog({
                    code: '0.0.6',
                    from: {
                        service: 'ConfigService',
                        method: 'load',
                    },
                });
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
        this.set<BehaviorSubject<UserInfo>>({name: '$user.userInfo$', value: new BehaviorSubject(null)});
    }

    private prepareData(data: IBootstrap): void {
        this.global.appConfig = new AppConfigModel({service: 'ConfigService'});
        this.global.appConfig.data = data;

        this.set<boolean>({name: '$user.isAuthenticated', value: this.global.appConfig.loggedIn});
        this.addSiteConfig();

        this.set<any>({
            name: 'countries',
            value: new BehaviorSubject([]),
        });

        this.set<DeviceModel>({
            name: 'device',
            value: new DeviceModel(this.get<IDeviceConfig>('$base.device')),
        });

        this.$resolve();
    }

    private addSiteConfig(): void {
        wlcConfig.$base.app.type = appConfig.$base.app.type || 'wlc';
        wlcConfig.$base.profile.type = appConfig.$base.profile?.type || 'default';

        if (appConfig.$base.app.type === 'aff') {
            appConfig.$base.affiliate.affiliateUrl += appConfig.$base.affiliate.affiliateUrl.endsWith('/') ? '' : '/';
            appConfig.$base.affiliate.siteUrl += appConfig.$base.affiliate.siteUrl.endsWith('/') ? '' : '/';
        }

        const layoutConfig = this.addLayoutConfig({
            appType: wlcConfig.$base.app.type,
            profileType: wlcConfig.$base.profile.type,
        });

        appConfig.$base.site.restrictRegistration = !!(appConfig.$base.site.restrictRegistration
            ?? this.global.appConfig.siteconfig.RestrictRegistration
            ?? false);

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
                    $panelsLayouts,
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
        }).catch(() => {
            this.injector.get(LogService).sendLog({
                code: '0.0.61',
                from: {
                    service: 'ConfigService',
                    method: 'getCountries',
                },
            });
        });
    }

    private pcEmulation(): void {
        if (GlobalHelper.usedPcEmulation()) {
            CookieHelper.set('PC_EMULATION', '1', 360);
        } else {
            CookieHelper.delete('PC_EMULATION');
        }
    }
}
