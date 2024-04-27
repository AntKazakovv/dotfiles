import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {
    takeUntil,
} from 'rxjs';
import _merge from 'lodash-es/merge';
import _assign from 'lodash-es/assign';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {ILotteryPrizesCParams} from 'wlc-engine/modules/lotteries/components/lottery-prizes/lottery-prizes.params';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {LotteryAbstract} from 'wlc-engine/modules/lotteries/system/classes/lottery-abstract.class';

import * as Params from './lottery-card.params';

@Component({
    selector: '[wlc-lottery-card]',
    templateUrl: './lottery-card.component.html',
    styleUrls: ['./styles/lottery-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryCardComponent extends LotteryAbstract<Params.ILotteryCardCParams> implements OnInit {
    @Input() protected inlineParams: Params.ILotteryCardCParams;

    public override $params: Params.ILotteryCardCParams;
    public prizesParams: ILotteryPrizesCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryCardCParams,
        configService: ConfigService,
        eventService: EventService,
        lotteriesService: LotteriesService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, lotteriesService, eventService, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        await this.getLottery();

        this.lotteriesService.lottery$.pipe(
            takeUntil(this.$destroy),
        ).subscribe((lottery: Lottery): void => {
            this.lottery = lottery;
            this.setPrizesParams();
            this.cdr.markForCheck();
        });

        this.setPrizesParams();
    }

    public get showTicketsCounter(): boolean {
        return this.isAuth;
    }

    public updateView(): void {
        this.update$.next();
        this.cdr.markForCheck();
    }

    private setPrizesParams(): void {
        this.prizesParams = _assign(_merge(this.$params.prizesParams, {
            lottery: this.lottery,
        }));
        this.cdr.markForCheck();
    }
}
