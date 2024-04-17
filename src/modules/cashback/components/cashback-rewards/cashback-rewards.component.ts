import {DateTime} from 'luxon';
import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    BehaviorSubject,
    takeUntil,
} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {CashbackService} from 'wlc-engine/modules/cashback/system/services/cashback/cashback.service';
import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models/cashback-plan.model';
import {
    ConfigService,
    EventService,
    IPaginateOutput,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    CashbackController,
    ICashbackController,
} from 'wlc-engine/modules/cashback/system/classes/cashback.controller';
import {ICashbackReward} from 'wlc-engine/modules/cashback';

import * as Params from './cashback-rewards.params';

export type TCashbackType = 'deposit' | 'default';

/**
 * Claim reward component.
 *
 * @example
 *
 * {
 *     name: 'finances.wlc-cashback-rewards',
 * }
 *
 */

@Component({
    selector: '[wlc-cashback-rewards]',
    templateUrl: './cashback-rewards.component.html',
    styleUrls: ['./styles/cashback-rewards.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CashbackRewardsComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams!: Params.ICashbackRewardCParams;

    public override $params!: Params.ICashbackRewardCParams;
    public paginatedCashbackPlans: CashbackPlanModel[] = [];
    public itemCashback$: BehaviorSubject<CashbackPlanModel[]> = new BehaviorSubject([]);
    public ready$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    public depositCashback: CashbackPlanModel;
    public cashbackType: TCashbackType = 'default';

    protected itemsPerPage: number = 0;
    protected cashbackController: ICashbackController;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICashbackRewardCParams,
        protected cashbackService: CashbackService,
        protected eventService: EventService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);


        this.cashbackController = new CashbackController(
            this.configService,
            this.cashbackService,
            this.$destroy,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.cashbackType = this.cashbackController.cashbackType;

        this.cashbackController.cashback$
            .pipe(takeUntil(this.$destroy))
            .subscribe((cashback: CashbackPlanModel[]) => {

                if (this.cashbackType === 'deposit') {
                    this.depositCashback = cashback[0];

                    return;
                }

                this.paginatedCashbackPlans = cashback;
                this.itemCashback$.next(cashback);
            });

        await this.cashbackController.getCashbackPlans();

        this.ready$.next(true);
    }

    public get isNotAvailableCashback(): boolean {
        return !this.depositCashback.isAvailable;
    }

    public get timerValue(): DateTime {
        const defaultTime = DateTime.fromSQL(this.depositCashback.availableAt);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    public get showTimer(): boolean {
        return this.timerValue.toMillis() > DateTime.local().toMillis();
    }

    /**
     * Cashback reward claim
     *
     * @method claimCashback
     * @param {string} id - cashback plan id
     * @returns {Promise<void>}
     */
    public async claimCashback(id: string): Promise<void> {
        this.ready$.next(false);

        try {
            const reward: ICashbackReward = await this.cashbackController.claimRewardById(id);

            if (reward) {
                this.showSuccessClaimCashbackMessage(reward);
            } else {
                this.showErrorMessage(null);
            }
        } catch (error) {
            this.showErrorMessage(error);
        } finally {
            await this.cashbackController.fetchCashback();
        }

        this.ready$.next(true);
    }

    /**
     * Cashback availability
     *
     * @method trackAvailable
     * @returns {boolean}
     */
    public trackAvailable(index: number, section: CashbackPlanModel): boolean {
        return section.isAvailable;
    }

    /**
     * Cashback amount
     *
     * @method trackAmount
     * @returns {number}
     */
    public trackAmount(index: number, section: CashbackPlanModel): number {
        return section.amount;
    }

    /**
     * Method called on timer expiry
     *
     * @method timerExpiry
     * @returns {Promise<void>}
     */
    public async timerExpiry(): Promise<void> {
        this.updateCashback();
    }

    public depositTimerEnd(): void {
        if (this.isNotAvailableCashback) {
            this.updateCashback();
        }
    }
    /**
     * Method called on button click
     *
     * @method buttonClick
     * @param {CashbackPlanModel} item - cashback plan
     */
    public buttonClick(item: CashbackPlanModel): void {
        item.isAvailable && item.amount > 0 ? this.claimCashback(item.id) : '';
    }

    /**
     * Method updates the data when there was a change in `wlc-pagination` component
     *
     * @method paginationOnChange
     * @param {IPaginateOutput} value - $event output from `wlc-pagination` component
     */
    public paginationOnChange(value: IPaginateOutput<CashbackPlanModel>): void {
        this.itemCashback$.next(value.paginatedItems);
        this.itemsPerPage = value.event.itemsPerPage;
        this.cdr.detectChanges();
    }

    private async updateCashback(): Promise<void> {
        this.ready$.next(false);
        await this.cashbackController.fetchCashback();
        this.ready$.next(true);
    }

    /**
     * Method show success claim reward notification
     *
     * @method showSuccessClaimCashbackMessage
     * @param {ICashbackReward} reward - cashback reward data
     */
    private showSuccessClaimCashbackMessage(reward: ICashbackReward): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title: gettext('Success'),
                message: gettext('Cashback has been credited to your account: {{amount}} {{currency}}'),
                messageContext: {
                    amount: reward.amount,
                    currency: reward.currency,
                },
            },
        });
    }

    /**
     * Method show error notification
     *
     * @method showErrorMessage
     * @param {any} error - some error
     */
    private showErrorMessage(error?: any): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title: gettext('Error'),
                message: error?.errors || gettext('Something wrong. Please try later.'),
            },
        });
    }
}
