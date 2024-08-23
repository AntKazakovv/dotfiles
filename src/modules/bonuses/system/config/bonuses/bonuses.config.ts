import {IBonusesModule} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export const bonusesConfig: IBonusesModule = {
    showAllInProfile: false,
    useIconBonusImage: true,
    unitedPageBonuses: false,
    useNewImageSources: false,
    defaultIconPath: '//agstatic.com/bonuses/icons/',
    defaultIconExtension: 'svg',
    fallBackIconPath: '//agstatic.com/bonuses/icons/default.svg',
    showOnlyIconPath: '//agstatic.com/wlc/bonuses/lock.svg',
    components: {
        'wlc-bonuses-list': {
            noContent: {
                'promo-home': {
                    title: gettext('New bonuses will appear very soon.'),
                    text: gettext('Cheer yourself up with our new and popular games.'),
                },
                'promo': {
                    theme: 'promotions',
                    title: gettext('New bonuses will appear very soon.'),
                    text: gettext('Cheer yourself up with our new and popular games.'),
                    decorImage: '/wlc/icons/no-data/nodata_bonuses.svg',
                    decorParams: {
                        useDecorInside: true,
                        useInline: true,
                    },
                    redirectBtn: {
                        useBtn: true,
                        sref: 'app.catalog',
                        text: gettext('Play'),
                    },
                },
                'wolf': {
                    title: gettext('New bonuses will appear very soon.'),
                    text: gettext('Cheer yourself up with our new and popular games.'),
                    decorImage: '//agstatic.com/bonuses/wolf/no-bonuses.svg',
                },
            },
        },
    },
    tagsConfig: {
        useIcons: true,
        tagList: {
            'unavailable': {
                caption: gettext('Unavailable'),
                bg: '#313131',
                iconUrl: '/wlc/icons/theme-wolf/unavailable.svg',
            },
            'processing': {
                caption: gettext('Processing'),
                bg: '#313131',
                iconUrl: '/wlc/icons/theme-wolf/unavailable.svg',
            },
            'active': {
                caption: gettext('Active'),
                bg: '#5321a4',
                iconUrl: '/wlc/icons/theme-wolf/active.svg',
            },
            'lootbox': {
                caption: gettext('Loot box'),
                bg: '#1d2181',
                iconUrl: '/wlc/icons/theme-wolf/loot-box.svg',
            },
            'inventoried': {
                caption: gettext('Inventoried'),
                bg: '#9b1e69',
                iconUrl: '/wlc/icons/theme-wolf/inventoried.svg',

            },
            'subscribed': {
                caption: gettext('Subscribed'),
                bg: '#ff1895',
                iconUrl: '/wlc/icons/theme-wolf/subscribed.svg',

            },
            'promocode': {
                caption: gettext('Promo code'),
                bg: '#63b000',
                iconUrl: '/wlc/icons/theme-wolf/promo-code.svg',
            },
            'welcome': {
                caption: gettext('Welcome'),
                bg: '#ff5c00',
                iconUrl: '/wlc/icons/theme-wolf/welcome.svg',
            },
        },
    },
    alertsConfig: {
        allowStackAlert: {
            title: gettext('The bonus allows stacking'),
            level: 'info',
        },
        unavailableActivationAlert: {
            title: gettext('This bonus cannot be activated due to the presence of another active bonus'),
            level: 'warning',
        },
        nonCancelableAlert: {
            title: gettext('The bonus does not allow cancellation. Wager this bonus to claim a new one'),
            level: 'warning',
        },
    },
};
