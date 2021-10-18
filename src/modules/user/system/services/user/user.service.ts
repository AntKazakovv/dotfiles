import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {DateTime} from 'luxon';

import {
    Subscription,
    BehaviorSubject,
} from 'rxjs';

import {
    filter,
    first,
} from 'rxjs/operators';

import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService, IEvent} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {DataService} from 'wlc-engine/modules/core/system/services/data/data.service';
import {IUserProfile} from 'wlc-engine/modules/core/system/interfaces/user.interface';
import {IRedirect} from 'wlc-engine/modules/core/system/interfaces/core.interface';

import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {LimitationService} from 'wlc-engine/modules/user/system/services/limitation/limitation.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {IValidateData} from 'wlc-engine/modules/user/system/classes/user-actions-abstract.class';

import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _keys from 'lodash-es/keys';
import _set from 'lodash-es/set';

export enum LanguageChangeEvents {
    ChangeLanguage = 'CHANGE_LANGUAGE'
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public isAuthenticated: boolean;

    protected info: UserInfo;
    protected profile: UserProfile;
    protected userInfoHandler: Subscription;

    public get userInfo(): UserInfo {
        if (this.info.dataReady) {
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

    constructor(
        public translate: TranslateService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
        private injectionService: InjectionService,
        private stateService: StateService,
    ) {
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
            translate,
            eventService,
        );
        this.profile = new UserProfile({service: 'UserService', method: 'constructor'});

        this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData) => {
            if (info?.code === 401) {
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
                if (!this.limitationService) {
                    this.limitationService = await this.injectionService
                        .getService<LimitationService>('user.limitation-service');
                }
                this.limitationService.initRealityChecker(this.userProfile$, true);
                this.fetchUserInfo();
                this.startUserInfoFetcher();
            });
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuthenticated = false;
            this.configService.set({name: '$user.isAuthenticated', value: false});
            this.stateService.go('app.home', {
                locale: this.translate.currentLang,
            });
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
        });

        this.eventService.subscribe({
            name: 'USER_STATUS_DISABLE',
        }, () => {
            this.logout();
        });

        if (this.isAuthenticated) {
            this.fetchUserProfile().then(async () => {
                if (!this.limitationService) {
                    this.limitationService = await this.injectionService
                        .getService<LimitationService>('user.limitation-service');
                }
                this.limitationService.initRealityChecker(this.userProfile$);
                this.fetchUserInfo();
                this.startUserInfoFetcher();
            });
        }
    }

    public setProfileData(formData: IUserProfile): void {
        _each(_keys(formData), (field) => {
            this.profile.data[field] = formData[field];
        });

        this.userProfile$.next(this.profile);
    }

    public validateRegistration(regData: IValidateData): Promise<IIndexing<any>> {
        return this.dataService.request('user/userRegistration', regData);
    }

    public login(login: string, password: string): Promise<IIndexing<any>> {
        const response = this.dataService.request<IIndexing<any>>('user/userLogin', {login, password});
        this.logService.sendLog({code: '1.2.5'});
        response.catch((error: unknown) => {
            this.logService.sendRequestLog({
                coreLog: {code: '1.2.3'},
                networkLog: {code: '1.2.4'},
                from: {
                    service: 'UserService',
                    method: 'login',
                },
                responseData: error,
            });
        });
        return response;
    }

    public logout(): void {
        this.dataService.request('user/userLogout');
    }

    public createUserProfile(userProfile: IUserProfile): Promise<IIndexing<any>> {

        if (this.configService.get('$base.profile.limitations.use')
            && !userProfile.extProfile?.realityCheckTime) {
            _set(userProfile, 'extProfile.realityCheckTime', 30);
        }

        if (this.configService.get<boolean>('$base.turnOnSendEmailNotificationInRegister')) {
            userProfile.emailAgree = true;
        }

        const response = this.dataService.request('user/createProfile', userProfile as any);
        this.logService.sendLog({code: '1.1.25'});
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

    public async updateProfile(
        profile: IUserProfile, updatePartial: boolean = false, isAfterDepositWithdraw?: boolean,
    ): Promise<true | IIndexing<any>> {
        const params = updatePartial
            ? _assign({}, profile, isAfterDepositWithdraw ? {isAfterDepositWithdraw} : {})
            : _assign({}, this.profile.data, profile);

        try {
            const response: IData = await this.dataService.request({
                name: 'updateProfile',
                system: 'user',
                url: '/profiles',
                type: updatePartial ? 'PATCH' : 'PUT',
                events: {
                    success: 'PROFILE_UPDATE',
                    fail: 'PROFILE_UPDATE_ERROR',
                },
            }, params);

            if (response.data?.result) {
                _assign(this.profile.data, profile);
                this.userProfile$.next(this.userProfile);
                return true;
            } else {
                return response;
            }
        } catch (error) {
            return error;
        }
    }

    public sendPasswordRestore(email: string, reCaptchaToken?: string): Promise<IIndexing<any>> {
        const params: {email: string, reCaptchaToken?: string} = {
            email: email,
        };

        if (reCaptchaToken) {
            params.reCaptchaToken = reCaptchaToken;
        }

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

    public setNewPassword(password: string, newPassword: string): Promise<IIndexing<any>> {
        const params = {password, newPassword};
        return this.dataService.request('user/newPassword', params);
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

    public emailUnique(email: string): Promise<any> {
        return this.dataService.request('user/emailUnique', {email});
    }

    public loginUnique(login: string): void {
        this.dataService.request('user/loginUnique', {login});
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

    public async loginRequest(loginParam: string, password: string): Promise<void> {
        try {
            await this.login(loginParam, password);
            this.modalService.hideModal('login');
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Login error'),
                    message: error.errors,
                    wlcElement: 'notification_login-error',
                },
            });
        }
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
                this.registrationRedirect();
            }
        } else {
            message.push(gettext('Please complete registration using link in e-mail'));
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
    public checkUserAge({birthDay, birthYear, birthMonth}: IUserProfile): boolean {
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
            if (!userInfo) {
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

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'userRegistration',
            url: '/validate/user-register',
            type: 'POST',
            system: 'user',
            events: {
                success: 'REGISTRATION',
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
            events: {
                success: 'LOGOUT',
                fail: 'LOGOUT_ERROR',
            },
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
                success: 'REGISTER',
                fail: 'REGISTER_ERROR',
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

    }
}
