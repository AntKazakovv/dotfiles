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
            1: '//agstatic.com/wlc/tournaments/podium/01.png',
            2: '//agstatic.com/wlc/tournaments/podium/02.png',
            3: '//agstatic.com/wlc/tournaments/podium/03.png',
        },
    },
    bonusRewardText: gettext('The reward is given through a bonus'),
    lockBtnText: gettext('Unavailable for the current level'),
    tagsConfig: {
        useIcons: true,
        tagList: {
            'Active': {
                caption: gettext('Active'),
                bg: '#5321a4',
                iconUrl: '/wlc/icons/theme-wolf/active.svg',
            },
            'Available': {
                caption: gettext('Available'),
                bg: '#00a3ff',
                iconUrl: '/wlc/icons/theme-wolf/available.svg',
            },
            'Coming soon': {
                caption: gettext('Coming soon'),
                bg: '#ff9900',
                iconUrl: '/wlc/icons/theme-wolf/coming-soon.svg',
            },
            'Unavailable': {
                caption: gettext('Unavailable'),
                bg: '#313131',
                iconUrl: '/wlc/icons/theme-wolf/unavailable.svg',
            },
            'Ended': {
                caption: gettext('Ended'),
                bg: '#42041A',
                iconUrl: '/wlc/icons/theme-wolf/ended.svg',
            },
        },
    },
    timerTextAfterStart: gettext('Time remaining:'),
    timerTextBeforeStart: gettext('Coming soon'),
};
