import {IBonusesModule} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';

export const bonusesConfig: IBonusesModule = {
    showAllInProfile: false,
    useIconBonusImage: true,
    unitedPageBonuses: false,
    useNewImageSources: false,
    defaultIconPath: '/gstatic/bonuses/icons/',
    defaultIconExtension: 'svg',
    fallBackIconPath: '/gstatic/bonuses/icons/default.svg',
    showOnlyIconPath: '/gstatic/wlc/bonuses/lock.svg',
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
            },
        },
    },
};
