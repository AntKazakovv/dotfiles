import {
    Inject,
    Injectable,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {DateTime} from 'luxon';
import {StateService} from '@uirouter/core';

import {
    Subscription,
    BehaviorSubject,
    firstValueFrom,
} from 'rxjs';
import {
    filter,
    first,
    map,
} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _keys from 'lodash-es/keys';
import _set from 'lodash-es/set';
import _merge from 'lodash-es/merge';
import _isString from 'lodash-es/isString';
import _get from 'lodash-es/get';

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
    ChosenBonusSetParams,
    ChosenBonusType,
    BonusesService,
} from 'wlc-engine/modules/bonuses';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {LimitationService} from 'wlc-engine/modules/user/submodules/limitations';
import {IdleService} from 'wlc-engine/modules/user/system/services/idle/idle.service';
import {TermsAcceptService} from 'wlc-engine/modules/user/system/services/terms/terms-accept.service';
import {
    ILogoutConfirm,
    IUserPasswordPost,
    IEmailVerifyData,
} from 'wlc-engine/modules/user/system/interfaces/user.interface';

export enum LanguageChangeEvents {
    ChangeLanguage = 'CHANGE_LANGUAGE'
}

interface ILoginUniqResponse {
    result: boolean;
}

interface ILoginPasswordData {
    login: string;
    password: string;
}

type TLoginData = TMetamaskData | ILoginPasswordData;

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

export type TSetNewPasswordRes = IData<Record<'result', string>>;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public isAuthenticated: boolean;

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

    private limitationService: LimitationService;
    private idleService: IdleService;
    private bonusService: BonusesService;
    private metamaskService: MetamaskService;
    private isMetaMaskPending: boolean = false;
    private _isMetamaskUser: boolean = false;

    constructor(
        public translate: TranslateService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
        private injectionService: InjectionService,
        private stateService: StateService,
        private termsAccept: TermsAcceptService,
        @Inject(WINDOW) private window: Window,
    ) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.configService.ready;
        this.isAuthenticated = this.configService.get('$user.isAuthenticated');
        this.userProfile$.subscribe((profile) => {
            this.configUserProfile$.next(profile);
        });

        this.userInfo$.subscribe((userInfo) => {
            this.configUserInfo$.next(userInfo);
        });

        this.translate.onLangChange.subscribe(async () => {
            if (!this.isAuthenticated) return;

            await this.updateLanguage();
            this.eventService.emit({name: LanguageChangeEvents.ChangeLanguage});
        });

        this.registerMethods();

        this.info = new UserInfo(
            {service: 'UserService', method: 'constructor'},
            this.translate,
            this.eventService,
        );
        this.profile = new UserProfile({service: 'UserService', method: 'constructor'});

        this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData<IUserInfo>) => {
            if (info?.code === 401 || _get(info, 'data.status') === 0) {
                this.logout();
                return;
            }

            this.info.data = info?.data;
            this.userInfo$.next(this.info);

            if (this.info.socketsData) {
                this.info.separateLoyalty = true;
                this.dataService.setSocketUrl(this.info.socketsData);
            }
        });

        this.eventService.subscribe({
            name: 'UPDATE_ACCEPTED_TERMS',
        }, (value: IUserInfo['toSVersion']) => {
            this.info.toSVersion = value;
            this.userInfo$.next(this.info);
        });

        this.eventService.subscribe([
            {name: 'USER_PROFILE'},
        ], (profile: IData) => {
            this.profile.data = profile?.data;
            this.userProfile$.next(this.profile);
        });

        this.eventService.subscribe({name: 'SOCKET_CONNECT', status: 'success'}, () => {
            this.dataService.socketRequest('loyalty.get');
        });

        this.dataService.flow
            .pipe(filter(
                (data) => {
                    return data.system === 'socket'
                        && (
                            data.name === 'loyalty-get'
                            || data.name === 'loyalty-UserInfo'
                        );
                }))
            .subscribe((data) => {
                this.info.loyalty = data.data;
                this.userInfo$.next(this.info);
                this.eventService.emit({
                    name: 'USER_INFO',
                    data: this.info,
                });
            });

        this.eventService.subscribe([
            {name: 'PROFILE_UPDATE'},
        ], () => {
            this.userProfile$.next(this.profile);
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuthenticated = true;
            this.configService.set({name: '$user.isAuthenticated', value: true});
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
        });

        this.eventService.subscribe({
            name: 'LOGOUT_CONFIRM',
        }, (data: ILogoutConfirm) => {
            this.modalService.showModal({
                id: 'logout-confirm',
                modalTitle: gettext('Confirmation'),
                modifier: 'confirmation',
                wlcElement: 'modal_logout',
                modalMessage: data?.modalMessage || gettext('Are you sure?'),
                showConfirmBtn: true,
                closeBtnParams: {
                    themeMod: 'secondary',
                    wlcElement: 'button_no',
                    common: {
                        text: gettext('No'),
                    },
                },
                confirmBtnParams: {
                    wlcElement: 'button_yes',
                    common: {
                        text: gettext('Yes'),
                    },
                },
                textAlign: 'center',
                onConfirm: () => {
                    this.logout();
                },
                dismissAll: true,
            });
        });

        this.eventService.subscribe({
            name: 'USER_STATUS_DISABLE',
        }, () => {
            this.logout();
        });

        if (this.isAuthenticated) {
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
    }

    public setProfileData(formData: IUserProfile): void {
        _each(_keys(formData), (field) => {
            this.profile.data[field] = formData[field];
        });

        this.userProfile$.next(this.profile);
    }

    public prepareRegData(data: Partial<IUserProfile>): IValidateData {
        const formData: IValidateData = {
            'TYPE': 'user-register',
            data,
            fields: _keys(data),
        };

        const chosenBonus = this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus);

        if (chosenBonus?.id) {
            formData.data.registrationBonus = String(chosenBonus.id);
            formData.fields.push('registrationBonus');
        }

        return formData;
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

    public login(login: string | TMetamaskData, password?: string): Promise<IIndexing<any>> {
        if (this.configService.get<boolean>('$base.site.useXNonce')) {
            this.dataService.setNonceToLocalStorage();
        }

        const loginData: TLoginData = _isString(login) ? {login, password} : login;

        const response = this.dataService.request<IIndexing<any>>('user/userLogin', loginData);
        this.logService.sendLog({code: '1.2.5'});
        response.catch((error) => {

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
        return response;
    }

    public logout(): void {
        this.dataService.request('user/userLogout')
            .finally(() => {
                this.eventService.emit({name: 'LOGOUT'});
                if (this.configService.get<boolean>('$base.site.useXNonce')) {
                    this.dataService.deleteNonceFromLocalStorage();
                }
            });

        this.isAuthenticated = false;
        this.configService.set({name: '$user.isAuthenticated', value: false});

        this.dataService.closeSocket();
        this.stopUserInfoFetcher();

        this.info = new UserInfo(
            {service: 'UserService', method: 'constructor'},
            this.translate,
            this.eventService,
        );
        this.userInfo$.next(this.info);
        this.profile = new UserProfile({service: 'UserService', method: 'constructor'});
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
                locale: this.translate.currentLang,
            });
        }
    }

    public createUserProfile(userProfile: IUserProfile): Promise<IIndexing<any>> {

        if (this.configService.get('$base.profile.limitations.use')
            && this.configService.get('$base.profile.limitations.autoApplyRealityChecker')
            && !userProfile.extProfile?.realityCheckTime) {
            _set(userProfile, 'extProfile.realityCheckTime', 30);
        }

        if (this.configService.get<boolean>('$base.turnOnSendEmailNotificationInRegister')) {
            userProfile.emailAgree = true;
        }

        if (userProfile?.phoneCode && !userProfile?.phoneNumber) {
            userProfile.phoneCode = '';
        }

        const response = this.dataService.request('user/createProfile', userProfile as any);
        this.logService.sendLog({code: '1.1.25'});
        this.sendFlogAfterFastRegistration();
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
        return this.dataService.request('user/registrationComplete', {code});
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
                    success: 'PROFILE_UPDATE',
                    fail: 'PROFILE_UPDATE_ERROR',
                },
            }, requestParams);

            if (response.data?.result) {
                _merge(this.profile.data, updates);
                this.userProfile$.next(this.userProfile);
            }

            return response;
        } catch (error) {
            return error;
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
            const explanationStart = this.translate.instant(gettext('You are under the age of'));
            const legalAge = this.configService.get<number>('$base.profile.legalAge');
            const explanationFinal = this.translate.instant(gettext('age_end'));

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
        return this.dataService.request('user/restoreNewPassword', params);
    }

    public validateRestoreCode(code: string = ''): Promise<IIndexing<any>> {
        const params = {action: 'checkRestoreCode', code};
        return this.dataService.request('user/validateRestoreCode', params);
    }

    public async setNewPassword(password: string, newPassword: string): Promise<TSetNewPasswordRes> {
        const params = {password, newPassword};
        const response: TSetNewPasswordRes = await this.dataService.request('user/newPassword', params);

        return response;
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

    public finishRegistration(): void {

        const isFastRegistration = this.configService.get<number>('appConfig.siteconfig.fastRegistration');
        const hideEmailExistence = this.configService.get<boolean>('appConfig.hideEmailExistence');
        const message = [
            gettext('Your account has been registered.'),
        ];

        if (isFastRegistration) {
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
            this.modalService.hideModal('signup');
        } else if (this.modalService.getActiveModal('login')) {
            this.modalService.hideModal('login');
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
        const legalAge: number = this.configService.get('$base.profile.legalAge');
        return DateTime.utc(+birthYear, +birthMonth, +birthDay)
            .diffNow('years')
            .years * -1 >= legalAge;
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

    private async fetchUserInfo(): Promise<void> {
        try {
            await this.dataService.request('user/userInfo');
        } catch (error) {
            //
        }
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
        const isFastRegistration = this.configService.get<number>('appConfig.siteconfig.fastRegistration');

        if (isFastRegistration) {
            this.userInfoHandler = this.eventService.subscribe({
                name: 'USER_INFO',
            }, (info: IData) => {

                if (info?.code === 200) {
                    this.logService.sendLog({code: '1.1.28'});
                } else {
                    this.logService.sendLog({code: '1.1.27'});
                }
                this.userInfoHandler.unsubscribe();
            });
        }
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
                success: 'LOGIN',
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
            name: 'createProfile',
            system: 'user',
            url: '/profiles',
            type: 'POST',
            events: {
                success: 'PROFILE_CREATE',
                fail: 'PROFILE_CREATE_ERROR',
            },
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
        if (!this.configService.get<IMGAConfig>('$modules.core.components["wlc-license"].mga')) {
            return;
        }

        if (!this.idleService) {
            this.idleService = await this.injectionService
                .getService<IdleService>('user.idle-service');
        }
        this.idleService.init();
    }

}
