import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';

import {StateService} from '@uirouter/core';

import {
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';

import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {LotteryAbstract} from 'wlc-engine/modules/lotteries/system/classes/lottery-abstract.class';

import * as Params from './lottery-detail.params';

@Component({
    selector: '[wlc-lottery-detail]',
    templateUrl: './lottery-detail.component.html',
    styleUrls: ['./styles/lottery-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryDetailComponent extends LotteryAbstract<Params.ILotteryDetailCParams> implements OnInit {
    @Input() protected inlineParams: Params.ILotteryDetailCParams;

    public override $params: Params.ILotteryDetailCParams;
    public showLevelsSection: boolean;

    private alias: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryDetailCParams,
        configService: ConfigService,
        eventService: EventService,
        lotteriesService: LotteriesService,
        cdr: ChangeDetectorRef,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, lotteriesService, eventService, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.alias = this.stateService.params.alias;

        await this.getLottery({alias: this.alias});

        if (!this.lottery) {
            this.stateService.go('app.error');
        }

        this.showLevelsSection = !this.lottery.isForAllLevels;
    }

    public get showCta(): boolean {
        return this.isAuth && this.lottery.checkUserLevel && !this.lottery.isEnded;
    }
}
