import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {TranslateModule} from '@ngx-translate/core';

import {CoreModule} from 'wlc-engine/modules/core/core.module';
import {CompilerModule} from 'wlc-engine/modules/compiler';

import {LotteriesService} from './system/services/lotteries.service';
import {LotteryCardComponent} from './components/lottery-card/lottery-card.component';
import {LotteryPrizesComponent} from './components/lottery-prizes/lottery-prizes.component';
import {LotteryButtonsComponent} from './components/lottery-buttons/lottery-buttons.component';
import {LotteryDetailComponent} from './components/lottery-detail/lottery-detail.component';
import {LotterySmartInfoComponent} from './components/lottery-smart-info/lottery-smart-info.component';
import {LotteryCtaComponent} from './components/lottery-cta/lottery-cta.component';

export const components = {
    'wlc-lottery-card': LotteryCardComponent,
    'wlc-lottery-prizes': LotteryPrizesComponent,
    'wlc-lottery-buttons': LotteryButtonsComponent,
    'wlc-lottery-detail': LotteryDetailComponent,
    'wlc-lottery-smart-info': LotterySmartInfoComponent,
    'wlc-lottery-cta': LotteryCtaComponent,
};

export const services = {
    'lotteries-service': LotteriesService,
};

@NgModule({
    declarations: [
        LotteryCardComponent,
        LotteryPrizesComponent,
        LotteryButtonsComponent,
        LotteryDetailComponent,
        LotterySmartInfoComponent,
        LotteryCtaComponent,
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
        LotteryDetailComponent,
        LotterySmartInfoComponent,
        LotteryCtaComponent,
    ],
    providers: [
        LotteriesService,
    ],
})
export class LotteriesModule {}
