import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {
    ICashbackRewardCParams,
} from 'wlc-engine/modules/cashback/components/cashback-rewards/cashback-rewards.params';

export namespace wlcCashbackRewards {
    export const def: ILayoutComponent = {
        name: 'cashback.wlc-cashback-rewards',
        params: <ICashbackRewardCParams>{
            pagination: {
                use: true,
                breakpoints: {
                    0: {
                        itemPerPage: 4,
                    },
                    720: {
                        itemPerPage: 6,
                    },
                },
            },
        },
    };

    export const first: ILayoutComponent = {
        name: 'cashback.wlc-cashback-rewards',
        params: <ICashbackRewardCParams>{
            themeMod: 'first',
            pagination: {
                use: true,
                breakpoints: {
                    0: {
                        itemPerPage: 4,
                    },
                    720: {
                        itemPerPage: 6,
                    },
                },
            },
        },
    };
}
