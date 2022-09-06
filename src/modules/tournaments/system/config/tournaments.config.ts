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
};
