import {NgModule} from '@angular/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IIndexing} from 'wlc-engine/modules/core';
import {HistoryModule} from 'wlc-engine/modules/history/history.module';

import {CashbackService} from './system/services/cashback/cashback.service';
import {CashbackRewardsComponent} from './components/cashback-rewards/cashback-rewards.component';
import {CashbackTimerComponent} from './components/cashback-timer/cashback-timer.component';

export const services: IIndexing<any> = {
    'cashback-service': CashbackService,
};

export const components: IIndexing<any> = {
    'wlc-cashback-rewards': CashbackRewardsComponent,
    'wlc-cashback-timer': CashbackTimerComponent,
};

@NgModule({
    imports: [
        CoreModule,
        HistoryModule,
    ],
    providers: [
        CashbackService,
    ],
    declarations: [
        CashbackRewardsComponent,
        CashbackTimerComponent,
    ],
    exports: [
        CashbackRewardsComponent,
        CashbackTimerComponent,
    ],
})
export class CashbackModule {}
