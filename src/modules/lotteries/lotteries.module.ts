import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';

import {LotteriesService} from './system/services/lotteries.service';
import {LotteryCardComponent} from './components/lottery-card/lottery-card.component';
import {LotteryPrizesComponent} from './components/lottery-prizes/lottery-prizes.component';
import {LotteryButtonsComponent} from './components/lottery-buttons/lottery-buttons.component';

export const components = {
    'wlc-lottery-card': LotteryCardComponent,
    'wlc-lottery-prizes': LotteryPrizesComponent,
    'wlc-lottery-buttons': LotteryButtonsComponent,
};

@NgModule({
    declarations: [
        LotteryCardComponent,
        LotteryPrizesComponent,
        LotteryButtonsComponent,
    ],
    imports: [
        CommonModule,
        CoreModule,
        TranslateModule,
        CompilerModule,
    ],
    exports: [
        LotteryCardComponent,
        LotteryPrizesComponent,
    ],
    providers: [
        LotteriesService,
    ],
})
export class LotteriesModule {}
