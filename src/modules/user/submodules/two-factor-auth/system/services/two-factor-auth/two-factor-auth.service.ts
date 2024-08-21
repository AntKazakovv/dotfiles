import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
    Subscription,
    filter,
    first,
    firstValueFrom,
} from 'rxjs';

import _each from 'lodash-es/each';
import _isArray from 'lodash-es/isArray';
import _isEmpty from 'lodash-es/isEmpty';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import _toString from 'lodash-es/toString';

import {
    DataService,
    EventService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
    InjectionService,
    ConfigService,
    IData,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserService,
    TermsAcceptService,
} from 'wlc-engine/modules/user';
import {TMessageType} from 'wlc-engine/modules/core/components/message/message.params';
import {
    ITwoFactorAuthResponse,
    ITwoFactorEnterCodeData,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/interfaces/two-factor-auth.interface';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

@Injectable({providedIn: 'root'})
export class TwoFactorAuthService {

    public secretCode: ITwoFactorAuthResponse;
    private userService: UserService;
    private userInfoSubscribe: Subscription;

    constructor(
        private eventService: EventService,
        private logService: LogService,
        private injectionService: InjectionService,
        private dataService: DataService,
        private configService: ConfigService,
        private modalService: ModalService,
    ) {}

    /**
     * return UserInfo
     *
     * @return {UserInfo}
     */
    public async getUserInfo(): Promise<UserInfo> {
        await this.configService.ready;
        if (!this.userService) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }
        this.userService.fetchUserInfo();
        return await firstValueFrom<UserInfo>(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );
    }

    /**
     * open modal two-factor-auth-scan
     *
     */
    public async openModalScan(): Promise<void> {
        const secretCode = await this.getTwoFactorSecretCode();
        this.secretCode = secretCode;
        this.modalService.showModal('two-factor-auth-scan', {secretCode: secretCode});
    }

    /**
     * show notification two factor auth google
     *
     */
    public showNotification2FAGoogle(userInfo: UserInfo): void {
        if (this.shouldModalBeShown(userInfo)) {
            this.modalService.showModal('two-factor-auth-info');
        } else {
            this.listenUserInfo();
        }
    }

    /**
     * open modal two-factor-auth-info
     *
     */
    public async openModalEnable(): Promise<void> {
        const userInfo = await this.getUserInfo();
        if (!userInfo.isTermsActual) {
            const termsAcceptService = await this.injectionService
                .getService<TermsAcceptService>('user.terms-accept-service');
            const reason = await termsAcceptService.openModalAndCheckReason();
            if (reason !== 'accept') {
                this.showNotification(
                    gettext('You must accept the terms and conditions to complete this action.'),
                    'error',
                );
                return;
            }
        }
        this.modalService.showModal('two-factor-auth-info');
    }

    /**
     * open modal two-factor-auth-disable
     *
     */
    public openModalDisable(callback: () => void): void {
        this.modalService.showModal({
            id: 'two-factor-auth-disable',
            modifier: 'two-factor-auth-disable',
            componentName: 'two-factor-auth.wlc-two-factor-auth-disable',
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
            onConfirm: async () => {
                callback();
                await this.disable2FAGoogle();
            },
            dismissAll: true,
        });
    }

    /**
     * 2FA enable request
     *
     * @param {string} code2FA
     */
    public async enable2FAGoogle(code2FA: string): Promise<boolean> {
        try {
            await this.dataService.request(
                {
                    name: 'auth2faGooglePost',
                    system: 'twoFactorAuth',
                    url: '/auth/2fa/google',
                    type: 'POST',
                },
                {code2FA},
            );
            this.showNotification(
                gettext('The authenticator is successfully connected'),
                'success',
            );
            this.eventService.emit({name: 'ENABLE_2FA_GOOGLE'});
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }
            this.userService.fetchUserInfo();
            this.hideActiveModal('two-factor-auth-finish');
            UserHelper.showInformationModal(
                this.modalService,
                gettext('The authenticator is successfully connected'),
            );
            return true;
        } catch (error) {
            const messages: string[] = [];
            if (!_isEmpty(error.errors) && (_isArray(error.errors) || _isObject(error.errors))) {
                _each(error.errors, (error: unknown): void => {
                    messages.push(_toString((error)));
                });
            } else if (_isString(error.errors)) {
                messages.push(error.errors);
            }
            this.showNotification(
                messages,
                'error',
            );
            this.logService.sendLog({code: '1.10.1', data: error});
            return false;
        }
    }

    /**
     * enter 2FA google code request
     *
     * @param {string} authKey
     * @param {string} code2FA
     * @param {number} responseCode
     */
    public async enter2FAGoogleCode(authKey: string, code2FA: string, responseCode: number): Promise<boolean> {
        const data: ITwoFactorEnterCodeData = {authKey, code2FA};
        try {
            switch (responseCode) {
                case 231:
                    if (!this.userService.isAuth$.getValue()
                        && this.configService.get<boolean>('$base.site.useXNonce')
                    ) {
                        this.dataService.setNonceToLocalStorage();
                    }

                    await this.authRequest(data);
                    break;
                case 232:
                    await this.restoreNewPasswordRequest(data);
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
                    break;
            }
            this.eventService.emit({name: 'LOGIN'});
            this.hideActiveModal('two-factor-auth-code');
            return true;
        } catch (error) {
            if (responseCode === 231
                && !this.userService.isAuth$.getValue()
                && this.configService.get<boolean>('$base.site.useXNonce')
            ) {
                this.dataService.deleteNonceFromLocalStorage();
            }

            const messages: string[] = [];
            if (!_isEmpty(error.errors) && (_isArray(error.errors) || _isObject(error.errors))) {
                _each(error.errors, (error: unknown): void => {
                    messages.push(_toString((error)));
                });
            } else if (_isString(error.errors)) {
                messages.push(error.errors);
            }
            this.showNotification(
                messages,
                'error',
            );
            this.logService.sendLog({code: '1.10.2', data: error});
            if (error.code == 431) {
                this.hideActiveModal('two-factor-auth-code');
                this.modalService.showModal('login');
            }
            return false;
        }
    }

    /**
     * 2FA notification disable request
     *
     */
    public async disableNotification(): Promise<void> {
        try {
            await this.dataService.request({
                name: 'auth2faGooglePatch',
                system: 'twoFactorAuth',
                url: '/auth/2fa/google',
                type: 'PATCH',
            });
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }
            this.userService.fetchUserInfo();
            this.showNotification(
                gettext('Notifications have been disabled successfully'),
                'success',
            );
        } catch (error) {
            this.logService.sendLog({code: '1.10.3', data: error});
        }
    }

    /**
     * 2FA disable request
     *
     */
    private async disable2FAGoogle(): Promise<void> {
        try {
            await this.dataService.request({
                name: 'auth2faGoogleDel',
                system: 'twoFactorAuth',
                url: '/auth/2fa/google',
                type: 'DELETE',
            });
            if (!this.userService) {
                this.userService = await this.injectionService.getService<UserService>('user.user-service');
            }
            this.userService.fetchUserInfo();
            this.showNotification(
                gettext('Authentication is disabled'),
                'warning',
            );
        } catch (error) {
            this.logService.sendLog({code: '1.10.4', data: error});
        }
    }

    /**
     * 2FA get secret code request
     *
     */
    private async getTwoFactorSecretCode(): Promise<ITwoFactorAuthResponse> {
        try {
            const response = await this.dataService.request<IData>({
                name: 'auth2faGooglePut',
                system: 'twoFactorAuth',
                url: '/auth/2fa/google',
                type: 'PUT',
            });
            return response.data;
        } catch (error) {
            this.logService.sendLog({code: '1.10.0', data: error});
        }
    }

    private hideActiveModal(name: string): void {
        if (this.modalService.getActiveModal(name)) {
            this.modalService.hideModal(name);
        }
    }

    private showNotification(message: string | string[], type: TMessageType): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type,
                title: gettext('Google Authenticator'),
                message,
                wlcElement: type ? 'google2fa-' + type : null,
            },
        });
    }

    private listenUserInfo(): void {
        this.userInfoSubscribe = this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(filter((userInfo: UserInfo): boolean => !!userInfo?.idUser))
            .subscribe((userInfo: UserInfo) => {
                if (this.shouldModalBeShown(userInfo)) {
                    this.userInfoSubscribe.unsubscribe();
                    this.modalService.showModal('two-factor-auth-info');
                }
            });
    }

    private shouldModalBeShown(userInfo: UserInfo): boolean {
        return userInfo.isTermsActual
            && !userInfo.blockByLocation
            && userInfo.notify2FAGoogle
            && !this.modalService.getActiveModal('two-factor-auth-info');
    }

    private async authRequest(data: ITwoFactorEnterCodeData): Promise<IData<any>> {
        return await this.dataService.request(
            {
                name: 'authByGoogle2fa',
                system: 'twoFactorAuth',
                url: '/authBy/google2fa',
                type: 'POST',
            },
            data,
        );
    }

    private async restoreNewPasswordRequest(data: ITwoFactorEnterCodeData): Promise<IData<any>> {
        return await this.dataService.request(
            {
                name: 'restoreNewPasswordByGoogle2fa',
                system: 'twoFactorAuth',
                url: '/userPassword/google2fa',
                type: 'PUT',
            },
            data,
        );
    }
}
