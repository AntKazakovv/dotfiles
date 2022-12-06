import {TranslateService} from '@ngx-translate/core';
import {
    Inject,
    Injectable,
    Injector,
} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
    LocalStorageService,
    SessionStorageService,
} from 'ngx-webstorage';

import {
    BehaviorSubject,
    firstValueFrom,
} from 'rxjs';
import {
    distinctUntilChanged,
    map,
    first,
} from 'rxjs/operators';

import _mergeWith from 'lodash-es/mergeWith';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _isObject from 'lodash-es/isObject';
import _cloneDeep from 'lodash-es/cloneDeep';
import _find from 'lodash-es/find';
import _includes from 'lodash-es/includes';

import {
    DataService,
    IData,
} from '../data/data.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {SelectValuesService} from 'wlc-engine/modules/core/system/services/select-values/select-values.service';
import {
    DeviceModel,
    IDeviceConfig,
} from 'wlc-engine/modules/core/system/models/device.model';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {AppConfigModel} from './app-config.model';
import * as appConfig from 'wlc-config/index';
import * as wlcConfig from 'wlc-engine/modules/core/system/config/default.config';
import {
    $layouts,
    $layoutsAff,
    $layoutsKiosk,
    $layoutsMobileApp,
    $panelsLayouts,
    $panelsLayoutsKiosk,
    $panelsLayoutsMobileApp,
    $profileLayouts,
    $profileFirstLayouts,
    $profileKioskLayouts,
    $profileMobileAppLayouts,
} from 'wlc-engine/modules/core/system/config/layouts';
import {
    IParamsLayoutConfig,
    ILayoutsConfig,
    IBootstrap,
    TBooleanOptional,
} from 'wlc-engine/modules/core/system/interfaces';
import {
    ICountry,
    TStates,
    IState,
} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {
    IGlobalConfig,
    IGetParams,
    ISetParams,
} from './config.interface';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {TFixedPanelState} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';
import * as sectionsLib from 'wlc-engine/modules/core/system/config/layouts/sections';

export * from './app-config.model';
export * from './config.interface';

export enum storageType {
    'localStorage' = 'localStorageService',
    'sessionStorage' = 'sessionStorageService'
}

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

    private $resolve: () => void;
    private global: Partial<IGlobalConfig> = {};

    constructor(
        private injector: Injector,
        private translateService: TranslateService,
        // Be patient, take a breath, take a look at code again, do everything you can
        // to not delete next two lines. You will be thanked.
        private localStorageService: LocalStorageService,
        private sessionStorageService: SessionStorageService,
        private eventService: EventService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.setGlobals();

        this.translateService.onLangChange
            .subscribe(() => {
                this.getCountries();
                this.getStates();
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
            retries: {
                count: [1000, 3000],
                fallbackUrl: '/static/dist/api/v1/bootstrap.json',
            },
            onError: (data: HttpErrorResponse) => {
                if (data.status === 403) {
                    this.showMobileAppForbiddenPage();
                }
            },
        })
            .then((data: IData) => {

                const availableOnlyCountries: string[] = GlobalHelper.mobileAppConfig?.availableOnlyCountries;

                if (availableOnlyCountries && !_includes(availableOnlyCountries, data.data.country)) {
                    this.showMobileAppForbiddenPage();
                }

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

    /**
     * Setter, accepts as arg setParams
     *
     * @param {ISetParams<T>} set params
     */
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

    /**
     * Gets global config
     *
     * @return {Partial<IGlobalConfig>}
     */
    public get globalConfig(): Partial<IGlobalConfig> {
        return _cloneDeep(this.global);
    }

    private setGlobals(): void {
        this.set<BehaviorSubject<UserProfile>>({name: '$user.userProfile$', value: new BehaviorSubject(null)});
        this.set<BehaviorSubject<UserInfo>>({name: '$user.userInfo$', value: new BehaviorSubject(null)});
        this.set<boolean>({name: '$user.skipPasswordOnEditProfile', value: false});
    }

    private prepareData(data: IBootstrap): void {
        this.global.appConfig = new AppConfigModel({service: 'ConfigService'});
        this.global.appConfig.data = data;

        this.set<boolean>({name: '$user.isAuthenticated', value: this.global.appConfig.loggedIn});
        if (
            this.get<number>('appConfig.siteconfig.fastRegistration')
            && this.get<boolean>('appConfig.siteconfig.registerGeneratePassword')
            && this.get<TBooleanOptional>('appConfig.siteconfig.skipPassCheckOnFirstSession')
        ) {
            this.set<boolean>({name: '$user.skipPasswordOnEditProfile', value: true});
            this.set<Promise<boolean>>({
                name: '$user.skipPasswordOnFirstUserSession',
                value: firstValueFrom(
                    this.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                        .pipe(
                            first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                            map((userInfo: UserInfo): boolean => !!userInfo.firstSession),
                        ),
                )},
            );
        }
        this.addSiteConfig();

        this.set<BehaviorSubject<ICountry[]>>({
            name: 'countries',
            value: new BehaviorSubject([]),
        });

        this.set<BehaviorSubject<TStates>>({
            name: 'states',
            value: new BehaviorSubject({}),
        });

        this.set<BehaviorSubject<IState[]>>({
            name: 'countryStates',
            value: new BehaviorSubject([]),
        });

        this.set<DeviceModel>({
            name: 'device',
            value: new DeviceModel(this.get<IDeviceConfig>('$base.device'), this.window),
        });

        if (appConfig.$base.fixedPanel?.use) {
            this.initFixedPanel();
        }

        this.$resolve();
    }

    private initFixedPanel(): void {
        let panelState: TFixedPanelState;
        let userState: TFixedPanelState = this.get<TFixedPanelState>({
            name: 'fixedPanelUserState',
            storageType: 'localStorage',
        });

        if (this.get<boolean>('$base.fixedPanel.compactModByDefault') && !userState) {
            userState = 'compact';

            this.set<TFixedPanelState>({
                name: 'fixedPanelUserState',
                value: userState,
                storageType: 'localStorage',
            });
        }


        if (userState) {
            panelState = userState;
        } else {
            if (this.window.innerWidth < this.get<number>('$base.fixedPanel.breakpoints.expand')) {
                panelState = 'compact';
            } else {
                panelState = 'expanded';
            }
        }

        this.set<BehaviorSubject<TFixedPanelState>>({
            name: 'fixedPanelState$',
            value: new BehaviorSubject(panelState),
        });
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
            profile: GlobalHelper.mergeConfig(wlcConfig.$base.profile, appConfig.$base.profile),
        });

        if (appConfig.$base.profile?.store?.singleLevels) {
            appConfig.$base.profile.store.use = false;
        }

        if (!_find(this.global.appConfig.siteconfig.currencies, {Alias: appConfig.$base.defaultCurrency})) {
            appConfig.$base.defaultCurrency = this.global.appConfig.siteconfig.currencies[0]?.Alias || 'EUR';
        }

        appConfig.$base.site.restrictRegistration = !!(appConfig.$base.site.restrictRegistration
            ?? this.global.appConfig.siteconfig.RestrictRegistration
            ?? false);

        _mergeWith(this.global, wlcConfig, layoutConfig, (target, source) => (source?.replaceConfig)
            ? _cloneDeep(source)
            : undefined);
        _mergeWith(this.global, appConfig, (target, source) => (source?.replaceConfig) ? _cloneDeep(source)
            : undefined);

        GlobalHelper.deepFreeze(this.global.appConfig);
    }

    private addLayoutConfig(params: IParamsLayoutConfig): ILayoutsConfig {
        const mergedLayouts: ILayoutsConfig =
            params.profile.type === 'first'
                ? _mergeWith($layouts, $profileFirstLayouts)
                : _mergeWith($layouts, $profileLayouts);

        const mergedLayoutsKiosk: ILayoutsConfig = _mergeWith($layoutsKiosk, $profileKioskLayouts);

        if (params.profile.store.singleLevels && $layouts['app.profile.loyalty-level']?.sections?.['profile-content']) {
            $layouts['app.profile.loyalty-level'].sections['profile-content'] = params.profile.type === 'default' ?
                sectionsLib.profileContent.profileLoyaltyLevelsSingle :
                sectionsLib.profileContent.profileLoyaltyLevelsTypeFirstSingle;
        }

        this.attachFundistUserIdComponent();

        if (!wlcConfig.$base.profile.store.use) {
            $layouts['app.profile.dashboard'].sections['profile-content'] =
                sectionsLib.profileContent.profileDashboardWithoutStore;
        }

        switch (params.appType) {
            case 'aff':
                if (!appConfig.$base.affiliate?.useTestimonials) {
                    $layoutsAff['app.home'].sections['testimonials-section'] = null;
                }

                return {
                    $layouts: $layoutsAff,
                    $panelsLayouts,
                };
            case 'kiosk':
                return {
                    $layouts: mergedLayoutsKiosk,
                    $panelsLayouts: $panelsLayoutsKiosk,
                };
            case 'mobile-app':
                return {
                    $layouts: _mergeWith($layoutsMobileApp, $profileMobileAppLayouts),
                    $panelsLayouts: $panelsLayoutsMobileApp,
                };
            default:
                return {
                    $layouts: mergedLayouts,
                    $panelsLayouts,
                };
        }
    }

    private attachFundistUserIdComponent(): void {
        const {profile} = appConfig.$base;

        if (profile?.fundistUserId?.use) {
            const section = profile?.type === 'first'
                ? sectionsLib.profileContent.profileFirstWithFundistUserId
                : sectionsLib.profileContent.profileMainWithFundistUserId;

            $layouts['app.profile.main.info'].sections['profile-content'] = section;
        }
    }

    private async getCountries(): Promise<void> {
        this.injector.get<DataService>(DataService).request({
            name: 'countries',
            url: '/countries',
            cache: 120 * 60 * 1000,
            system: 'user',
            type: 'GET',
            retries: {
                count: [1000, 3000],
                fallbackUrl: '/static/dist/api/v1/countries.json',
            },
        }).then(async (data: IData) => {
            await this.ready;

            const selectValuesService: SelectValuesService = this.injector.get(SelectValuesService);
            this.get<BehaviorSubject<ICountry[]>>('countries').next(
                selectValuesService.prepareCountries(data.data.countries),
            );
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

    private async getStates(): Promise<void> {
        this.injector.get<DataService>(DataService).request({
            name: 'states',
            url: '/states',
            cache: 120 * 60 * 1000,
            system: 'user',
            type: 'GET',
        }).then(async (data: IData) => {
            await this.ready;
            this.get<BehaviorSubject<TStates>>('states').next(data.data.states);

            this.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
                .pipe(distinctUntilChanged())
                .subscribe((userProfile: UserProfile) => {
                    if (userProfile?.countryCode) {
                        this.get<BehaviorSubject<IState[]>>('countryStates')
                            .next(data.data.states[userProfile.countryCode]);
                    }
                });

        }).catch(() => {
            this.injector.get(LogService).sendLog({
                code: '0.0.62',
                from: {
                    service: 'ConfigService',
                    method: 'getStates',
                },
            });
        });
    }

    private showMobileAppForbiddenPage(): void {
        // @ts-ignore
        document.querySelector('#app').style.display = 'none';
        // @ts-ignore
        document.querySelector('#app-forbidden').style.display = 'block';
    }
}
