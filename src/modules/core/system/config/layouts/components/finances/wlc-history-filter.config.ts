import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';

export namespace wlcHistoryFilter {
    export const tournaments: ILayoutComponent = {
        name: 'finances.wlc-history-filter',
        params:{
            config: 'tournaments',
        },
        display: {
            before: 1023,
        },
    };
}
