import {IBaseConfig} from 'wlc-engine/modules/core/system/interfaces/base-config';
import {deviceConfig} from './device.config';
import {stickyHeaderConfig} from './sticky-header.config';
import {profileConfig} from './profile.config';
import {tournamentsConfig} from './tournaments.config';
import {marathonConfig} from './marathon.config';
import {gamesConfig} from './games.config';
import {appConfig} from './app.config';
import {notificationsConfig} from './notifications.config';
import {contactsConfig} from './contacts.config';
import {interactiveTextConfig} from './interactiveText.config';
import {redirectsConfig} from './redirect.config';
import {idleConfig} from './idle.config';
import {fixedPanelConfig} from './fixed-panel.config';
import {sitemapConfig} from './sitemap.config';

export const $base: IBaseConfig = {
    app: appConfig,
    device: deviceConfig,
    stickyHeader: stickyHeaderConfig,
    fixedPanel: fixedPanelConfig,
    profile: profileConfig,
    tournaments: tournamentsConfig,
    marathon: marathonConfig,
    games: gamesConfig,
    notifications: notificationsConfig,
    contacts: contactsConfig,
    interactiveText: interactiveTextConfig,
    redirects: redirectsConfig,
    useSeo: false,
    finances: {
        redirectAfterDepositBonus: false,
        piqCashier: {
            blockBrowserNavigation: true,
            fetchConfig: false,
        },
        metamask: {
            hidePayMessageModalOnSuccess: true,
        },
        lastWithdrawCancelWidget: false,
    },
    rewritingWpLanguages: {
        'pt-br': 'pb',
    },
    monitoring: {
        performanceReport: {
            listMetrics: ['LCP', 'CLS', 'FCP', 'TTFB'],
        },
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
        'app.providers.item',
        'app.gameplay?demo=true',
        'app.contact-us',
    ],
    maltaSelfExclusionAvailableStates: [
        'app.home',
        'app.error',
        'app.contacts',
        'app.contact-us',
        'app.profile.cash.withdraw',
        'app.profile.main.info',
        'app.profile.verification',
        'app.profile.loyalty-bonuses.history',
        'app.profile.gamblings.bets',
        'app.profile.cash.transactions',
        'app.profile.loyalty-tournaments.history',
        'app.profile.limitations',
        'app.profile.kycaml',
    ],
    romaniaSelfExclusionAvailableStates: [
        'app.home',
        'app.error',
        'app.contacts',
        'app.contact-us',
        'app.profile.cash.withdraw',
        'app.profile.main.info',
        'app.profile.verification',
        'app.profile.loyalty-bonuses.history',
        'app.profile.gamblings.bets',
        'app.profile.cash.transactions',
        'app.profile.loyalty-tournaments.history',
    ],
    errorsReplacerMap: {
        'AML verification in progress': {
            text: gettext('Please wait, your account is being verified'),
        },
        'AML verification declined': {
            text: gettext('Unfortunately, Your registration has been rejected. Please contact us at'),
            supportEmail: true,
        },
        'User waiting verification': {
            text: gettext('Please wait, your account is being verified'),
        },
    },
    popupByQuery: {
        use: false,
        modals: {
            'login': {
                config: 'login',
                auth: false,
            },
            'signup': {
                config: 'signup',
                auth: false,
            },
        },
    },
    registration: {
        requiredRegisterCheckboxNames: [
            'ageConfirmed',
            'agreeWithSelfExcluded',
            'agreedWithTermsAndConditions',
        ],
    },
    queryParams: ['message', 'error', 'promocode', 'popup', 'wheel', 'utm_', 'bonus'],
    sitemap: sitemapConfig,
};
