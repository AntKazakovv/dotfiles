import {wlcTitle} from 'wlc-engine/modules/core/components/title/title.config';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcCashbackHistory {
    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.cashback,
                {
                    name: 'history.wlc-history-filter',
                    params: {
                        config: 'cashback',
                    },
                },
            ],
        },
        display: {
            before: 1023,
        },
    };

    export const filterTypeWolf: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                {
                    name: 'history.wlc-history-filter',
                    params: {
                        config: 'cashback',
                        iconPath: '/wlc/icons/filter-wolf.svg',
                    },
                },
            ],
        },
    };

    export const filterTypeFirst: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                {
                    name: 'history.wlc-history-filter',
                    params: {
                        config: 'cashback',
                    },
                },
            ],
        },
        display: {
            before: 1023,
        },
    };
}
