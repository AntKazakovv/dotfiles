import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Inject,
    Input,
    inject,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';
import {
    filter,
    takeUntil,
    map,
    tap,
    take,
} from 'rxjs/operators';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
    LogService,
    ILastWithdraw,
} from 'wlc-engine/modules/core';
import {Transaction} from 'wlc-engine/modules/history';
import {
    UserProfile,
    UserService,
} from 'wlc-engine/modules/user';
import {FinancesService} from 'wlc-engine/modules/finances/system/services';

import * as Params from './withdraw-cancel-widget.params';

@Component({
    selector: '[wlc-withdraw-cancel]',
    templateUrl: './withdraw-cancel-widget.component.html',
    styleUrls: ['./styles/withdraw-cancel-widget.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WithdrawCancelWidgetComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IWithdrawCancelWidgetCParams;
    public override $params: Params.IWithdrawCancelWidgetCParams;
    public currentPendingWithdraw: Transaction | null = null;

    protected readonly userService: UserService = inject(UserService);
    protected readonly eventService: EventService = inject(EventService);
    protected readonly financesService: FinancesService = inject(FinancesService);
    protected override readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly logService: LogService = inject(LogService);
    protected override configService: ConfigService = inject(ConfigService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IWithdrawCancelWidgetCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.subscribeToWS();
        this.subscribeToUserProfile();
    }

    public async cancelWithdraw(): Promise<void> {
        this.financesService.cancelWithdrawal(this.currentPendingWithdraw.id)
            .catch((error: any): void => {
                this.logService.sendLog({
                    code: '17.8.0',
                    data: error,
                    from: {
                        component: 'WithdrawCancelWidgetComponent',
                        method: 'cancelWithdraw',
                    },
                });
            })
            .finally(()=> {
                this.currentPendingWithdraw = null;
                this.cdr.markForCheck();
            });
    }

    public async hideWidget(): Promise<void> {
        await this.writeToProfile(this.currentPendingWithdraw = null);
    }

    public get formattedDateWithdraw(): string {
        return this.currentPendingWithdraw.date.format(this.$params.transactionDateFormat);
    }

    public get amountValue(): number {
        return Math.abs(this.currentPendingWithdraw.amount);
    }

    protected subscribeToWS(): void {
        this.userService.userWithdrawCancelWSData$
            .pipe(
                filter(data => !!data),
                tap(async (websocketData: ILastWithdraw) => {
                    if (websocketData.Status === 0) {
                        this.currentPendingWithdraw = await this.getWithdrawById(websocketData.ID);
                        this.writeToProfile(this.currentPendingWithdraw.id);
                    } else {
                        this.writeToProfile(this.currentPendingWithdraw = null);
                    }

                    this.cdr.markForCheck();
                }),
                takeUntil(this.$destroy),
            ).subscribe();
    }

    protected subscribeToUserProfile(): void {
        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(
                filter((profile: UserProfile) => !!profile?.extProfile.lastPendingWithdrawId),
                take(1),
                map((userProfile: UserProfile): number => userProfile.extProfile?.lastPendingWithdrawId),
                tap(async (transactionID: number) => {
                    this.currentPendingWithdraw = await this.getWithdrawById(transactionID);

                    this.cdr.markForCheck();
                }),
            ).subscribe();
    }

    protected async writeToProfile(id: number | null): Promise<void> {
        try {
            await this.userService.updateProfile({
                extProfile: {
                    lastPendingWithdrawId: id,
                },
            }, {updatePartial: true});
        } catch (error) {
            this.logService.sendLog({
                code: '1.1.26',
                data: error,
                from: {
                    component: 'WithdrawCancelWidgetComponent',
                    method: 'writeToProfile',
                },
            });
        }
    }

    protected async getWithdrawById(id: number): Promise<Transaction | null> {
        const transactions: Transaction[] = await this.financesService.getPendingWithdraws();

        if (!transactions.length) {
            return null;
        }

        const index: number = transactions.findIndex((item: Transaction) => item.id === id && item.allowCancelation);

        if (index !== -1) {
            return transactions[index];
        }

        return null;
    }
}
