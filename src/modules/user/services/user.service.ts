import {Injectable} from '@angular/core';
import {IUserInfo, IUserProfile} from 'wlc-engine/interfaces';
import {AppModule} from 'wlc-engine/modules/app.module';
import {DataService, EventService} from 'wlc-engine/modules/core/services';
import {TranslateService} from '@ngx-translate/core';
import {UserInfo} from 'wlc-engine/modules/user/models/info.model';
import {IData} from 'wlc-engine/modules/core/services/data/data.service';

import {
    get as _get,
    reduce as _reduce,
    toString as _toString,
} from 'lodash';
import {UserProfile} from '../models/profile.model';

//данные для входа 'maksim.shahov@softgamings.com', 'Test123!'

@Injectable()
export class UserService {

    public isAuthenticated: boolean = false;

    protected user: UserInfo;
    protected profile: UserProfile;
    protected userInfoHendler: any;

    public get userInfo(): UserInfo {
        if (this.user.dataReady) {
            return this.user;
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
        protected dataService: DataService,
        protected eventService: EventService,
        public translate: TranslateService,
        protected app: AppModule,
    ) {
        this.user = new UserInfo(translate);
        if(app.initialPath?.message) {
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
    }

    public async login(login: string, password: string): Promise<void> {
        try {
            await this.dataService.request({
                name: 'userLogin',
                system: 'user',
                url: '/auth',
                type: 'PUT',
            }, {login, password});
            this.isAuthenticated = true;
            this.eventService.emit({
                name: 'LOGIN'
            });
            this.setUserInfo();
        } catch (error) {
            this.eventService.emit({
                name: 'LOGIN_ERROR',
                data: error
            });
        }
    }

    public async logout(): Promise<void> {
        try {
            await this.dataService.request({
                name: 'userLogout',
                system: 'user',
                url: '/auth',
                type: 'DELETE'
            });
            this.isAuthenticated = false;
            this.userInfoHendler.unsubscribe();
            this.eventService.emit({
                name: 'LOGOUT'
            });
        } catch (error) {
            this.eventService.emit({
                name: 'LOGOUT_ERROR',
                data: error
            });
            //TODO modal
        }
    }

    public async fetchUserInfo(): Promise<void> {
    }

    public async createUserProfile(userProfile: IUserProfile): Promise<void> {
        try {
            await this.dataService.request({
                name: 'createProfile',
                system: 'user',
                url: '/profiles',
                type: 'POST',
            }, userProfile as any);
            this.eventService.emit({
                name: 'PROFILE_CREATE'
            });
            //TODO modal
        } catch (error) {
            this.eventService.emit({
                name: 'PROFILE_CREATE_ERROR',
                data: error
            });
            //TODO modal
        }
    }

    public async registrationComplete(code: string): Promise<void> {
        try {
            await this.dataService.request({
                name: 'createProfile',
                system: 'user',
                url: '/profiles',
                type: 'PATCH',
            }, {code});
            this.eventService.emit({
                name: 'REGISTER'
            });
            //TODO modal
        } catch (error) {
            this.eventService.emit({
                name: 'REGISTER_ERROR',
                data: error
            });
            //TODO modal
        }
    }

    public async updateProfile(profile: IUserProfile, updatePartial: boolean = false) {
        //TODO update
    }

    //*************************************************************************************************** */




    public sendPasswordRestore(email: string, reCaptchaToken?: string) {
    }

    public restoreNewPassword(newPassword: string, repeatPassword: string, code: string) {
    }

    public getUserCurrency(filterAlias?: boolean) {
    }

    public getUserLevels() {
    }

    public validateRestoreCode(code: string = '') {
    }

    public setNewPassword(password: string, newPassword: string) {
    }

    public changePhone(fields: {phoneCode: string; phoneNumber: string;}) {
    }

    public changeEmail(fields: {email: string; currentPassword?: string; code?: string}) {
    }

    public emailUnique(email: string) {
    }

    public phoneUnique(phone: string, code: string) {
    }

    public loginUnique(login: string) {
    }

    public updateLanguage() {
    }

    public async fetchUserProfile() {
    }

    public stopUserInfoFetcher(): void {
    }

    public startUserInfoFetcher(): void {
    }

    public disableProfile() {
    }


    //*************************************************************************************************** */

    protected async setUserInfo(): Promise<void> {
        this.dataService.registerMethod({
            name: 'userInfo',
            system: 'user',
            url: '/userInfo',
            type: 'GET',
            period: 10000,
        });

        try{
            this.checkUser((await this.dataService.request('user/userInfo')).data as IUserInfo);
        } catch(error) {
            this.eventService.emit({
                name: 'USER_INFO_ERROR',
                data: error
            });
        }

        this.userInfoHendler = this.dataService.subscribe('user/userInfo', (userInfo) => {
            this.checkUser(userInfo.data as IUserInfo);
        });
    }

    protected checkUser(userInfo: IUserInfo): void {
        if (userInfo.status) {
            this.user.setData(userInfo);
            this.eventService.emit({
                name: 'USER_INFO',
                data: userInfo
            });
        } else {
            this.user.setData(null);
            this.logout();
        }
    }

    protected async setUserProfile(): Promise<void> {
        try{
            this.profile.setData((await this.dataService.request({
                name: 'userProfile',
                system: 'user',
                url: '/profiles',
                type: 'GET',
            })).data as IUserProfile);
            this.eventService.emit({
                name: 'USER_PROFILE',
                data: this.userProfile
            });
        } catch(error) {
            this.eventService.emit({
                name: 'USER_PROFILE_ERROR',
                data: error
            });
        }
    }


}
