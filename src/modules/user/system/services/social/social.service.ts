import {UIRouterGlobals} from '@uirouter/core';
import {Injectable} from '@angular/core';

import {
    BehaviorSubject,
    from,
    Observable,
} from 'rxjs';
import {map} from 'rxjs/operators';

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
    GlobalHelper,
} from 'wlc-engine/modules/core';

import {ISocialNetwork} from 'wlc-engine/modules/core/system/interfaces/app-config.interface';

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

@Injectable({providedIn: 'root'})
export class SocialService {

    protected socialRegisterData: Partial<IRegisterParams>;
    protected isRegistrationOngoing = new BehaviorSubject<boolean | null>(null);

    public get isRegistrationOngoing$(): Observable<boolean> {
        return this.isRegistrationOngoing.asObservable();
    }

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

        this.isRegistrationOngoing.next(true);
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
            this.logService.sendLog({code: '1.5.4', data: error});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),                    
                    message: [gettext('An error has occurred when completing sign-up via' +
                            ' the social network. Please try again later'),
                    ],
                },
            });
        }
    }

    /**
     * Completes social registration process
     * @param params request params
     */
    public async socialRegisterComplete(params: Partial<IUserProfile>): Promise<void> {
        if (GlobalHelper.restrictRegistration(this.configService, this.eventService)) {
            return;
        }
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
            this.eventService.emit({name: 'LOGIN'});
            this.modalService.hideModal('social-register');
            this.isRegistrationOngoing.next(false);
        } catch (error) {
            this.logService.sendLog({code: '1.5.3', data: error});
            throw error;
        }
    }

    /**
     * Login user with social network
     * @param provider social network provider
     * @returns url for social account connection
     */
    public async socialLogin(provider: string): Promise<string> {
        this.configService.set({
            name: 'socialRegBonus',
            value: this.configService.get<ChosenBonusType>(ChosenBonusSetParams.ChosenBonus)?.id,
            storageType: 'localStorage',
        });

        return this.getAuthUrl(provider);
    }

    /**
     *
     * @returns list of social networks connected for user
     */
    public async getSocialNetworksList(): Promise<ISocialNetwork[]> {
        try {
            const res = await this.dataService.request<IData<string>>({
                name: 'socialNetworks',
                url: '/socialNetworks',
                system: 'user',
                type: 'GET',
            });

            this.configService.set({
                name: 'socialNetworks',
                value: res.data,
                storageType: 'sessionStorage',
            });

            return res.data || [];
        } catch (error) {
            this.logService.sendLog({code: '1.5.5', data: error});
        }
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
            this.logService.sendLog({code: '1.5.1', data: error});
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
            this.logService.sendLog({code: '1.5.2', data: error});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),                    
                    message: [gettext('An error has occurred when disconnecting from the social network.' +
                        ' Please try again later'),
                    ],
                },
            });
        }
    }

    /**
     * Get google client id
     * @param provider social network id
     * @returns observable google client id
     */
    public getClientId(provider: string): Observable<string> {
        const clientIdRegex = /client_id=([^&]+)/;
        return from(this.socialLogin(provider)).pipe(map(url => clientIdRegex.exec(url)![1]));
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
            this.logService.sendLog({code: '1.5.2', data: {
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
            this.logService.sendLog({code: '1.5.0', data: {
                message: error.status === 'success' ? 'No auth url in response' : 'Error',
                error,
            }});
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Social'),                    
                    message: [gettext('An error has occurred when connecting to the social network.' +
                                    ' Please try again later'),
                    ],
                },
            });
        }
    }
}
