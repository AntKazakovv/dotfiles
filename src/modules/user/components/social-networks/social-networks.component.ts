import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import _map from 'lodash-es/map';
import _includes from 'lodash-es/includes';
import _get from 'lodash-es/get';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ConfigService,
    ISocialNetwork,
    EventService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {IGameLaunch} from 'wlc-engine/modules/games/system/interfaces/game-launch.interface';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';
import {GameLauncherService} from 'wlc-engine/modules/games/system/services/game-launcher/game-launcher.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {
    GAME_LAUNCH_STORAGE_KEY,
    GAME_LAUNCH_STORAGE_TYPE,
} from 'wlc-engine/modules/games/system/constants/game-launch.constants';

import * as Params from './social-networks.params';

@Component({
    selector: '[wlc-social-networks]',
    templateUrl: './social-networks.component.html',
    styleUrls: ['./styles/social-networks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SocialNetworksComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISocialNetworksCParams;

    public override $params: Params.ISocialNetworksCParams;
    public networks: Params.INetwork[] = [];
    public metamask: Params.INetwork;
    public connected: string[] = [];

    public isMetamask: boolean = this.configService.get<boolean>('appConfig.siteconfig.useMetamask');
    public isSocials: boolean = this.configService.get<boolean>('$base.profile.socials.use');
    public isAuth: boolean = this.configService.get<boolean>('$user.isAuthenticated');

    protected _pending: boolean = false;

    private socialService: SocialService;
    private userService: UserService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialNetworksCParams,
        configService: ConfigService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected gameLauncherService: GameLauncherService,
        cdr: ChangeDetectorRef,
        @Inject(WINDOW) protected window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        if (this.isSocials) {
            this.socialService = await this.injectionService.getService<SocialService>('user.social-service');
            this.getSocialNetworks();
        }

        if (this.isSocials && this.isAuth) {
            this.getUserSocialNetwork();
        }

        if (this.isMetamask) {
            this.setMetamaskButton();
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }
    }

    /**
     *
     * @param providerId social network id
     * @returns text or button
     */
    public getConnectButtonText(providerId: string): string {
        return this.isProviderConnected(providerId) ? gettext('Disconnect') : gettext('Connect');
    }

    /**
     *
     * @param provider social network id
     * @returns true if network connected to current user
     */
    public isProviderConnected(provider: string): boolean {
        return _includes(this.connected, provider);
    }

    /**
     * Handle click on social network button
     * @param provider social network id
     */
    public async handleClick(provider: string): Promise<void> {
        if (this._pending) {
            return;
        }

        this._pending = true;

        if (this.isAuth) {
            await this.toggleProvider(provider);
        } else {
            await this.socialLogin(provider);
        }

        this._pending = false;
    }

    public onImageError(network: Params.INetwork): void {
        network.imgError = true;
        this.cdr.markForCheck();
    }

    public async handleMetamaskClick(): Promise<void> {
        await this.userService.metamaskAuth();
    }

    protected async socialLogin(provider: string): Promise<void> {
        const url = await this.socialService.socialLogin(provider);

        if (url) {
            this.confirmGameLaunchOnReload();
            this.window.location.href = url;
        }
    }

    protected confirmGameLaunchOnReload(): void {
        const gameLaunch: IGameLaunch = this.gameLauncherService.getFromStorage();

        if (gameLaunch) {
            this.configService.set<IGameLaunch>({
                merge: true,
                value: {merchantID: gameLaunch.merchantID, launchCode: gameLaunch.launchCode},
                name: GAME_LAUNCH_STORAGE_KEY,
                storageType: GAME_LAUNCH_STORAGE_TYPE,
            });
        }
    }

    protected async toggleProvider(provider: string): Promise<void> {
        if (this.isProviderConnected(provider)) {
            await this.socialService.disconnectNetwork(provider);
            await this.getUserSocialNetwork();
        } else {
            const url = await this.socialService.connectNetwork(provider);
            if (url) {
                this.window.location.href = url;
            }
        }
    }

    protected async getSocialNetworks(): Promise<void> {
        this.networks = await this.prepareList();
        this.cdr.markForCheck();
    }

    protected async getUserSocialNetwork(): Promise<void> {
        this.connected = await this.socialService.getUserNetworks() || [];
        this.cdr.markForCheck();
    }

    protected async prepareList(): Promise<Params.INetwork[]> {
        const cacheSocialNetworkList: ISocialNetwork[] = this.configService.get(
            {name: 'socialNetworks', storageType: 'sessionStorage'},
        );

        const socialNetworksList = cacheSocialNetworkList ?? await this.socialService.getSocialNetworksList();
        return _map<ISocialNetwork, Params.INetwork>(
            socialNetworksList,
            (item: ISocialNetwork) => {
                const {iconPath, replaceConfig} = this.$params;

                return <Params.INetwork>{
                    id: item.id,
                    name: _get(replaceConfig, `${item.id}.name`, item.name),
                    iconPath: _get(replaceConfig, `${item.id}.iconPath'`, `${iconPath}${item.id}.svg`),
                };
            },
        );
    }

    protected setMetamaskButton(): void {
        this.metamask = _merge(
            Params.metamaskDefConfig,
            _get(this.$params.replaceConfig, Params.metamaskDefConfig.id, {}),
        );
    }
}
