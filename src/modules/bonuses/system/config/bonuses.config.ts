import {IBonusesModule} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';

export const bonusesConfig: IBonusesModule = {
    useIconBonusImage: true,
    defaultImages: {
        image: '/gstatic/wlc/bonuses/bonus-bg-haze-promo.png',
        imageProfileFirst: '/gstatic/wlc/bonuses/bonus-bg-horizontal.png',
        imageReg: '/gstatic/wlc/bonuses/bonus-bg-haze-vertical.png',
        imagePromo: '/gstatic/wlc/bonuses/bonus-bg-promo-second.png',
        imageOther: '/gstatic/wlc/bonuses/modal-bonus-default.png',
        imageStore: '',
        imagePromoHome: '/gstatic/wlc/bonuses/no-bonuses/no-bonus-block-background.jpg',
        imageBlank: '/gstatic/wlc/bonuses/blank-bonus-decor.png',
        imageDummy: '/gstatic/wlc/bonuses/bonus-dummy.svg',
    },
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
