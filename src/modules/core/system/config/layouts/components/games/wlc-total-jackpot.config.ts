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

    export const gamesInside: ILayoutComponent = {
        name: 'games.wlc-total-jackpot',
        params: {
            theme: 'games-inside',
        },
    };

    export const gamesInsideModLabel: ILayoutComponent = {
        name: 'games.wlc-total-jackpot',
        params: {
            theme: 'games-inside',
            themeMod: 'label',
        },
    };
}
