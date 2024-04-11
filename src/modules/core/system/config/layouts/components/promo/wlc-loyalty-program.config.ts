import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ILoyaltyProgramCParams} from 'wlc-engine/modules/loyalty/components/loyalty-program/loyalty-program.params';

export namespace wlcLoyaltyProgram {

    export const def: ILayoutComponent = {
        name: 'loyalty.wlc-loyalty-program',
        params: <ILoyaltyProgramCParams>{
            sliderParams: {
                swiper: {
                    followFinger: false,
                },
            },
        },
    };
}
