import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    OnDestroy,
} from '@angular/core';

import {
    BehaviorSubject,
    Subscription,
    of,
} from 'rxjs';
import {
    concatMap,
    delay,
    takeUntil,
} from 'rxjs/operators';

import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
} from 'wlc-engine/modules/core';

import {LatestBetsService} from 'wlc-engine/modules/promo/system/services/latest-bets/latest-bets.service';
import {LatestBetsModel} from 'wlc-engine/modules/promo/system/models';
import {ILatestBetsItemCParams} from 'wlc-engine/modules/promo/components/latest-bets-item/latest-bets-item.params';

import * as Params from './latest-bets.params';

@Component({
    selector: '[wlc-latest-bets]',
    templateUrl: './latest-bets.component.html',
    styleUrls: ['./styles/latest-bets.component.scss'],
    providers: [LatestBetsService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestBetsComponent extends AbstractComponent implements OnInit, OnDestroy {

    public ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public override $params: Params.ILatestBetsCParams;
    public allBetsModels: LatestBetsModel[] = [];
    public highRollersModels: LatestBetsModel[] = [];
    public allBets$: BehaviorSubject<LatestBetsModel[]> = new BehaviorSubject([]);
    protected isFiltered: boolean = false;
    protected dataBetSub: Subscription;
    protected dataCacheSub: Subscription;
    protected highRollersSub: Subscription;
    private maxBetsBuffer: number = 20;
    private isAuth: boolean;

    constructor(
        @Inject('injectParams') protected params: Params.ILatestBetsCParams,
        cdr: ChangeDetectorRef,
        protected latestBetsService: LatestBetsService,
        protected eventService: EventService,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ILatestBetsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit();
        this.latestBetsService.setMinBet(this.$params.highRollersValue);
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        if (!this.isAuth) {
            this.latestBetsService.fetchWSConnectData();
        }
        this.setSubscription();
        this.cdr.markForCheck();
    }

    public override ngOnDestroy(): void {
        this.dataBetSub.unsubscribe();
    }

    public prepareBetParams(bet?: LatestBetsModel): ILatestBetsItemCParams {
        return _merge(
            {
                bet: bet,
            },
            this.$params.bet || {},
        );
    }

    protected fillSequence(bets: LatestBetsModel[], betsCount: number): LatestBetsModel[] {
        if (bets.length > 0 && bets.length < this.$params.betsCount){
            let result: LatestBetsModel[] = [];
            while (result.length < betsCount) {
                result = result.concat(bets);
            }
            return result;
        }
        return bets;
    }

    protected betsFilter(setFilter: boolean): LatestBetsModel[] {
        let result: LatestBetsModel[] = this.allBetsModels;

        if (setFilter) {
            this.isFiltered = true;
            this.allBets$.next(this.highRollersModels.slice(0, this.$params.betsCount));
        } else {
            this.allBets$.next(result.slice(0,this.$params.betsCount));
            this.isFiltered = false;
        }
        this.ready.next(true);
        return result;
    }

    protected setSubscription(): void {
        this.eventService.filter(
            {name: 'LOGOUT'},
            this.$destroy)
            .subscribe({
                next: () => {
                    this.dataBetSub.unsubscribe();
                    this.latestBetsService.fetchWSConnectData();
                    this.latestBetsService.fetchLastCacheBets();
                    this.cdr.markForCheck();
                },
            });

        this.eventService.filter(
            {name: 'LOGIN'},
            this.$destroy)
            .subscribe({
                next: () => {
                    this.dataBetSub.unsubscribe();
                    this.setWSSubscription();
                },
            });

        this.dataCacheSub = this.latestBetsService.getLatestBetsCache().pipe(
            takeUntil(this.$destroy))
            .subscribe((bets: LatestBetsModel[]) => {
                if (bets) {
                    bets = this.fillSequence(bets, this.$params.betsCount);
                    this.betsFilter(this.isFiltered);
                    this.allBetsModels = bets
                        .filter((item) => (item.betType === 'win'
                        || item.betType === 'zerocredit') &&
                        item instanceof LatestBetsModel)
                        .map((item: LatestBetsModel) => {
                            return item;
                        });
                    this.setWSSubscription();
                }
            });

        this.highRollersSub = this.latestBetsService.getLatestHighRollers().pipe(
            takeUntil(this.$destroy)).subscribe((bets: LatestBetsModel[]) => {
            if (bets){
                bets = this.fillSequence(bets, this.$params.betsCount);
                this.highRollersModels = bets;
                this.betsFilter(this.isFiltered);
            }
        },
        );
    }

    private setWSSubscription(): void {
        this.dataBetSub = this.latestBetsService.getLatestBet('wsc2').pipe(
            concatMap(item => of(item).pipe(delay(1000))),
            takeUntil(this.$destroy))
            .subscribe((bet: LatestBetsModel) => {
                if (bet && (bet.betType === 'win' || bet.betType === 'zerocredit') && bet.multiplier >= 0) {
                    this.allBetsModels.unshift(bet);
                    if (this.allBetsModels.length > this.maxBetsBuffer) {
                        this.allBetsModels.pop();
                    }

                    if (bet.betAmountEUR > this.$params.highRollersValue) {
                        this.highRollersModels.unshift(bet);
                        if (this.highRollersModels.length > this.maxBetsBuffer) {
                            this.highRollersModels.pop();
                        }
                    }
                    this.betsFilter(this.isFiltered);
                }
            });
    }
}
