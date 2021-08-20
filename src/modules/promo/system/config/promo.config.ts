import {IPromoConfig} from './../interfaces/promo.interfaces';

export const promoConfig: IPromoConfig = {
    components: {
        'wlc-winners-slider': {
            noContent: {
                latest: {
                    default: {
                        title: gettext('There are no recent wins at the moment.'),
                        text: gettext('But you can change it!'),
                        redirectBtn: {
                            useBtn: false,
                        },
                        link: {
                            useLink: true,
                        },
                    },
                    1: {
                        redirectBtn: {
                            useBtn: true,
                        },
                        link: {
                            useLink: false,
                        },
                    },
                    vertical: {
                        bgImage: '/gstatic/wlc/bonuses/no-bonuses/no-bonus-block-background.jpg',
                        redirectBtn: {
                            useBtn: true,
                        },
                        link: {
                            useLink: false,
                        },
                    },
                },
                biggest: {
                    default: {
                        title: gettext('Here will be your biggest win!'),
                        redirectBtn: {
                            useBtn: false,
                        },
                    },
                    1: {
                        redirectBtn: {
                            useBtn: true,
                        },
                    },
                    vertical: {
                        bgImage: '/gstatic/wlc/bonuses/no-bonuses/no-bonus-block-background.jpg',
                        redirectBtn: {
                            useBtn: true,
                        },
                    },
                },
            },
        },
        'wlc-jackpots-slider': {
            noContent: {
                default: {
                    title: gettext('Oh, all the available jackpots have been played.'),
                },
            },
        },
    },
};
