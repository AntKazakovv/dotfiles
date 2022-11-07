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
import {idleConfig} from './idle.config';
import {fixedPanelConfig} from './fixed-panel.config';

export const $base: IBaseConfig = {
    app: appConfig,
    device: deviceConfig,
    stickyHeader: stickyHeaderConfig,
    fixedPanel: fixedPanelConfig,
    profile: profileConfig,
    tournaments: tournamentsConfig,
    games: gamesConfig,
    notifications: notificationsConfig,
    contacts: contactsConfig,
    interactiveText: interactiveTextConfig,
    redirects: redirectsConfig,
    useSeo: false,
    finances: {
        redirectAfterDepositBonus: false,
        depositInIframe: true,
        piqCashier: {
            blockBrowserNavigation: true,
            fetchConfig: false,
        },
        metamask: {
            hidePayMessageModalOnSuccess: true,
        },
    },
    rewritingWpLanguages: {
        'pt-br': 'pb',
    },
    idle: idleConfig,
    defaultCurrency: 'EUR',
    rewritingCurrencyName: {
        'ET1': 'ETH',
        'ET2': 'ETH',
        'MBC': 'BTC',
        'XB3': 'BTC',
        'BC1': 'BCH',
        'BC2': 'BCH',
        'LT1': 'LTC',
        'LT2': 'LTC',
    },
    termsAvailableStates: [
        'app.home',
        'app.error',
        'app.catalog',
        'app.catalog.child',
        'app.contacts',
        'app.profile.cash.withdraw',
        'app.profile.main.info',
        'app.profile.verification',
        'app.profile.kycaml',
        'app.providers',
        'app.gameplay?demo=true',
    ],
};
