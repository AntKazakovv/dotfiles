import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnDestroy,
} from '@angular/core';

import {StateService} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';
import {
    filter,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    EventService,
} from 'wlc-engine/modules/core';
import {LotteriesService} from 'wlc-engine/modules/lotteries/system/services/lotteries.service';
import {ILotteryFetchParams} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {LotteryController} from 'wlc-engine/modules/lotteries/system/classes/lottery.controller';

import * as Params from './lottery-detail.params';

@Component({
    selector: '[wlc-lottery-detail]',
    templateUrl: './lottery-detail.component.html',
    styleUrls: ['./styles/lottery-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LotteryDetailComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ILotteryDetailCParams;

    public lottery: Lottery;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public override $params: Params.ILotteryDetailCParams;
    protected lotteryController: LotteryController;

    private _hasHistory: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILotteryDetailCParams,
        protected eventService: EventService,
        protected lotteriesService: LotteriesService,
        protected stateService: StateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.pending$.next(true);
        const params: ILotteryFetchParams = this.prepareFetchParams();

        this.lotteryController = new LotteryController(
            this.lotteriesService,
            this.configService,
            this.eventService,
            params,
        );

        if (this.$params.lottery) {
            this.lottery = this.$params.lottery;
        } else {
            await this.lotteryController.fetchLottery();
        }

        this.lotteryController.lottery$.pipe(
            filter((lottery) => !!lottery),
            takeUntil(this.$destroy),
        ).subscribe((lottery: Lottery) => {
            this.lottery = lottery;
            this.cdr.markForCheck();
        });

        this.pending$.next(false);

        if (!this.lottery) {
            this.stateService.go('app.error');
        }
    }

    public get showLevelsSection(): boolean {
        return !this.lottery.isForAllLevels;
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();
        this.lotteryController.destroy();
    }

    public get isAuth(): boolean {
        return this.lotteryController.isAuth;
    }

    public prepareFetchParams(): ILotteryFetchParams {
        return {
            alias: this.stateService.params.alias,
            usersPerPlace: this.configService.get<number>('$lotteries.results.usersPerPlace'),
        };
    }

    public get showCta(): boolean {
        return this.isAuth
            && this.lottery.checkUserLevel
            && !this.lottery.isWaitingForStart
            && !this.lottery.isTicketSaleStopped;
    }

    public get hasHistory(): boolean {
        return this._hasHistory;
    }

    public onHistoryLoaded(hasHistory: boolean): void {
        this._hasHistory = hasHistory;
    }
}
