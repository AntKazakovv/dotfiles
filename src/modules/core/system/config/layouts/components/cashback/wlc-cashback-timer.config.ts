import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {ICashbackTimerCParams} from 'wlc-engine/modules/cashback/components/cashback-timer/cashback-timer.params';

export namespace wlcCashbackTimer {
    export const def: ILayoutComponent = {
        name: 'cashback.wlc-cashback-timer',
        params: <ICashbackTimerCParams>{
            theme: 'default',
        },
    };

    export const wolf: ILayoutComponent = {
        name: 'cashback.wlc-cashback-timer',
        params: <ICashbackTimerCParams>{
            theme: 'wolf',
            timerText: gettext('Time remaining'),
        },
    };
} 
