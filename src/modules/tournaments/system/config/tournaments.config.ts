import {ITournamentsModule} from '../interfaces/tournaments.interface';

export const tournamentsConfig: ITournamentsModule = {
    components: {
        'wlc-tournament-list': {
            noContent: {
                'banner': {
                    title: gettext('Tournaments are coming soon.'),
                    text: gettext('In the meantime, show off your real skills in our casino!'),
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
};
