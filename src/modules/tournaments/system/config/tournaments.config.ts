import {ITournamentsModule} from '../interfaces/tournaments.interface';

export const tournamentsConfig: ITournamentsModule = {
    defaultImages: {
        image: '/gstatic/wlc/tournaments/tournament-decor.png',
        imagePromo: '/gstatic/wlc/tournaments/tournament-decor.png',
        imageDashboard: '/gstatic/wlc/tournaments/tournament-decor.png',
        imageDescription: '',
        imageOther: '',
    },
    components: {
        'wlc-tournament-list': {
            noContent: {
                'banner': {
                    title: gettext('Tournaments are coming soon.'),
                    text: gettext('In the meantime, show off your real skills in our casino!'),
                    bgImage: '/gstatic/wlc/tournaments/no-tournaments/no-tournament-block-background.jpg',
                    decorImage: '/gstatic/wlc/tournaments/no-tournaments/no-tournament-block-decor.png',
                },
            },
        },
    },
};
