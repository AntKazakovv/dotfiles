import {IBonusesModule} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';

export const bonusesConfig: IBonusesModule = {
    useIconBonusImage: true,
    unitedPageBonuses: false,
    useNewImageSources: false,
    defaultIconPath: '/gstatic/bonuses/icons/',
    components: {
        'wlc-bonuses-list': {
            noContent: {
                'promo-home': {
                    title: gettext('New bonuses will appear very soon.'),
                    text: gettext('Cheer yourself up with our new and popular games.'),
                    bgImage: '/gstatic/wlc/bonuses/no-bonuses/no-bonus-block-background.jpg',
                },
            },
        },
    },
};
