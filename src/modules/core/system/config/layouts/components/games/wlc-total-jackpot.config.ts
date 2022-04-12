import {ILayoutComponent} from 'wlc-engine/modules/core';
import {ITotalJackpotCParams} from 'wlc-engine/modules/games';

export namespace wlcTotalJackpot {
    export const home: ILayoutComponent = {
        name: 'games.wlc-total-jackpot',
    };

    export const info: ILayoutComponent = {
        name: 'games.wlc-total-jackpot',
        params: <ITotalJackpotCParams>{
            theme: 'info',
            countUpOptions: {
                separator: ',',
            },
        },
    };
}
