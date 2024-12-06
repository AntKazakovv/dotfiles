import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {StateService} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';

import {
    AbstractComponent,
    EventService,
    IButtonCParams,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    UserInfo,
    UserProfile,
} from 'wlc-engine/modules/user';
import {Bonus} from 'wlc-engine/modules/bonuses';

import * as Params from './confirm-improvement-modal.params';

@Component({
    selector: '[wlc-confirm-improvement-modal]',
    templateUrl: './confirm-improvement-modal.component.html',
    styleUrls: ['./styles/confirm-improvement-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmImprovementModalComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IConfirmImprovementModalCParams;

    public override $params: Params.IConfirmImprovementModalCParams;
    public bonusBgUrl!: string;
    public mainBtnParams!: IButtonCParams;
    public rejectBtnParams!: IButtonCParams;
    public messages!: string[];
    public improvementPrice!: number;
    public userBalance!: number;
    public currency!: string;

    protected isInsufficientBalance!: boolean;
    protected readonly eventService: EventService = inject(EventService);
    protected readonly stateService: StateService = inject(StateService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IConfirmImprovementModalCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.bonusBgUrl = this.configService.get<boolean>('$bonuses.useNewImageSources')
            ? `url(${this.$params.bonus.imageDescription ?? ''})`
            : `url(${this.$params.bonus.imageOther ?? ''})`;

        const userInfo: UserInfo = this.configService
            .get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .getValue();
        const userProfile: UserProfile = this.configService
            .get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .getValue();

        this.currency = userProfile.currency;
        this.improvementPrice = +this.$params.bonus.lootboxPrice?.[this.currency];
        this.userBalance = userInfo.balance;
        this.isInsufficientBalance = this.userBalance < this.improvementPrice;

        if (this.isInsufficientBalance) {
            this.mainBtnParams = {...this.$params.depositBtnParams};
            this.rejectBtnParams = {...this.$params.backBtnParams};
            this.messages = [this.$params.textImprovementUnavailable];
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: {
                    type: 'error',
                    title: this.$params.insufficientBalanceTitle,
                    message: this.$params.insufficientBalanceMessage,
                } as IPushMessageParams,
            });
        } else {
            this.mainBtnParams = {...this.$params.agreeBtnParams};
            this.rejectBtnParams = {...this.$params.disagreeBtnParams};
            this.messages = [
                this.$params.textImprovementAvailable,
                this.$params.textConfirmation,
            ];
        }
    }

    public mainBtnClick(): void {
        if (this.isInsufficientBalance) {
            this.stateService.go('app.profile.cash.deposit');
        } else {
            this.$params.onConfirm(this.$params.bonus).then((): void => {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: {
                        type: 'success',
                        title: this.$params.purchaseTitle,
                        message: this.$params.purchaseMessage,
                    } as IPushMessageParams,
                });
            });
        }
    }

    public rejectBtnClick(): void {
        this.$params.onReject().finally();
    }

    public get bonus(): Bonus {
        return this.$params.bonus;
    }

    public get digitsInfo(): string {
        return this.$params.digitsInfo;
    }

    public get textBalance(): string {
        return this.$params.textBalance;
    }

    public get textPrice(): string {
        return this.$params.textPrice;
    }
}
