import {Injectable} from '@angular/core';
import {
    BehaviorSubject,
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
} from 'wlc-engine/modules/user';
import {TMessageType} from 'wlc-engine/modules/core/components/message/message.params';
import {
    ITwoFactorAuthResponse,
    ITwoFactorAuthUserInfo,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/interfaces/two-factor-auth.interface';

@Injectable({providedIn: 'root'})
export class TwoFactorAuthService {

    public secretCode: ITwoFactorAuthResponse;
    protected userService: UserService;

    constructor(
        protected eventService: EventService,
        protected logService: LogService,
        protected injectionService: InjectionService,
        protected dataService: DataService,
        protected configService: ConfigService,
        protected modalService: ModalService,
    ) {}

    /**
     * return enabled2FAGoogle and notify2FAGoogle from UserInfo
     *
     * @return {ITwoFactorAuthUserInfo}
     */
    public async getTwoFactorAuthUserInfo(): Promise<ITwoFactorAuthUserInfo> {
        await this.configService.ready;
        if (!this.userService) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }
        this.userService.fetchUserInfo();
        const userInfo: UserInfo = await firstValueFrom(
            this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
                .pipe(
                    first((userInfo: UserInfo): boolean => !!userInfo?.idUser),
                ),
        );
        const data: ITwoFactorAuthUserInfo = {
            enabled2FAGoogle: userInfo.enabled2FAGoogle,
            notify2FAGoogle: userInfo.notify2FAGoogle,
        };
        return data;
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
     * open modal two-factor-auth-info
     *
     */
    public openModalEnable(): void {
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
                await this.disable2faGoogle();
            },
            dismissAll: true,
        });
    }

    /**
     * 2FA enable request
     *
     * @param {string} code2FA
     */
    public async enable2faGoogle(code2FA: string): Promise<boolean> {
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
     * 2FA auth request
     *
     * @param {string} authKey
     * @param {string} code2FA
     */
    public async login2faGoogle(authKey: string, code2FA: string): Promise<boolean> {
        const data = {authKey, code2FA};
        try {
            await this.dataService.request(
                {
                    name: 'authByGoogle2fa',
                    system: 'twoFactorAuth',
                    url: '/authBy/google2fa',
                    type: 'POST',
                },
                data,
            );
            this.eventService.emit({name: 'LOGIN'});
            this.hideActiveModal('two-factor-auth-code');
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
    private async disable2faGoogle(): Promise<void> {
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
}
