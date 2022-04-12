import {ILayoutComponent} from 'wlc-engine/modules/core';
import {IFeelingLuckyButtonCParams} from 'wlc-engine/modules/games/components/lucky-button/lucky-button.params';

export namespace wlcLuckyButton {
    export const def: ILayoutComponent = {
        name: 'games.wlc-lucky-button',
        params: <IFeelingLuckyButtonCParams>{},
    };
}
