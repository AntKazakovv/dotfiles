import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IGamesConfig} from './games.interface';
import {IProfileConfig} from './profile.interface';
import {ITournamentsConfig} from './tournaments.interface';
import {IAppConfig} from './app.interface';
import {INotificationsConfig} from './notifications.interface';

export interface IBaseConfig {
    app?: IAppConfig;
    site?: {
        name: string;
        url: string;
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
}
