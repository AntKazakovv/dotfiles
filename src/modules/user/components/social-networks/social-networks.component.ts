import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    ISocialNetwork,
    EventService,
} from 'wlc-engine/modules/core';
import {SocialService} from 'wlc-engine/modules/user/system/services/social/social.service';

import * as Params from './social-networks.params';

import _map from 'lodash-es/map';
import _includes from 'lodash-es/includes';
import _get from 'lodash-es/get';

@Component({
    selector: '[wlc-social-networks]',
    templateUrl: './social-networks.component.html',
    styleUrls: ['./styles/social-networks.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SocialNetworksComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISocialNetworksCParams;

    public $params: Params.ISocialNetworksCParams;
    public networks: Params.INetwork[] = [];
    public connected: string[] = [];
    protected _pending: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISocialNetworksCParams,
        protected configService: ConfigService,
        protected socialService: SocialService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.getSocialNetworks();

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.getUserSocialNetwork();
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

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
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

    protected async socialLogin(provider: string): Promise<void> {
        const url = await this.socialService.socialLogin(provider);
        if (url) {
            window.location.href = url;
        }
    }

    protected async toggleProvider(provider: string): Promise<void> {
        if (this.isProviderConnected(provider)) {
            await this.socialService.disconnectNetwork(provider);
            await this.getUserSocialNetwork();
        } else {
            const url = await this.socialService.connectNetwork(provider);
            if (url) {
                window.location.href = url;
            }
        }
    }

    protected getSocialNetworks(): void {
        this.networks = this.prepareList();
        this.cdr.markForCheck();
    }

    protected async getUserSocialNetwork(): Promise<void> {
        this.connected = await this.socialService.getUserNetworks() || [];
        this.cdr.markForCheck();
    }

    protected prepareList(): Params.INetwork[] {
        return _map<ISocialNetwork, Params.INetwork>(
            this.configService.get<ISocialNetwork[]>('appConfig.socialNetworks'),
            (item: ISocialNetwork) => {
                const {iconPath, replaceConfig} = this.$params;

                return <Params.INetwork>{
                    id: item.id,
                    name: _get(replaceConfig, item.id + '.name', item.name),
                    iconPath: _get(replaceConfig, item.id + '.iconPath', iconPath + item.id + '.svg'),
                };
            },
        );
    }
}
