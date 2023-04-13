import {
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {CashbackService} from 'wlc-engine/modules/cashback/system/services/cashback/cashback.service';
import {CashbackPlanModel} from 'wlc-engine/modules/cashback/system/models/cashback-plan.model';
import {
    EventService,
    IPaginateOutput,
    IPushMessageParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';

import * as Params from './cashback-rewards.params';

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
    public itemCashback: BehaviorSubject<CashbackPlanModel[]> = new BehaviorSubject([]);
    public ready: BehaviorSubject<boolean> = new BehaviorSubject(false);
    protected itemsPerPage: number = 0;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICashbackRewardCParams,
        protected cashbackService: CashbackService,
        protected modalService: ModalService,
        protected eventService: EventService,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, null, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.cashbackService.cashbackPlans
            .subscribe((cashbackPlans: CashbackPlanModel[]): void => {
                this.paginatedCashbackPlans = cashbackPlans;
                this.itemCashback.next(cashbackPlans);
            });

        if (this.itemCashback.getValue().length > 0) {
            this.ready.next(true);
        }
        await this.cashbackService.fetchCashback();
        this.ready.next(true);
    }

    /**
     * Cashback reward claim
     *
     * @method claimCashback
     * @param {string} id - cashback plan id
     * @returns {Promise<void>}
     */
    public async claimCashback(id: string): Promise<void> {
        try {
            await this.cashbackService.claimRewardById(id);
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Success'),
                    message: gettext('Success'),
                },
            });
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Error'),
                    message: error?.errors || gettext('Something wrong. Please try later.'),
                },
            });
        } finally {
            await this.cashbackService.fetchCashback();
        }
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
        this.ready.next(false);
        await this.cashbackService.fetchCashback();
        this.ready.next(true);
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
        this.itemCashback.next(value.paginatedItems);
        this.itemsPerPage = value.event.itemsPerPage;
        this.cdr.detectChanges();
    }
}
