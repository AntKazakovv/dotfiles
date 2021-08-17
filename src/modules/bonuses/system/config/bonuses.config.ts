import {IBonusesModule} from '../interfaces/bonuses.interface';

export const bonusesConfig: IBonusesModule = {
    components: {
        'wlc-bonuses-list': {
            noContent: {
                'promo-home': {
                    title: gettext('New bonuses will appear very soon.'),
                    text: gettext('Cheer yourself up with our new and popular games.'),
                },
            },
        },
    },
};
