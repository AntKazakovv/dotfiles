import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {
    Subscription,
    BehaviorSubject,
} from 'rxjs';

import {
    DataService,
    EventService,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import {
    IIndexing,
    IUserInfo,
    IUserProfile,
} from 'wlc-engine/modules/core/system/interfaces';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {UserInfo} from 'wlc-engine/modules/user/system/models/info.model';
import {UserProfile} from '../../models/profile.model';
import {ConfigService} from 'wlc-engine/modules/core';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';
import {filter} from 'rxjs/operators';

import {
    each as _each,
    assign as _assign,
    keys as _keys,
} from 'lodash-es';

//данные для входа 'maksim.shahov@softgamings.com', 'Test123!'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    public isAuthenticated: boolean;

    protected info: UserInfo;
    protected profile: UserProfile;
    protected userInfoHandler: Subscription;
    private useSocketLoyalty: boolean = false;

    public get userInfo(): UserInfo {
        if (this.info.dataReady) {
            return this.info;
        } else {
            return null;
        }
    }

    public get userProfile(): UserProfile {
        if (this.profile.dataReady) {
            return this.profile;
        } else {
            return null;
        }
    }

    public userProfile$: BehaviorSubject<UserProfile> = new BehaviorSubject(null);
    public userInfo$: BehaviorSubject<UserInfo> = new BehaviorSubject(null);

    constructor(
        public translate: TranslateService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private modalService: ModalService,
        private stateService: StateService,
    ) {
        this.isAuthenticated = this.configService.get('$user.isAuthenticated');

        this.registerMethods();
        this.info = new UserInfo(translate, eventService);
        this.profile = new UserProfile();

        this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IData) => {
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
            this.profile.data = profile.data;
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
            this.fetchUserProfile().then(() => {
                this.fetchUserInfo();
                this.startUserInfoFetcher();
            });
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuthenticated = false;
            this.configService.set({name: '$user.isAuthenticated', value: false});
            stateService.go('app.home', {
                locale: this.translate.currentLang,
            });
            this.stopUserInfoFetcher();
        });

        this.eventService.subscribe({
            name: 'USER_STATUS_DISABLE',
        }, () => {
            this.logout();
        });

        if (this.isAuthenticated) {
            this.fetchUserProfile().then(() => {
                this.fetchUserInfo();
                this.startUserInfoFetcher();
            });
        }
    }

    public setProfileData(formData): void {
        _each(_keys(formData), (field) => {
            if (field === 'password') {
                this.profile.data.passwordRepeat = formData[field];
            }

            this.profile.data[field] = formData[field];
        });

        this.userProfile$.next(this.profile);
    }

    public registration(formData): Promise<IIndexing<any>> {
        return this.dataService.request('user/userRegistration', formData);
    }

    public login(login: string, password: string): Promise<IIndexing<any>> {
        const params = {login, password};
        return this.dataService.request('user/userLogin', params);
    }

    public logout(): void {
        this.dataService.request('user/userLogout');
    }

    public createUserProfile(userProfile: IUserProfile): Promise<IIndexing<any>> {
        return this.dataService.request('user/createProfile', userProfile as any);
    }

    public registrationComplete(code: string): Promise<IIndexing<any>> {
        return this.dataService.request('user/registrationComplete', {code});
    }

    public async updateProfile(profile: IUserProfile, updatePartial: boolean = false): Promise<true | IIndexing<any>> {

        try {
            const response: any = await this.dataService.request({
                name: 'updateProfile',
                system: 'user',
                url: '/profiles',
                type: updatePartial ? 'PATCH' : 'PUT',
                events: {
                    success: 'PROFILE_UPDATE',
                    fail: 'PROFILE_UPDATE_ERROR',
                },
            }, updatePartial ? profile : _assign({}, this.profile.data, profile));

            if (response.data?.result) {
                _assign(this.profile.data, profile);
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

    public updateLanguage(): void {
        this.dataService.request('user/updateLanguage');
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
            this.modalService.closeModal('login');
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    message: error.errors,
                },
            });

            this.logService.sendLog({code: '1.2.0', data: error});
        }
    }

    private fetchUserInfo(): void {
        this.dataService.request('user/userInfo');
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
            // events: {
            //     success: 'USER_INFO',
            //     fail: 'USER_INFO_ERROR',
            // },
        });
    }
}
