import {IBaseConfig} from 'wlc-engine/modules/core/system/interfaces/base-config';
import {deviceConfig} from './device.config';
import {stickyHeaderConfig} from './sticky-header.config';
import {profileConfig} from './profile.config';
import {tournamentsConfig} from './tournaments.config';
import {gamesConfig} from './games.config';
import {appConfig} from './app.config';
import {notificationsConfig} from './notifications.config';
import {contactsConfig} from './contacts.config';
import {interactiveTextConfig} from './interactiveText.config';
import {redirectsConfig} from './redirect.config';

export const $base: IBaseConfig = {
    app: appConfig,
    device: deviceConfig,
    stickyHeader: stickyHeaderConfig,
    profile: profileConfig,
    tournaments: tournamentsConfig,
    games: gamesConfig,
    notifications: notificationsConfig,
    contacts: contactsConfig,
    interactiveText: interactiveTextConfig,
    redirects: redirectsConfig,
    useSeo: false,
    finances: {
        depositInIframe: true,
    },
};
