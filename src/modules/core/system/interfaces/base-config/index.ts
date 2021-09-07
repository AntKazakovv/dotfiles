import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IGamesConfig} from './games.interface';
import {IProfileConfig} from './profile.interface';
import {ITournamentsConfig} from './tournaments.interface';
import {IAppConfig} from './app.interface';
import {INotificationsConfig} from './notifications.interface';
import {IInteractiveText} from './interactiveText.interface';
import {ILivechatConfig} from 'wlc-engine/modules/livechat';
import {IRedirectConfig} from 'wlc-engine/modules/core';
import {IRegistrationConfig} from './registration.interface';
import {ISocialItem} from 'wlc-engine/modules/core/components/social-icons/social-icons.params';
import {IColorThemeSwitchingConfig} from './color-theme-switching.config';
import {IFinancesConfig} from './finances.interface';

export * from './games.interface';
export * from './tournaments.interface';
export * from './finances.interface';

export interface IBaseConfig {
    app?: IAppConfig;
    site?: {
        name: string;
        url: string;
        removeCreds?: boolean;
        restrictRegistration?: boolean,
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
        socials?: ISocialItem[]
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
    colorThemeSwitching?: IColorThemeSwitchingConfig;
    registration?: IRegistrationConfig;
    finances?: IFinancesConfig;
}
