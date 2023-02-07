import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcHistoryFilter {

    const filterIcon: string = '/mobile-app/icons/filter-2.svg';

    export const transactions: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            themeMod: 'mobile-app',
            config: 'transaction',
            iconPath: filterIcon,
        },
    };

    export const bonuses: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            themeMod: 'mobile-app',
            config: 'bonus',
            iconPath: filterIcon,
        },
    };

    export const tournaments: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            themeMod: 'mobile-app',
            config: 'tournaments',
            iconPath: filterIcon,
        },
    };

    export const bets: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            themeMod: 'mobile-app',
            config: 'bet',
            iconPath: filterIcon,
        },
    };
}
