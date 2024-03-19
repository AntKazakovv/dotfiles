import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
    EventService,
} from 'wlc-engine/modules/core';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {IButtonCParams} from 'wlc-engine/modules/core';
import {ILotteryDetailCParams} from 'wlc-engine/modules/lotteries/components/lottery-detail/lottery-detail.params';

import * as Params from './lottery-cta.params';

@Component({
    selector: '[wlc-lottery-cta]',
    templateUrl: './lottery-cta.component.html',
    styleUrls: ['./styles/lottery-cta.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryCtaComponent extends AbstractComponent implements OnInit {
    @Input() public lottery: Lottery;
    @Input() protected inlineParams: Params.ILotteryCtaCParams;

    public override $params: Params.ILotteryCtaCParams;
    public ticketsCount$: BehaviorSubject<number> = new BehaviorSubject(0);
    public ctaBtnParams: IButtonCParams;

    private isDeposit: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryCtaCParams,
        protected override configService: ConfigService,
        protected lotteriesService: LotteriesService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected translateService: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.isDeposit = this.$params.type === 'deposit';

        if (this.isDeposit) {
            this.ctaBtnParams = this.$params.readMoreBtnParams;
            this.setDepositSubscribers();
        } else {
            this.ctaBtnParams = this.$params.depositBtnParams;
        }
    }

    public get title(): string {
        return this.isDeposit ? this.lottery.name : gettext('Get more tickets!');
    }

    public calcTicketsCount(amount: number): void {
        const count: number = this.lottery.calcTicketsCount(amount);
        this.ticketsCount$.next(count);
    }

    public btnClickHandler($event: MouseEvent): void {
        $event.preventDefault();
        if (this.isDeposit) {
            this.showLotteryDetail();
        }
    }

    public get showTicketsCounter(): boolean {
        return this.isDeposit && this.$params.showTicketsCounter;
    }

    protected setDepositSubscribers(): void {
        this.$params.lottery$.pipe(
            takeUntil(this.$destroy)).subscribe((lottery: Lottery) => {
            if (lottery) {
                this.lottery = lottery;
            }
        });

        this.$params.amount$.pipe(takeUntil(this.$destroy)).subscribe((val: number) => {
            this.calcTicketsCount(val);
        });

        this.lotteriesService.setDepositSubscriber();
    }

    protected showLotteryDetail(): void {

        this.modalService.showModal({
            id: 'lottery-detail',
            size: 'xl',
            componentName: 'lotteries.wlc-lottery-detail',
            componentParams: <ILotteryDetailCParams>{
                lottery: this.lottery,
            },
            showFooter: false,
        });
    }
}
