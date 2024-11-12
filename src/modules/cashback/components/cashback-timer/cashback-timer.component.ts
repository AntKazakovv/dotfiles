import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    OnInit,
    Signal,
    computed,
} from '@angular/core';
import type {Dayjs} from 'dayjs';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {CashbackTimerController} from 'wlc-engine/modules/cashback/system/classes/casback-timer.controller';
import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models';
import * as Params from './cashback-timer.params';

@Component({
    selector: '[wlc-cashback-timer]',
    templateUrl: './cashback-timer.component.html',
    styleUrls: ['./styles/cashback-timer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [CashbackTimerController],
})
export class CashbackTimerComponent extends AbstractComponent implements OnInit {
    public override $params!: Params.ICashbackTimerCParams;
    public isShowTimer: Signal<boolean> = computed(() => {
        return !this.closestCashback?.isPending;
    });
    protected controller: CashbackTimerController = inject(CashbackTimerController);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICashbackTimerCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    override ngOnInit(): void {
        super.ngOnInit();
        this.controller.fetchCashbackPlans();
    }

    public get ready(): Signal<boolean> {
        return this.controller.ready;
    }

    public get closestCashback(): CashbackPlanModel | undefined {
        return this.controller.closestCashback();
    }

    public get timerValue(): Dayjs {
        return this.controller.timerValue;
    }

    public get timerText(): string {
        return this.$params.timerText;
    }

    public get titleText(): string {
        return this.$params.titleText;
    }

    public get calculatingText(): string {
        return this.$params.calculatingText;
    }

    public get decorImagePath(): string {
        return this.$params.decorImagePath;
    }

    public onTimerEnd(): void {
        this.controller.fetchCashbackPlans();
    }
}
