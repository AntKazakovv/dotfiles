import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IGamesConfig} from './games.interface';
import {IProfileConfig} from './profile.interface';
import {ITournamentsConfig} from './tournaments.interface';
import {IAppConfig} from './app.interface';
import {INotificationsConfig} from './notifications.interface';
import {IInteractiveText} from './interactiveText.interface';
import {ILivechatConfig} from 'wlc-engine/modules/livechat';
import {
    IRedirectConfig,
} from 'wlc-engine/modules/core';

export * from './games.interface';
export * from './tournaments.interface';

export interface IBaseConfig {
    app?: IAppConfig;
    site?: {
        name: string;
        url: string;
        removeCreds?: boolean;
    },
    affiliate?: {
        affiliateUrl: string;
        siteUrl: string;
    },
    profile?: IProfileConfig,
    tournaments?: ITournamentsConfig,
    games?: IGamesConfig,
    device?: IDeviceConfig,
    notifications?: INotificationsConfig,
    contacts?: {
        phone?: string;
        email?: string;
    };
    interactiveText?: IInteractiveText[];
    livechat?: ILivechatConfig;
    /**
     * Config redirection by event or state
     */
    redirects?: IRedirectConfig;
    /**
     * Use seo service; Service gets information from wordpress plugin 'Seo Softgamings';
     */
    useSeo?: boolean;
}
