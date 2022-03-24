import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';
import {
    wlcHistoryFilter,
} from 'wlc-engine/modules/core/system/config/layouts/components/finances/wlc-history-filter.config';

export namespace wlcTournamentsHistory {
    export const filterTypeFirst: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcHistoryFilter.tournaments,
            ],
        },
    };

    export const filterTypeDefault: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.history,
                wlcHistoryFilter.tournaments,
            ],
        },
    };

    export const def: ILayoutComponent = {
        name: 'tournaments.wlc-tournaments-history',
    };
}
