import {UIRouterGlobals} from '@uirouter/core';
import {Injectable} from '@angular/core';

import {
    NotificationEvents,
    IPushMessageParams,
    ConfigService,
    ModalService,
    LogService,
    IData,
    DataService,
    EventService,
    IUserProfile,
} from 'wlc-engine/modules/core';
import {
    ChosenBonusSetParams,
    ChosenBonusType,
} from 'wlc-engine/modules/bonuses';
import {
    ISocialAuthUrlResponse,
    IRegisterParams,
    ISocialConnectedList,
    ISocialUserDataResponse,
} from '../../interfaces';

import _isEmpty from 'lodash-es/isEmpty';
import _isString from 'lodash-es/isString';

@Injectable({providedIn: 'root'})
export class SocialService {

    protected socialRegisterData: Partial<IRegisterParams>;

    constructor(
        private dataService: DataService,
        private configService: ConfigService,
        private modalService: ModalService,
        private eventService: EventService,
        private logService: LogService,
        private uiRouter: UIRouterGlobals,
    ) {}

    /**
     * Gets social data and invoke modal window with registration form
     */
    public async continueRegistration(): Promise<void> {
        await this.configService.ready;

        try {
            this.socialRegisterData = (await this.getSocialData()).data;
            this.socialRegisterData.registrationBonus = this.configService.get<number>({
                name: 'socialRegBonus',
                storageType: 'localStorage',
            });
            this.configService.set({
                name: 'socialRegBonus',
                value: null,
                storageClear: 'localStorage',
            });

            this.modalService.showModal('social-register', {
                formData: this.socialRegisterData,
            });
        } catch (error) {
            this.logService.sendLog({code: '1.4.40', data: error});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),
                    message: [gettext('Error complete registration via social network, try later.')],
                },
            });
        }
    }

    /**
     * Completes social registration process
     * @param params request params
     */
    public async socialRegisterComplete(params: Partial<IUserProfile>): Promise<void> {
        try {
            await this.dataService.request(
                {
                    name: 'authSocialPut',
                    url: '/auth/social',
                    system: 'user',
                    type: 'PUT',
                    events: {
                        success: 'SOCIAL_REGISTER_COMPLETE_SUCCESS',
                        fail: 'SOCIAL_REGISTER_COMPLETE_FAIL',
                    },
                },
                {
                    ...this.socialRegisterData,
                    ...params,
                },
            );
            this.socialRegisterData = null;
        } catch (error) {
            this.logService.sendLog({code: '1.4.39', data: error});
            throw error;
        }
    }

    /**
     * Login user with social network
     * @param provider social network provider
     * @returns url for social account connection
     */
    public async socialLogin(provider: string): Promise<string> {
        // this.cachingService.set<number>(
        //     'socialRegBonus',
        //     this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus)?.id,
        //     true,
        // );

        this.configService.set({
            name: 'socialRegBonus',
            value: this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus)?.id,
            storageType: 'localStorage',
        });

        return this.getAuthUrl(provider);
    }

    /**
     *
     * @returns list of social systems connected for user
     */
    public async getUserNetworks(): Promise<string[]> {
        try {
            const res = await this.dataService.request<ISocialConnectedList>({
                name: 'authSocialLinkGet',
                url: '/auth/socialLink',
                system: 'user',
                type: 'GET',
            });
            return res.data || [];
        } catch (error) {
            this.logService.sendLog({code: '1.4.36', data: error});
        }
    }

    /**
     * Connect social provider to existing account
     * @param provider social network id
     * @returns redirect url
     */
    public async connectNetwork(provider: string): Promise<string> {
        this.configService.set({
            name: 'socialState',
            value: this.uiRouter.current.name,
            storageType: 'localStorage',
        });

        return this.getAuthUrl(provider);
    }

    /**
     * Disconnect social provider from account
     * @param provider social network id
     */
    public async disconnectNetwork(provider: string): Promise<void> {
        try {
            await this.dataService.request({
                name: 'authSocialLinkDelete',
                url: '/auth/socialLink',
                system: 'user',
                type: 'DELETE',
                params: {provider},
                events: {
                    success: 'SOCIAL_DISCONNECT_SUCCESS',
                    fail: 'SOCIAL_DISCONNECT_FAIL',
                },
            });
        } catch (error) {
            this.logService.sendLog({code: '1.4.38', data: error});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),
                    message: [gettext('Error disconnect social network, try later.')],
                },
            });
        }
    }

    /**
     * Get social network user data
     * @returns parameters for social registration completion
     */
    private async getSocialData(): Promise<ISocialUserDataResponse | IData> {
        try {
            const data = await this.dataService.request<ISocialUserDataResponse>({
                name: 'authSocialGet',
                url: '/auth/social',
                system: 'user',
                type: 'GET',
                events: {
                    success: 'SOCIAL_REGISTER_COMPLETE_SUCCESS',
                    fail: 'SOCIAL_REGISTER_COMPLETE_FAIL',
                },
            });

            if (data.data.social && data.data.social_uid) {
                return data;
            } else {
                throw data;
            }
        } catch (error) {
            this.logService.sendLog({code: '1.4.38', data: {
                message: error.status === 'success' ? 'Wrong social data' : 'Error',
                error,
            }});
            throw error;
        }

    }

    /**
     *
     * @param provider social network id
     * @returns authUrl  for connect
     */
    private async getAuthUrl(provider: string): Promise<string> {
        try {
            const data = await this.dataService.request<ISocialAuthUrlResponse>(
                {
                    name: 'authSocialLinkPut',
                    url: '/auth/socialLink',
                    system: 'user',
                    type: 'PUT',
                    events: {
                        success: 'SOCIAL_CONNECT_SUCCESS',
                        fail: 'SOCIAL_CONNECT_FAIL',
                    },
                },
                {provider},
            );
            if (data.data?.authUrl) {
                return data.data.authUrl;
            } else {
                throw data;
            }
        } catch (error) {
            this.logService.sendLog({code: '1.4.35', data: {
                message: error.status === 'success' ? 'No auth url in response' : 'Error',
                error,
            }});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),
                    message: [gettext('Error connect social network, try later.')],
                },
            });
        }
    }
}
