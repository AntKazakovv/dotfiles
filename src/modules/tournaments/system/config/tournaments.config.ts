import {ITournamentsModule} from '../interfaces/tournaments.interface';

export const tournamentsConfig: ITournamentsModule = {
    components: {
        'wlc-tournament-list': {
            noContent: {
                'banner': {
                    title: gettext('Tournaments are coming soon.'),
                    text: gettext('In the meantime, show off your real skills in our casino!'),
                },
                'default': {
                    theme: 'promotions',
                    title: gettext('Tournaments are coming soon.'),
                    text: gettext('In the meantime, show off your real skills in our casino!'),
                    decorImage: '/wlc/icons/no-data/nodata_tournaments.svg',
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
                'active': {
                    text: gettext('No active tournaments'),
                },
                'available': {
                    text: gettext('No tournaments available'),
                },
                'dashboard': {
                    text: gettext('No tournaments available'),
                },
            },
        },
    },
    prizePodium: {
        useOnDetail: false,
        images: {
            1: '/gstatic/wlc/tournaments/podium/01.png',
            2: '/gstatic/wlc/tournaments/podium/02.png',
            3: '/gstatic/wlc/tournaments/podium/03.png',
        },
    },
    bonusRewardText: gettext('The reward is given through a bonus'),
    lockBtnText: gettext('Unavailable for current level'),
};
