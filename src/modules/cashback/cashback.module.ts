import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {IIndexing} from 'wlc-engine/modules/core';
import {CashbackService} from './system/services/cashback/cashback.service';
import {CashbackRewardsComponent} from './components/cashback-rewards/cashback-rewards.component';
import {HistoryModule} from 'wlc-engine/modules/history/history.module';

export const services: IIndexing<any> = {
    'cashback-service': CashbackService,
};

export const components: IIndexing<any> = {
    'wlc-cashback-rewards': CashbackRewardsComponent,
};

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        CoreModule,
        HistoryModule,
    ],
    providers: [
        CashbackService,
    ],
    declarations: [
        CashbackRewardsComponent,
    ],
    exports: [
        CashbackRewardsComponent,
    ],
})
export class CashbackModule {}
