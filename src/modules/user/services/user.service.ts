import {Injectable} from '@angular/core';
import {IIndexing, IUserInfo, IUserProfile} from 'wlc-engine/interfaces';
import {AppModule} from 'wlc-engine/modules/app.module';
import {DataService, EventService} from 'wlc-engine/modules/core/services';
import {TranslateService} from '@ngx-translate/core';
import {UserInfo} from 'wlc-engine/modules/user/models/info.model';
import {IRequestMethod, RestMethodType} from 'wlc-engine/modules/core/services/data/data.service';
import {UserProfile} from '../models/profile.model';
import {ConfigService} from 'wlc-engine/modules/core';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
    forEach as _forEach,
} from 'lodash';


//данные для входа 'maksim.shahov@softgamings.com', 'Test123!'

@Injectable({
    providedIn: 'root',
})
export class UserService {
    static instance: UserService;
    public isAuthenticated: boolean = false;

    protected info: UserInfo;
    protected profile: UserProfile;
    protected userInfoHandler: any;

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

    constructor(
        public translate: TranslateService,
        protected dataService: DataService,
        protected eventService: EventService,
        protected app: AppModule,
        protected configService: ConfigService,
    ) {
        // TODO: удалить, временное решение для костумного валидатора
        UserService.instance = this;

        this.configService.set({name: '$user.isAuthenticated', value: false});
        this.registerMethods();
        this.info = new UserInfo(translate, eventService);
        this.profile = new UserProfile();
        if (app.initialPath?.message) {
            switch (app.initialPath.message) {
                case 'SET_NEW_PASSWORD':
                //TODO
                    break;
                case 'COMPLETE_REGISTRATION':
                    if (app.initialPath.code) {
                        this.registrationComplete(app.initialPath.code);
                    } else {
                    //TODO modal
                    }
                    break;
                case 'EMAIL_UNSUBSCRIBE':
                //TODO
                    break;
                case 'FINALIZE_SOCIAL_CONNECT':
                //TODO
                    break;
                // case 'FINALIZE_SOCIAL_REGISTRATION':
                //     UserSocialRegisterService.init();
                //     break;
            }
        }

        this.eventService.subscribe({
            name: 'USER_INFO',
        }, (info: IUserInfo) => {
            this.info.data = info;
        });

        this.eventService.subscribe({
            name: 'USER_PROFILE',
        }, (profile: IUserProfile) => {
            this.profile.data = profile;
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuthenticated = true;
            this.configService.set({name: '$user.isAuthenticated', value: true});
            this.fetchUserInfo();
            this.startUserInfoFetcher();
            this.fetchUserProfile();
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuthenticated = false;
            this.configService.set({name: '$user.isAuthenticated', value: false});
            this.stopUserInfoFetcher();
        });

        this.eventService.subscribe({
            name: 'USER_STATUS_DISABLE',
        }, () => {
            this.logout();
        });
    }

    public async registration(formData): Promise<void> {
        const response: any = await this.request('user/userRegistration', 'REGISTRATION', 'REGISTRATION_ERROR', formData);
        if (response.result) {
            this.setProfileData(formData);
            await this.createUserProfile(this.profile.data);
            if (this.isFastRegistration) {
                // fastRegistration
            } else {
                // registrationComplete
            }
        } else {
            _forEach(response.errors, (error) => {
                console.error(error);
            });
        }
    }

    public login(login: string, password: string): void {
        const params = {login, password};
        this.request('user/userLogin', 'LOGIN', 'LOGIN_ERROR', params);
    }

    public logout(): void {
        this.request('user/userLogout', 'LOGOUT', 'LOGOUT_ERROR');
    }

    public createUserProfile(userProfile: IUserProfile): void {
        this.request('user/createProfile', 'PROFILE_CREATE', 'PROFILE_CREATE_ERROR', userProfile as any);
    }

    public registrationComplete(code: string): void {
        this.request('user/registrationComplete', 'REGISTER', 'REGISTER_ERROR', {code});
    }

    public updateProfile(profile: IUserProfile, updatePartial: boolean = false): void {
        //TODO update
    }

    public sendPasswordRestore(email: string, reCaptchaToken?: string): void {
        const params: { email: string, reCaptchaToken?: string } = {
            email: email,
        };

        if (reCaptchaToken) {
            params.reCaptchaToken = reCaptchaToken;
        }

        this.request('user/passwordRestore', 'PROFILE_RESTORE', 'PROFILE_RESTORE_ERROR', params);
    }

    public restoreNewPassword(newPassword: string, repeatPassword: string, code: string): void {
        const params = {newPassword, repeatPassword, code};
        this.request('user/restoreNewPassword', 'PROFILE_PASSWORD', 'PROFILE_PASSWORD_ERROR', params);
    }

    public validateRestoreCode(code: string = ''): void {
        const params = {action: 'checkRestoreCode', code};
        this.request('user/validateRestoreCode', 'VALIDATE_RESTORE_CODE', 'VALIDATE_RESTORE_CODE_ERROR', params);
    }

    public setNewPassword(password: string, newPassword: string): void {
        const params = {password, newPassword};
        this.request('user/newPassword', 'NEW_PASSWORD', 'NEW_PASSWORD_ERROR', params);
    }

    public changePhone(phoneCode: string, phoneNumber: string): void {
        const params = {phoneCode, phoneNumber};
        this.request('user/updatePhone', 'UPDATE_PHONE', 'UPDATE_PHONE_ERROR', params);
    }

    public phoneUnique(phone: string, code: string): void {
        const params = {phone, code};
        this.request('user/phoneUnique', 'PHONE_UNIQUE', 'PHONE_UNIQUE_ERROR', params);
    }

    public changeEmail(email: string, currentPassword?: string, code?: string): void {
        const params: { email: string; currentPassword?: string; code?: string } = {email};

        if (currentPassword) {
            params.currentPassword = currentPassword;
        }

        if (code) {
            params.code = code;
        }

        this.request('user/updateEmail', 'UPDATE_EMAIL', 'UPDATE_EMAIL_ERROR', params);
    }

    public emailUnique(email: string): Promise<any> {
        return this.request('user/emailUnique', 'EMAIL_UNIQUE', 'EMAIL_UNIQUE_ERROR', {email});
    }

    public loginUnique(login: string): void {
        this.request('user/loginUnique', 'LOGIN_UNIQUE', 'LOGIN_UNIQUE_ERROR', {login});
    }

    public updateLogin(login: string): void {
        this.request('user/updateLogin', 'LOGIN_UPDATE', 'LOGIN_UPDATE_ERROR', {login});
    }

    public updateLanguage(): void {
        this.request('user/updateLanguage', 'LANGUAGE_UPDATE', 'LANGUAGE_UPDATE_ERROR');
    }

    public disableProfile(): void {
        this.request('user/disableProfile', 'DISABLE_PROFILE', 'DISABLE_PROFILE_ERROR');
    }

    public fetchUserProfile(): void {
        this.request('user/userProfile', 'USER_PROFILE', 'USER_PROFILE_ERROR');
    }

    protected fetchUserInfo(): void {
        this.request('user/userInfo', 'USER_INFO', 'USER_INFO_ERROR');
    }

    protected startUserInfoFetcher(): void {
        this.userInfoHandler = this.dataService.subscribe('user/userInfo', (userInfo) => {
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

    protected stopUserInfoFetcher(): void {
        this.userInfoHandler.unsubscribe();
    }

    protected async request<T>(
        name: string,
        event: string,
        eventError: string,
        params: IIndexing<string> = {},
    ): Promise<T> {
        try {
            const data: T = (await this.dataService.request(name, params)).data as T;
            this.eventService.emit({
                name: event,
                data: data,
            });
            return data;
        } catch (error) {
            this.eventService.emit({
                name: eventError,
                data: error,
            });
        }
    }

    protected regMethod(
        name: string,
        url: string,
        type: RestMethodType,
        period?: number,
    ): void {
        const params: IRequestMethod = {name, system: 'user', url, type};

        if (period) {
            params.period = period;
        }

        this.dataService.registerMethod(params);
    }

    protected registerMethods(): void {
        this.regMethod('userRegistration', '/validate/user-register', 'POST');
        this.regMethod('userLogin', '/auth', 'PUT');
        this.regMethod('userLogout', '/auth', 'DELETE');
        this.regMethod('createProfile', '/profiles', 'POST');
        this.regMethod('registrationComplete', '/profiles', 'PATCH');
        this.regMethod('passwordRestore', '/userPassword', 'POST');
        this.regMethod('restoreNewPassword', '/userPassword', 'PUT');
        this.regMethod('validateRestoreCode', '/userPassword', 'GET');
        this.regMethod('newPassword', '/userPassword', 'PATCH');
        this.regMethod('updatePhone', '/profiles/phone', 'POST');
        this.regMethod('phoneUnique', '/profiles/phone', 'PUT');
        this.regMethod('updateEmail', '/profiles/email', 'POST');
        this.regMethod('emailUnique', '/profiles/email', 'PUT');
        this.regMethod('loginUnique', '/profiles/login', 'PUT');
        this.regMethod('updateLogin', '/profiles/login', 'POST');
        this.regMethod('updateLanguage', '/profiles/language', 'PATCH');
        this.regMethod('disableProfile', '/profiles/disable', 'PUT');
        this.regMethod('userProfile', '/profiles', 'GET');
        this.regMethod('userInfo', '/userInfo', 'GET', 10000);
    }

    protected setProfileData(formData): void {
        this.profile.data.email = formData.data.email;
        this.profile.data.password = formData.data.password;
        this.profile.data.passwordRepeat = formData.data.password;
        this.profile.data.currency = formData.data.currency;
    }

    protected get isFastRegistration(): number {
        return this.configService.get<number>('appConfig.siteconfig.fastRegistration');
    }
}
