import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSeeAllBonuses {
    export const def: ILayoutComponent = {
        name: 'core.wlc-link-block',
        params: {
            wlcElement: 'block_all-bonuses',
            themeMod: 'secondary',
            common: {
                title: gettext('Want more promo content') + '?',
                link: gettext('See all bonuses'),
                actionParams: {
                    url: {
                        path: 'app.profile.loyalty-bonuses.main',
                    },
                },
            },
        },
    };
}
