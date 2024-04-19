import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcLatestBets {
    export const def: ILayoutComponent = {
        name: 'promo.wlc-latest-bets',
        params: {
            tableHead: ['Game', 'User', 'Bet Amount', 'Multiplier', 'Profit Amount'],
            preloader: {
                params: {
                    block: {
                        type: 'block',
                        customClass: 'wlc-preloader__element--block-latest-bets',
                        elements: [
                            {
                                type: 'block',
                                customClass: 'wlc-preloader__element--line-latest-bets',
                                elements: [
                                    {
                                        type: 'block',
                                        amount: 6,
                                        elements: [
                                            {
                                                type: 'button',
                                                amount: 1,
                                            },
                                            {
                                                type: 'line',
                                                amount: 1,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        },
    };

}
