import {
    Inject,
    Injectable,
    NgZone,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import {
    StateService,
    UIRouter,
} from '@uirouter/core';

import {
    Subscription,
    BehaviorSubject,
    firstValueFrom,
    interval,
} from 'rxjs';
import {
    first,
    map,
    takeWhile,
    tap,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _set from 'lodash-es/set';
import _merge from 'lodash-es/merge';
import _isString from 'lodash-es/isString';
import _get from 'lodash-es/get';
import _isUndefined from 'lodash-es/isUndefined';
import _mergeWith from 'lodash-es/mergeWith';

import {
    DataService,
    IData,
    NotificationEvents,
    IPushMessageParams,
    ModalService,
    IIndexing,
    EventService,
    IEvent,
    ConfigService,
    LogService,
    IUserInfo,
    IUserProfile,
    IRedirect,
    InjectionService,
    IMGAConfig,
    IValidateData,
    WebsocketService,
    GlobalHelper,
    ILoyalty,
    ILoyaltyUpdate,
    FilesService,
} from 'wlc-engine/modules/core';
import {
    IProcessEventData,
    ProcessEvents,
    ProcessEventsDescriptions,
} from 'wlc-engine/modules/monitoring';
import {
    MetamaskService,
    TMetamaskData,
} from 'wlc-engine/modules/metamask';
import {
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {
    LicenseLimitationsService,
    LimitationService,
} from 'wlc-engine/modules/user/submodules/limitations';
import {IdleService} from 'wlc-engine/modules/user/system/services/idle/idle.service';
import {
    ILoginWithPhoneData,
    IUserPasswordPost,
    IEmailVerifyData,
    IWSDataUserBalance,
} from 'wlc-engine/modules/user/system/interfaces/user.interface';
import {IWSLoyalty} from 'wlc-engine/modules/loyalty/system/interfaces/interfaces';
import {WebSocketEvents} from 'wlc-engine/modules/core/system/services/websocket/websocket.service';
import {AchievementsService} from 'wlc-engine/modules/loyalty/submodules/achievements';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';
import {IWSConsumerData} from 'wlc-engine/modules/core/system/interfaces/websocket.interface';
import {TermsAcceptService} from 'wlc-engine/modules/user/system/services/terms/terms-accept.service';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';
import {LocalJackpotsService} from 'wlc-engine/modules/local-jackpots';

export enum LanguageChangeEvents {
    ChangeLanguage = 'CHANGE_LANGUAGE'
}

interface ILoginUniqResponse {
    result: boolean;
}

interface ICreateProfileQueryParams {
    smsLogin?: 1 | 0;
}

interface ILoginPasswordData {
    login: string;
    password: string;
}

interface IRegistrationCompleteData {
    code: string,
    useJwt?: boolean,
}

interface ISetNewPasswordData {
    password: string;
    newPassword: string
}

type TLoginData = TMetamaskData | ILoginPasswordData | ILoginWithPhoneData;

type ProfileParamsWithMetamask = IUserProfile & TMetamaskData & Pick<IUserProfile, 'type'>;

/**
 *
 */
export interface IUpdateProfileOptions {
    /**
     * Allows to change updating strategy.
     * In other words "PUT" or "PATCH" HTTP method will be used.
     *
     * Partial update requires an object
     * that can include any set of  `IUserProfile` properties.
     *
     * Full update requires only fully-implementing `IUserProfile` object.
     */
    updatePartial: boolean;
    /**
     * Indicates is profile updating after deposit or withdraw action.
     */
    isAfterDepositWithdraw?: boolean;
    /**
     * Only for profiles using Metamask.
     * Defines should confirmation be demanded or not.
     */
    requestConfirmation?: boolean;
}

/**
 * Return type for `updateProfile` method by `UserService`
 */
export type TUpdateProfileRes = IData<{result: boolean}> & {errors?: string[] | IIndexing<string> | null};

/**
 * Return type for `setNewPassword` method by `UserService`
 */

export type TSetNewPasswordRes = IData<Record<'result', string>> & {errors?: string[] | IIndexing<string> | null};

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // TODO: remove later
    /** @deprecated use isAuth$ */
    public isAuthenticated: boolean;
    public isAuth$: BehaviorSubject<boolean> = this.configService.get('$user.isAuth$');

    protected info: UserInfo;
    protected profile: UserProfile;
    protected userInfoHandler: Subscription;

    public get userInfo(): UserInfo {
        if (this.info?.dataReady) {
            return this.info;
        } else {
            return null;
        }
    }

    public get userProfile(): UserProfile {
        if (this.profile?.dataReady) {
            return this.profile;
        } else {
            return null;
        }
    }

    public userProfile$: BehaviorSubject<UserProfile> = new BehaviorSubject(null);
    public userInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject(null);
    private configUserProfile$: BehaviorSubject<UserProfile> = this.configService.get({name: '$user.userProfile$'});
    private configUserInfo$: BehaviorSubject<UserInfo> = this.configService.get({name: '$user.userInfo$'});
    private useAchievements: boolean;

    private limitationService: LimitationService;
    private idleService: IdleService;
    private bonusService: BonusesService;
    private metamaskService: MetamaskService;
    private isMetaMaskPending: boolean = false;
    private _isMetamaskUser: boolean = false;
    private achievementsService: AchievementsService;
    private dataLoyaltyUserSub: Subscription;
    private wsBalanceData: IWSDataUserBalance = null;
    private termsAcceptService: TermsAcceptService;
    private licenseLimitationsService: LicenseLimitationsService;
    private localJackpotsService: LocalJackpotsService;
    private twoFactorAuthService: TwoFactorAuthService;
    private isMultiWallet: boolean = false;
    private isShowSessionEndedModal: boolean = false;

    constructor(
        public translateService: TranslateService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
        private injectionService: InjectionService,
        private stateService: StateService,
        private router: UIRouter,
        private webSocketService: WebsocketService,
        private ngZone: NgZone,
        private fileService: FilesService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.configService.ready;
        this.isAuth$ ??= this.configService.get('$user.isAuth$');
        this.isAuthenticated = this.configService.get('$user.isAuthenticated');
        this.useAchievements = this.configService.get<boolean>('$base.profile.achievements.use');
        this.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

        this.userProfile$.subscribe((profile) => {
            this.configUserProfile$.next(profile);
        });

        this.userInfo$.subscribe((userInfo) => {
            this.configUserInfo$.next(userInfo);
        });

        this.translateService.onLangChange.subscribe(async () => {
            if (!this.isAuthenticated) return;

            await this.updateLanguage();
            this.eventService.emit({name: LanguageChangeEvents.ChangeLanguage});
        });

        this.registerMethods();

        this.info = new UserInfo(
            {service: 'UserService', method: 'constructor'},
            this.translateService,
        );
        this.profile = new UserProfile({service: 'UserService', method: 'constructor'},
            this.fileService, this.configService);

        if (this.useAchievements) {
            this.achievementsService ??= await this.injectionService
                .getService<AchievementsService>('achievements.achievement-service');
        }

        this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData<IUserInfo>) => {
            if (info?.code === 401 || _get(info, 'data.status') === 0) {
                this.isShowSessionEndedModal = this.isAuth$.getValue();
                this.logout();
                return;
            }

            this.info.data = info?.data;
            this.setUserInfo();

            if (this.info.socketsData) {

                if (this.info.socketsData.server) {
                    this.info.separateLoyalty = true;
                }

                this.webSocketService.addWsEndPointConfig('wsc2', this.info.socketsData);
            }
        });

        this.eventService.filter([
            {name: 'USER_PROFILE_ERROR'},
        ]).subscribe((event: IEvent<IData>) => {
            if (event.data.code === 401) {
                this.logout();
            }
        });

        this.eventService.subscribe({
            name: 'UPDATE_ACCEPTED_TERMS',
        }, (value: IUserInfo['toSVersion']) => {
            this.info.toSVersion = value;
            this.setUserInfo();
        });

        this.eventService.subscribe([
            {name: 'USER_PROFILE'},
        ], (profile: IData) => {
            this.setProfileData(profile.data);
        });

        this.eventService.subscribe({name: 'SOCKET_CONNECT', status: 'success'}, (data) => {
            if (this.isAuth$.getValue() && data === 'wsc2') {
                this.webSocketService.sendToWebsocket('wsc2', WebSocketEvents.SEND.LOYALTY);
                this.dataLoyaltyUserSub = this.webSocketService.getMessages({
                    endPoint: 'wsc2',
                    events: [
                        WebSocketEvents.RECEIVE.LOYALTY_GET,
                        WebSocketEvents.RECEIVE.LOYALTY_UPDATE,
                    ],
                }).subscribe((data: IWSLoyalty): void => {
                    switch (data.event) {
                        case WebSocketEvents.RECEIVE.LOYALTY_UPDATE:
                            const updatedLoyalty: ILoyalty = {};
                            for (const [key, value] of Object.entries(this.info.loyalty)) {
                                updatedLoyalty[key] = (data.data as ILoyaltyUpdate)[key]?.toString() ?? value;
                            }
                            this.info.loyalty = updatedLoyalty;
                            break;
                        case WebSocketEvents.RECEIVE.LOYALTY_GET:
                            this.info.loyalty = data.data as ILoyalty;
                            break;
                        default:
                            return;
                    }

                    this.setUserInfo();

                    this.eventService.emit({
                        name: 'USER_INFO',
                        data: this.info,
                    });
                });

                if (this.configService.get('$base.profile.webSockets.userBalance.use')) {
                    this.startWSUserBalance();
                }
            }
        });

        this.eventService.subscribe([
            {name: 'PROFILE_UPDATE'},
        ], () => {
            this.userProfile$.next(this.profile);
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth$.next(true);
            this.isAuthenticated = true;
            this.configService.set({name: '$user.isAuthenticated', value: true});
            this.setTermsAcceptService();
            this.setLocalJackpotsService();
            this.setLicenseLimitationsService();
            this.showTwoFactorAuthModal();
            this.fetchUserProfile().then(async () => {
                this._isMetamaskUser = this.userProfile.type === 'metamask';
                if (this.configService.get('$base.profile.limitations.use')) {
                    if (!this.limitationService) {
                        this.limitationService = await this.injectionService
                            .getService<LimitationService>('limitations.limitation-service');
                    }
                    this.limitationService.initRealityChecker(this.userProfile$, true);
                }

                this.fetchUserInfo();
                this.startUserInfoFetcher();
                this.idleHandler();

                if (this.configService.get<boolean>('$user.skipPasswordOnEditProfile')) {
                    this.configService.set<Promise<boolean>>({
                        name: '$user.skipPasswordOnFirstUserSession',
                        value: firstValueFrom(
                            this.configUserInfo$
                                .pipe(
                                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                                    map((userInfo: UserInfo): boolean => !!userInfo.firstSession),
                                ),
                        ),
                    });
                }
            });
            if (this.useAchievements) {
                this.achievementsService.setAchievementsSubscription();
            }
        });

        this.eventService.subscribe({
            name: 'LOGOUT_CONFIRM',
        }, () => {
            this.modalService.showModal('logout');
        });

        this.eventService.subscribe({
            name: 'USER_STATUS_DISABLE',
        }, () => {
            this.logout();
        });

        if (this.isAuthenticated) {
            this.setTermsAcceptService();
            this.setLocalJackpotsService();
            this.setLicenseLimitationsService();
            this.showTwoFactorAuthModal();
            this.fetchUserProfile().then(async () => {
                this._isMetamaskUser = this.userProfile.type === 'metamask';
                if (this.configService.get('$base.profile.limitations.use')) {
                    if (!this.limitationService) {
                        this.limitationService = await this.injectionService
                            .getService<LimitationService>('limitations.limitation-service');
                    }
                    this.limitationService.initRealityChecker(this.userProfile$);
                }

                this.fetchUserInfo();
                this.startUserInfoFetcher();
                this.idleHandler();
            });

            if (this.configService.get<boolean>('$base.finances.redirectAfterDepositBonus') && !this.bonusService) {
                this.bonusService = await this.injectionService.getService<BonusesService>('bonuses.bonuses-service');
                this.bonusService.queryBonuses(true, 'any');
            }
        }

        if (this.useAchievements && this.isAuth$.getValue()) {
            this.achievementsService.setAchievementsSubscription();
        }
        this.jwtAuthLogin();
    }

    public setProfileData(formData: IUserProfile): void {
        _mergeWith(this.profile.data, formData, (value, newValue) => {
            if (Array.isArray(newValue) && !newValue.length
                && (typeof value === 'object') && Object.keys(value).length === 0
            ) {
                return {};
            }
        });

        this.userProfile$.next(this.profile);
    }

    public validateRegistration(regData: IValidateData): Promise<IIndexing<any>> {
        return this.dataService.request('user/userRegistration', regData);
    }

    /**
     * Classic login via login (email) and password
     * @param {string} login email or login string
     * @param {string} password string
     */
    public login(login: string, password: string): Promise<IIndexing<any>>;

    /**
     * Login via Metamask
     * @param {TMetamaskData} login object with metamask login data
     */
    public login(login: TMetamaskData): Promise<IIndexing<any>>;
    public login(login: ILoginWithPhoneData): Promise<IIndexing<any>>;

    public login(login: string | TMetamaskData | ILoginWithPhoneData, password?: string): Promise<IIndexing<any>> {
        if (this.configService.get<boolean>('$base.site.useXNonce')) {
            this.dataService.setNonceToLocalStorage();
        }

        const loginData: TLoginData = _isString(login) ? {login, password} : login;

        const result = this.dataService.request<IIndexing<any>>('user/userLogin', loginData);
        this.logService.sendLog({code: '1.2.5'});
        result.then((res) => {
            if (res.code === 231) {
                this.enterTwoFactorAuthCode(res.data.authKey, res.code);
            } else {
                this.eventService.emit({name: 'LOGIN'});
            }
        }).catch((error) => {

            if (this.configService.get<boolean>('$base.site.useXNonce')) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            if (error.code === 418) {
                if (this.modalService.getActiveModal('device-registration')) {
                    this.eventService.emit({name: 'RESEND_CODE'});
                } else {
                    this.modalService.showModal('deviceRegistration', {login: login, password: password});
                }
            }

            this.logService.sendRequestLog({
                coreLog: {code: '1.2.3'},
                networkLog: {code: '1.2.4'},
                from: {
                    service: 'UserService',
                    method: 'login',
                },
                responseData: error,
            });
            this.eventService.emit({
                name: ProcessEvents.failTrigger,
                data: <IProcessEventData>{
                    eventId: 'login',
                    description: ProcessEventsDescriptions.failTrigger + error.code + ' (/auth PUT)',
                },
            });
        });
        return result;
    }

    public logout(): void {
        this.dataService.request('user/userLogout')
            .finally(() => {
                this.eventService.emit({name: 'LOGOUT'});
                if (this.configService.get<boolean>('$base.site.useXNonce')) {
                    this.dataService.deleteNonceFromLocalStorage();
                }
            });

        this.isAuth$.next(false);
        this.isAuthenticated = false;
        this.configService.set({name: '$user.isAuthenticated', value: false});

        this.stopUserInfoFetcher();

        this.info = new UserInfo(
            {service: 'UserService', method: 'constructor'},
            this.translateService,
        );
        this.setUserInfo();
        this.profile = new UserProfile({service: 'UserService', method: 'constructor'},
            this.fileService, this.configService);
        this.userProfile$.next(this.profile);

        if (this.modalService.getActiveModal('login-error')) {
            firstValueFrom(
                this.eventService.filter([{name: ProcessEvents.modalClosed}])
                    .pipe(
                        first((eventData: IEvent<IProcessEventData>) => eventData.data.eventId === 'login-error'),
                    ),
            ).then(() => {
                this.window.location.reload();
            });
        } else {
            this.stateService.go('app.home', {
                locale: this.translateService.currentLang,
            }).transition.promise
                .finally(() => {
                    if (this.isShowSessionEndedModal) {
                        this.showSessionEndedModal();
                    }
                });
        }

        if (this.configService.get('phoneNumber')) {
            this.configService.set({
                name: 'phoneNumber',
                value: null,
            });
        }

        if (this.configService.get('phoneCode')) {
            this.configService.set({
                name: 'phoneCode',
                value: null,
            });
        }
        this.dataLoyaltyUserSub?.unsubscribe();
    }

    public createUserProfile(userProfile: IUserProfile): Promise<IIndexing<any>> {
        if (GlobalHelper.restrictRegistration(this.configService, this.eventService)) {
            throw new Error(gettext('Sorry, registration is disabled.'));
        }
        this.prepareCreateProfile(userProfile);
        const queryParams: ICreateProfileQueryParams = {};
        const isFastRegistration = this.configService.get<number>('appConfig.siteconfig.fastRegistration');

        userProfile.registrationURL = this.router.urlService.config.host();

        if (userProfile.phoneCode && userProfile.phoneNumber && !userProfile.login && !userProfile.email) {
            queryParams.smsLogin = 1;
        }

        const response = this.dataService.request({
            name: 'createProfile',
            system: 'user',
            url: '/profiles',
            type: 'POST',
            params: queryParams,
            events: {
                success: 'PROFILE_CREATE',
                fail: 'PROFILE_CREATE_ERROR',
            },
        }, userProfile);

        this.logService.sendLog({code: '1.1.25'});
        if (isFastRegistration) {
            this.sendFlogAfterFastRegistration();
        }
        response.catch((error: unknown) => {
            this.logService.sendRequestLog({
                coreLog: {code: '1.1.23'},
                networkLog: {code: '1.1.24'},
                from: {
                    service: 'UserService',
                    method: 'createUserProfile',
                },
                responseData: error,
            });
        });
        return response;
    }

    public registrationComplete(code: string): Promise<IIndexing<any>> {
        const data: IRegistrationCompleteData = {code};

        if (this.configService.get<boolean>('$base.site.useJwtToken')) {
            data.useJwt = true;
        }

        return this.dataService.request('user/registrationComplete', data);
    }

    public async updateProfile(updates: IUserProfile, options: IUpdateProfileOptions): Promise<TUpdateProfileRes> {
        try {
            this.checkForAgeLegality(updates);

            const requestParams = await this.getUpdateProfileParams(updates, options);

            const response: TUpdateProfileRes = await this.dataService.request({
                name: 'updateProfile',
                system: 'user',
                url: '/profiles',
                type: options.updatePartial ? 'PATCH' : 'PUT',
                events: {
                    fail: 'PROFILE_UPDATE_ERROR',
                },
            }, requestParams);

            if (response.data?.result) {
                _merge(this.profile.data, updates);
                this.eventService.emit({name: 'PROFILE_UPDATE'});
            }

            return response;
        } catch (error) {
            return error;
        }
    }

    public async fetchUserInfo(): Promise<void> {
        try {
            await this.dataService.request('user/userInfo');
        } catch (error) {
            this.logService.sendLog({code: '1.3.3'});
        }
    }

    private async getUpdateProfileParams(updates: IUserProfile, options: IUpdateProfileOptions): Promise<IUserProfile> {
        const {updatePartial = false, isAfterDepositWithdraw} = options;

        if (updates?.phoneCode && !updates.phoneNumber) {
            updates.phoneCode = '';
        }

        const requestParams = updatePartial
            ? _assign({}, updates, isAfterDepositWithdraw ? {isAfterDepositWithdraw} : {})
            : _assign({}, this.profile.data, updates);

        if (this.shouldUpdateProfileWithMetamask(options)) {
            return await this.getUpdateProfileParamsWithMetamask(requestParams);
        }

        return requestParams;
    }

    private async getUpdateProfileParamsWithMetamask(requestParams: IUserProfile): Promise<ProfileParamsWithMetamask> {
        if (!this.metamaskService) {
            this.metamaskService = await this.injectionService
                .getService<MetamaskService>('metamask.metamask-service');
        }

        const metamaskData: TMetamaskData = await this.metamaskService.requestAuthData('profile');

        return _assign(
            requestParams,
            metamaskData,
            {type: 'metamask'},
        );
    }

    private shouldUpdateProfileWithMetamask(options: IUpdateProfileOptions): boolean {
        return this._isMetamaskUser && (
            !options.updatePartial || options.requestConfirmation
        );
    }

    private shouldAgeBeChecked(updates: IUserProfile): boolean {
        return ['birthYear', 'birthDay', 'birthMonth'].every((key) => key in updates);
    }

    private checkForAgeLegality(updates: IUserProfile): void {
        if (this.shouldAgeBeChecked(updates) && !this.isAgeLegal(updates)) {
            const explanationStart = this.translateService.instant(gettext('You are under the age of'));
            const legalAge = this.configService.get('legalAgeByCountry')
                            || this.configService.get<number>('$base.profile.legalAge');
            const explanationFinal = this.translateService.instant(gettext('age_end'));

            const message = `${explanationStart} ${legalAge}${explanationFinal}`;

            throw {errors: [message]};
        }
    }

    public sendPasswordRestore(email?: string, phone?: string, reCaptchaToken?: string): Promise<IIndexing<any>> {
        const params: IUserPasswordPost = _merge({},
            email ? {email} : {},
            phone ? {phone, sendSmsCode: 1} : {},
            reCaptchaToken ? {reCaptchaToken} : {},
        );

        return this.dataService.request('user/passwordRestore', params);
    }

    public restoreNewPassword(newPassword: string, repeatPassword: string, code: string): Promise<IIndexing<any>> {
        const params = {newPassword, repeatPassword, code};
        const result = this.dataService.request<IIndexing<any>>('user/restoreNewPassword', params);
        result.then((res) => {
            if (res.code === 232) {
                this.enterTwoFactorAuthCode(res.data.authKey, res.code);
            } else {
                if (this.configService.get<boolean>('$base.site.useJwtToken')) {
                    this.modalService.showModal('login');
                } else {
                    this.stateService.go('app.home');
                    this.eventService.emit({name: 'LOGIN'});
                }
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'success',
                        title: gettext('Password reset'),
                        message: gettext('Password has been changed!'),
                        wlcElement: 'notification_password-change-success',
                    },
                });
                UserHelper.showInformationModal(
                    this.modalService,
                    gettext('Your password has been successfully changed'),
                );
            }
        });
        return result;
    }

    public validateRestoreCode(code: string = ''): Promise<IIndexing<any>> {
        const params = {action: 'checkRestoreCode', code};
        return this.dataService.request('user/validateRestoreCode', params);
    }

    public async setNewPassword(password: string, newPassword: string): Promise<TSetNewPasswordRes> {
        try {
            const params: ISetNewPasswordData = {password, newPassword};
            const response: TSetNewPasswordRes = await this.dataService.request('user/newPassword', params);

            return response;
        } catch (error) {
            this.logService.sendLog({code: '', data: error});
            throw error;
        }
    }

    public changePhone(phoneCode: string, phoneNumber: string): void {
        const params = {phoneCode, phoneNumber};
        this.dataService.request('user/updatePhone', params);
    }

    public phoneUnique(phone: string, code: string): void {
        const params = {phone, code};
        this.dataService.request('user/phoneUnique', params);
    }

    public changeEmail(email: string, currentPassword?: string, code?: string): void {
        const params: {email: string; currentPassword?: string; code?: string} = {email};

        if (currentPassword) {
            params.currentPassword = currentPassword;
        }

        if (code) {
            params.code = code;
        }

        this.dataService.request('user/updateEmail', params);
    }

    public emailUnique(email: string): Promise<IData> {
        return this.dataService.request('user/emailUnique', {email});
    }

    public loginUnique(login: string): Promise<IData<ILoginUniqResponse>> {
        return this.dataService.request('user/loginUnique', {login});
    }

    public updateLogin(login: string): void {
        this.dataService.request('user/updateLogin', {login});
    }

    public async updateLanguage(): Promise<IData> {
        return this.dataService.request('user/updateLanguage');
    }

    public disableProfile(): void {
        this.dataService.request('user/disableProfile');
    }

    public fetchUserProfile(): Promise<IData> {
        return this.dataService.request('user/userProfile');
    }

    /**
     * New device registration request,
     * available if the base.config.profile.trustedDevices is set to true
     * @param {number} code verification code from the user's email
     * @param {string} login login
     */
    public deviceRegistration(code: number, login: string): Promise<any> {
        return this.dataService.request('user/deviceRegistration', {code, login});
    }

    public finishRegistration(skipEmailVerification?: boolean): void {

        const isFastRegistration = this.configService.get<number>('appConfig.siteconfig.fastRegistration');
        const hideEmailExistence = this.configService.get<boolean>('appConfig.hideEmailExistence');
        const message = [
            gettext('Your account has been registered.'),
        ];

        if (isFastRegistration || skipEmailVerification) {
            this.eventService.emit({name: 'LOGIN'});

            if (!hideEmailExistence) {
                setTimeout(() => {
                    this.registrationRedirect();
                });
            }
        } else {
            if (this.configService.get<boolean>('appConfig.hideEmailExistence')) {
                message.push(gettext(
                    'An email was sent to the specified email address. '
                    + 'If you already have an account, we will send you a password recovery link. '
                    + 'Kindly check your email box and confirm registration using the link in the email.',
                ));
            } else {
                message.push(gettext('Please complete registration using link in e-mail'));
            }
        }

        if (hideEmailExistence && !!isFastRegistration) {
            this.eventService.filter([
                {name: 'USER_PROFILE'},
                {name: 'USER_PROFILE_ERROR'},
            ]).pipe(first()).subscribe({
                next: (event: IEvent<IData>) => {
                    if (event.data.code === 401) {
                        this.logout();
                        this.failedRegistration();
                    } else {
                        this.successfulRegistration(message);
                        this.registrationRedirect();
                    }
                },
            });
        } else {
            this.successfulRegistration(message);
        }

        if (this.modalService.getActiveModal('signup')) {
            this.modalService.hideModal('signup', undefined, 'success');
            this.eventService.emit({name: this.modalService.events.MODAL_HIDDEN, data: 'signup'});
        } else if (this.modalService.getActiveModal('login')) {
            this.modalService.hideModal('login', undefined, 'success');
        }
    }

    public async metamaskAuth(): Promise<void> {
        if (this.isMetaMaskPending) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Authorization via MetaMask'),
                    message: gettext('Your request is already being processed'),
                    wlcElement: 'notification_registration-error',
                },
            });
            return;
        }

        try {
            this.isMetaMaskPending = true;

            if (!this.metamaskService) {
                this.metamaskService = await this.injectionService
                    .getService<MetamaskService>('metamask.metamask-service');
            }

            const account: string = await this.metamaskService.getAccount();
            const {data}: IData<ILoginUniqResponse> = await this.loginUnique(account);

            if (data.result) {
                await this.metamaskService.requestProfile();
            } else {
                const authData: TMetamaskData = await this.metamaskService.requestAuthData('login');
                await this.login(authData);
                if (this.stateService.is('app.signin') || this.stateService.is('app.login')) {
                    this.stateService.go('app.home');
                } else if (this.modalService.getActiveModal('login')) {
                    this.modalService.hideModal('login');
                } else if (this.modalService.getActiveModal('signup')) {
                    this.modalService.hideModal('signup');
                }
            }
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Authorization via MetaMask'),
                    message: error.errors,
                    wlcElement: 'notification_registration-error',
                },
            });
            this.logService.sendLog({code: '1.7.0', data: error});
        } finally {
            this.isMetaMaskPending = false;
        }
    }

    /**
     * Email verification request
     *
     * request without params - generate and send to user's email verification link
     * request with code param - verification for authorized user
     * request with code and password - verification for unauthorized user
     *
     * @param {IEmailVerifyData} data
     */
    public emailVerification(data?: IEmailVerifyData): Promise<IData> {
        return this.dataService.request('user/emailVerification', data);
    }

    protected prepareCreateProfile(userProfile: IUserProfile): void {
        if (this.configService.get('$base.profile.limitations.use')
            && this.configService.get('$base.profile.limitations.realityChecker.autoApply')
            && !Array.isArray(userProfile.extProfile)
            && !userProfile.extProfile?.realityCheckTime
        ) {
            _set(
                userProfile,
                'extProfile.realityCheckTime',
                this.configService.get('$base.profile.limitations.realityChecker.period'),
            );
        }

        if (this.configService.get('$base.turnOnSendEmailNotificationInRegister')) {
            userProfile.emailAgree = true;
        }

        if (userProfile?.phoneCode && !userProfile?.phoneNumber) {
            userProfile.phoneCode = '';
        }
    }

    private jwtAuthLogin(): void {
        if (!this.isAuthenticated && this.configService.get<boolean>('$base.site.useJwtToken')) {
            const jwtRefreshToken: string = this.configService.get({
                name: 'jwtAuthRefreshToken',
                storageType: 'localStorage',
            });
            if (jwtRefreshToken) {
                this.eventService.emit({
                    name: 'LOGIN',
                });
            }
        }
    }

    private registrationRedirect(): void {
        const redirect = this.configService.get<IRedirect>('$base.redirects.registration');
        if (redirect) {
            this.stateService.go(redirect.state, redirect.params || {});
        }
    }

    /**
     * Check if user is too young
     *
     * @param {birthDay, birthYear, birthMonth}: IUserProfile - Accepts part of profile of object with fields;
     *
     * @return {boolean}
     */
    public isAgeLegal({birthDay, birthYear, birthMonth}: IUserProfile): boolean {
        const legalAge: number = this.configService.get('legalAgeByCountry')
                                || this.configService.get('$base.profile.legalAge');
        return DateTime.utc(+birthYear, +birthMonth, +birthDay)
            .diffNow('years')
            .years * -1 >= legalAge;
    }

    public setNicknameIcon(avatar?: string, nick?: string): Promise<IData> {
        const extProfile = {
            avatarId: avatar,
        };

        return this.updateProfile({extProfile, nick}, {updatePartial: true});
    }

    private successfulRegistration(message: string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Registration success'),
                message,
                wlcElement: 'notification_registration-success',
            },
        });
        this.eventService.emit({
            name: ProcessEvents.successTrigger,
            data: <IProcessEventData>{
                eventId: 'signup',
                description: ProcessEventsDescriptions.successTrigger + 'user registered',
            },
        });
        this.eventService.emit({name: 'REGISTRATION_COMPLETE'});
    }

    private failedRegistration(): void {
        this.modalService.showModal({
            id: 'registration-errors',
            modalTitle: gettext('Sorry, something went wrong!'),
            modalMessage: gettext(
                'Something went wrong during registration, check your email to change your password.',
            ),
            textAlign: 'center',
            dismissAll: true,
        });
    }

    private startUserInfoFetcher(): void {
        this.userInfoHandler = this.dataService.subscribe('user/userInfo', (userInfo) => {
            if (!userInfo || this.userInfoHandler.closed) {
                return;
            }
            try {
                this.eventService.emit({
                    name: 'USER_INFO',
                    data: userInfo,
                });
            } catch (error) {
                this.eventService.emit({
                    name: 'USER_INFO_ERROR',
                    data: error,
                });
            }
        });
    }

    private stopUserInfoFetcher(): void {
        this.userInfoHandler?.unsubscribe();
        this.dataService.reset('user/userInfo');
    }

    private sendFlogAfterFastRegistration(): void {
        const userInfoSubscribe = this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData<IUserInfo>) => {
            if (info?.code === 200) {
                this.logService.sendLog({code: '1.1.28'});
            } else {
                this.logService.sendLog({code: '1.1.27'});
            }
            userInfoSubscribe.unsubscribe();
        });
    }

    private startWSUserBalance(): void {
        this.webSocketService.sendToWebsocket('wsc2', WebSocketEvents.SEND.USER_INFO);

        let lastTimeGetUserWSBalance: number = null;
        let isErrorWSUserBalance: boolean = false;
        let sentRequestsWithoutResponse: number = 1;
        let setTimeoutRefreshData: NodeJS.Timeout;
        let setTimeoutUpdateUserInfo: NodeJS.Timeout;
        let sendUserInfoIntervalSub: Subscription;

        this.ngZone.runOutsideAngular(() => {
            sendUserInfoIntervalSub = interval(10000)
                .subscribe(() => {
                    if (!isErrorWSUserBalance
                        && sentRequestsWithoutResponse >= 1
                        && (!lastTimeGetUserWSBalance
                            || DateTime.now().toSeconds() - lastTimeGetUserWSBalance > 15)
                    ) {
                        setErrorWS();
                    }
                });
        });

        const wsUserInfoSub: Subscription = this.webSocketService.getMessages(
            {
                endPoint: 'wsc2',
                events: [WebSocketEvents.RECEIVE.USER_BALANCE, WebSocketEvents.RECEIVE.USER],
                eventFilterFunc: this.filterEventWSBalance.bind(this),
            })
            .pipe(
                tap((data: IWSConsumerData<IWSDataUserBalance>) => {
                    if (data.status === 'error') {
                        setErrorWS();
                    }
                }),
                takeWhile((data: IWSConsumerData<IWSDataUserBalance>) => data.status !== 'error'),
            )
            .subscribe((data: IWSConsumerData<IWSDataUserBalance>) => {
                if (!_isUndefined(data.data.Balance) || !_isUndefined(data.data.BonusBalance)) {
                    if (setTimeoutUpdateUserInfo) {
                        clearTimeout(setTimeoutUpdateUserInfo);
                    }

                    if (setTimeoutRefreshData) {
                        clearTimeout(setTimeoutRefreshData);
                    }

                    if (isErrorWSUserBalance) {
                        isErrorWSUserBalance = false;
                    }

                    this.ngZone.runOutsideAngular(() => {
                        setTimeoutUpdateUserInfo = setTimeout(() => {
                            const nowTime = DateTime.now().toSeconds();
                            if (nowTime - lastTimeGetUserWSBalance > 1 && data.data.Balance !== this.userInfo.balance) {
                                this.setUserInfo();
                            }
                        }, 1500);

                        setTimeoutRefreshData = setTimeout(() => {
                            const nowTime = DateTime.now().toSeconds();
                            if (nowTime - lastTimeGetUserWSBalance >= 10) {
                                this.webSocketService.sendToWebsocket('wsc2', WebSocketEvents.SEND.USER_INFO);
                                sentRequestsWithoutResponse++;
                            }
                        }, 10000);
                    });

                    if (!_isUndefined(data.data.GameActionID) && !_isUndefined(this.wsBalanceData?.GameActionID)
                        && data.data.GameActionID > this.wsBalanceData.GameActionID
                        || _isUndefined(data.data.GameActionID)
                        || _isUndefined(this.wsBalanceData?.GameActionID)) {
                        this.wsBalanceData = _assign(this.wsBalanceData, data.data);
                    }

                    lastTimeGetUserWSBalance = DateTime.now().toSeconds();

                    if (data.event === WebSocketEvents.RECEIVE.USER) {
                        sentRequestsWithoutResponse--;
                    }

                    this.setMultiWalletWSData(data.event, data.data.IsWallet);
                }
            });

        const authSub: Subscription = this.isAuth$
            .subscribe((auth: boolean) => {
                if (!auth) {
                    this.wsBalanceData = null;
                    sendUserInfoIntervalSub.unsubscribe();
                    wsUserInfoSub.unsubscribe();
                    authSub.unsubscribe();
                    if (isErrorWSUserBalance) {
                        isErrorWSUserBalance = false;
                    }
                }
            });

        const setErrorWS = (): void => {
            isErrorWSUserBalance = true;
            this.info.bonusBalanceWS = null;
            this.wsBalanceData = null;
            this.setUserInfo();
        };
    }

    private setUserInfo(): void {
        if (this.wsBalanceData) {
            const bonusBalance: number = this.wsBalanceData.BonusBalance || 0;
            const userBalance: number = Number(this.wsBalanceData.Balance) || 0;
            this.info.balance = userBalance + bonusBalance;
            this.info.bonusBalanceWS = bonusBalance;
        }

        this.userInfo$.next(this.info);
    }

    private setMultiWalletWSData(eventName: string, IsWallet: number): void {

        if (this.isMultiWallet && this.wsBalanceData) {

            if (_isUndefined(IsWallet)) {
                this.wsBalanceData.IsWallet = 0;
            }

            if (eventName === WebSocketEvents.RECEIVE.USER) {
                this.info.wsWallets = this.wsBalanceData.Wallets;

            } else if (eventName === WebSocketEvents.RECEIVE.USER_BALANCE) {
                this.info.setWalletBalance(this.wsBalanceData, this.isMultiWallet, this.profile.originalCurrency);
                this.userInfo$.next(this.info);
            }
        }
    }

    private filterEventWSBalance(event: IWSConsumerData): boolean {
        let filterResult: boolean = true;

        if (event.event === WebSocketEvents.RECEIVE.USER_BALANCE) {
            filterResult = event.data.IsWallet
                ? event.data.IDParent === Number(this.profile.idUser)
                : event.data.IDUser === Number(this.profile.idUser);

            if (!filterResult) {
                return filterResult;
            }
        }

        if (event.data?.timestamp) {
            const eventTimeSeconds = DateTime.fromSQL(event.data.timestamp, {zone: 'utc'}).toSeconds();
            const nowTimeSeconds = DateTime.now().toSeconds();
            filterResult = nowTimeSeconds - eventTimeSeconds < 5;
        }

        return filterResult;
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'userRegistration',
            url: '/validate/user-register',
            type: 'POST',
            system: 'user',
            events: {
                success: 'REGISTRATION_BEGIN',
                fail: 'REGISTRATION_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'userLogin',
            system: 'user',
            url: '/auth',
            type: 'PUT',
            events: {
                success: 'LOGIN_SUCCESS',
                fail: 'LOGIN_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'userLogout',
            system: 'user',
            url: '/auth',
            type: 'DELETE',
        });

        this.dataService.registerMethod({
            name: 'registrationComplete',
            system: 'user',
            url: '/profiles',
            type: 'PATCH',
            events: {
                success: 'REGISTRATION_CONFIRM',
                fail: 'REGISTRATION_CONFIRM_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'passwordRestore',
            system: 'user',
            url: '/userPassword',
            type: 'POST',
            events: {
                success: 'PROFILE_RESTORE',
                fail: 'PROFILE_RESTORE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'restoreNewPassword',
            system: 'user',
            url: '/userPassword',
            type: 'PUT',
            events: {
                success: 'PROFILE_PASSWORD',
                fail: 'PROFILE_PASSWORD_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'validateRestoreCode',
            system: 'user',
            url: '/userPassword',
            type: 'GET',
            events: {
                success: 'VALIDATE_RESTORE_CODE',
                fail: 'VALIDATE_RESTORE_CODE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'newPassword',
            system: 'user',
            url: '/userPassword',
            type: 'PATCH',
            events: {
                success: 'NEW_PASSWORD',
                fail: 'NEW_PASSWORD_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'updatePhone',
            system: 'user',
            url: '/profiles/phone',
            type: 'POST',
            events: {
                success: 'UPDATE_PHONE',
                fail: 'UPDATE_PHONE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'phoneUnique',
            system: 'user',
            url: '/profiles/phone',
            type: 'PUT',
            events: {
                success: 'PHONE_UNIQUE',
                fail: 'PHONE_UNIQUE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'updateEmail',
            system: 'user',
            url: '/profiles/email',
            type: 'POST',
            events: {
                success: 'UPDATE_EMAIL',
                fail: 'UPDATE_EMAIL_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'emailUnique',
            system: 'user',
            url: '/profiles/email',
            type: 'PUT',
            events: {
                success: 'EMAIL_UNIQUE',
                fail: 'EMAIL_UNIQUE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'loginUnique',
            system: 'user',
            url: '/profiles/login',
            type: 'PUT',
            events: {
                success: 'LOGIN_UNIQUE',
                fail: 'LOGIN_UNIQUE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'updateLogin',
            system: 'user',
            url: '/profiles/login',
            type: 'POST',
            events: {
                success: 'LOGIN_UPDATE',
                fail: 'LOGIN_UPDATE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'updateLanguage',
            system: 'user',
            url: '/profiles/language',
            type: 'PATCH',
            events: {
                success: 'LANGUAGE_UPDATE',
                fail: 'LANGUAGE_UPDATE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'disableProfile',
            system: 'user',
            url: '/profiles/disable',
            type: 'PUT',
            events: {
                success: 'DISABLE_PROFILE',
                fail: 'DISABLE_PROFILE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'userProfile',
            system: 'user',
            url: '/profiles',
            type: 'GET',
            events: {
                success: 'USER_PROFILE',
                fail: 'USER_PROFILE_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'userInfo',
            system: 'user',
            url: '/userInfo',
            type: 'GET',
            period: 10000,
        });

        this.dataService.registerMethod({
            name: 'deviceRegistration',
            system: 'user',
            url: '/trustDevices',
            type: 'POST',
            events: {
                success: 'DEVICE_REGISTRATION',
                fail: 'DEVICE_REGISTRATION_ERROR',
            },
        });

        this.dataService.registerMethod({
            name: 'emailVerification',
            system: 'user',
            url: '/profiles/confirmation/email',
            type: 'POST',
            events: {
                success: 'EMAIL_VERIFY',
                fail: 'EMAIL_VERIFY_ERROR',
            },
        });
    }

    private async idleHandler(): Promise<void> {
        if (this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga')
            || (this.configService.get<string>('appConfig.license') === 'italy'
                || this.configService.get('$base.profile.autoLogout.use'))
        ) {
            if (!this.idleService) {
                this.idleService = await this.injectionService
                    .getService<IdleService>('user.idle-service');
            }
            this.idleService.init();
        }
    }

    private async showTwoFactorAuthModal(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.Enable2FAGoogle')) {
            const userInfo: UserInfo = await firstValueFrom(
                this.configUserInfo$
                    .pipe(
                        first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                    ),
            );
            if (userInfo.notify2FAGoogle) {
                this.twoFactorAuthService ??= await this.injectionService
                    .getService<TwoFactorAuthService>('two-factor-auth.two-factor-auth-service');
                this.twoFactorAuthService.showNotification2FAGoogle(userInfo);
            }
        }
    }

    private enterTwoFactorAuthCode(data: string[], code: number): void {
        if (Array.isArray(data) && data.length === 1) {
            this.modalService.showModal('two-factor-auth-code', {authKey: data[0], responseCode: code});
        }
    }

    private async setTermsAcceptService(): Promise<void> {
        if (this.configService.get<string>('appConfig.siteconfig.termsOfService')) {
            this.termsAcceptService ??= await this.injectionService
                .getService<TermsAcceptService>('user.terms-accept-service');
        }
    }

    private async setLicenseLimitationsService(): Promise<void> {
        if (this.configService.get<string>('appConfig.license') === 'malta'
            || this.configService.get<string>('appConfig.license') === 'romania'
        ) {
            this.licenseLimitationsService ??= await this.injectionService
                .getService<LicenseLimitationsService>('limitations.license-limitations-service');
        }
    }

    private async setLocalJackpotsService(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.LocalJackpots')) {
            this.localJackpotsService ??= await this.injectionService
                .getService<LocalJackpotsService>('local-jackpots.local-jackpots-service');
        }
    }

    private showSessionEndedModal(): void {
        this.modalService.showModal({
            id: 'ended-session-modal',
            componentName: 'user.wlc-ended-session-modal',
            textAlign: 'center',
            rejectBtnVisibility: false,
            showConfirmBtn: true,
            confirmBtnText: gettext('Ok'),
            closeBtnVisibility: false,
            dismissAll: true,
            backdrop: 'static',
        });
        this.isShowSessionEndedModal = false;
    }
}
