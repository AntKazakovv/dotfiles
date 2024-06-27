import {NgModule} from '@angular/core';

import _get from 'lodash-es/get';

import {CoreModule} from 'wlc-engine/modules/core/core.module';

import {LotteriesService} from './system/services/lotteries.service';
import {LotteryCardComponent} from './components/lottery-card/lottery-card.component';
import {LotteryPrizePoolComponent} from './components/lottery-prizepool/lottery-prizepool.component';
import {LotteryButtonsComponent} from './components/lottery-buttons/lottery-buttons.component';
import {LotteryDetailComponent} from './components/lottery-detail/lottery-detail.component';
import {LotterySmartInfoComponent} from './components/lottery-smart-info/lottery-smart-info.component';
import {LotteryCtaComponent} from './components/lottery-cta/lottery-cta.component';
import {LotteriesHistoryComponent} from './components/lotteries-history/lotteries-history.component';
import {FinishedLotteryComponent} from './components/finished-lottery/finished-lottery.component';
import {LotteryWinnersComponent} from './components/lottery-winners/lottery-winners.component';
import {LotteryPrizeComponent} from './components/lottery-prize/lottery-prize.component';
import {GlobalHelper} from 'wlc-engine/modules/core';
import {ILotteriesModule} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {lotteriesConfig} from 'wlc-engine/modules/lotteries/system/config/lotteries.config';
import * as $config from 'wlc-config/index';

export const moduleConfig =
    GlobalHelper.mergeConfig<ILotteriesModule>(lotteriesConfig, _get($config, '$lotteries', {}));

export const components = {
    'wlc-lottery-card': LotteryCardComponent,
    'wlc-lottery-prizepool': LotteryPrizePoolComponent,
    'wlc-lottery-prize': LotteryPrizeComponent,
    'wlc-lottery-buttons': LotteryButtonsComponent,
    'wlc-lottery-detail': LotteryDetailComponent,
    'wlc-lottery-smart-info': LotterySmartInfoComponent,
    'wlc-lottery-cta': LotteryCtaComponent,
    'wlc-lotteries-history': LotteriesHistoryComponent,
    'wlc-finished-lottery': FinishedLotteryComponent,
    'wlc-lottery-results': LotteryWinnersComponent,
};

export const services = {
    'lotteries-service': LotteriesService,
};

@NgModule({
    declarations: [
        LotteryCardComponent,
        LotteryPrizePoolComponent,
        LotteryPrizeComponent,
        LotteryButtonsComponent,
        LotteryDetailComponent,
        LotterySmartInfoComponent,
        LotteryCtaComponent,
        LotteriesHistoryComponent,
        FinishedLotteryComponent,
        LotteryWinnersComponent,
    ],
    imports: [
        CoreModule,
    ],
    exports: [
        LotteryCardComponent,
        LotteryPrizePoolComponent,
        LotteryDetailComponent,
        LotterySmartInfoComponent,
        LotteryCtaComponent,
        LotteriesHistoryComponent,
        FinishedLotteryComponent,
        LotteryWinnersComponent,
        LotteryPrizeComponent,
    ],
    providers: [
        LotteriesService,
    ],
})
export class LotteriesModule {}
