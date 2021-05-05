import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcSportsbook {

    export const def: ILayoutComponent = {
        name: 'sportsbook.wlc-sportsbook',
        params: {
        },
    };

    export const betradarDailyMatch: ILayoutComponent = {
        name: 'sportsbook.wlc-betradar-daily-match',
    };

    export const betradarPopularEvents: ILayoutComponent = {
        name: 'sportsbook.wlc-betradar-popular-events',
    };
}
