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
                    transparent: {
                        redirectBtn: {
                            useBtn: true,
                        },
                        link: {
                            useLink: false,
                        },
                    },
                    vertical: {
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
                        text: gettext(' '),
                        redirectBtn: {
                            useBtn: false,
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
                        redirectBtn: {
                            useBtn: true,
                        },
                    },
                    transparent: {
                        redirectBtn: {
                            useBtn: true,
                        },
                        link: {
                            useLink: false,
                        },
                    },
                },
            },
        },
        'wlc-jackpots-slider': {
            noContent: {
                default: {
                    title: gettext('Oh, all the available jackpots have been played. New jackpots' +
                    ' will appear later. In the meantime, we offer you to have a look at our new games.'),
                    redirectBtn: {
                        useBtn: true,
                    },
                    link: {
                        useLink: false,
                    },
                },
            },
        },
    },
};
