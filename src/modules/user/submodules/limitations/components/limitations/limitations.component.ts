import {
    Component,
    OnInit,
    Input,
    Inject,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import _each from 'lodash-es/each';
import _set from 'lodash-es/set';
import _size from 'lodash-es/size';
import _isNil from 'lodash-es/isNil';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    IFormWrapperCParams,
    IPushMessageParams,
    ISelectOptions,
    ITableCParams,
    ModalService,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {
    LimitationService,
} from 'wlc-engine/modules/user/submodules/limitations/system/services/limitation/limitation.service';
import {
    ILimitationTypeItem,
    TLimitationType,
} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces/limitations.interface';

import * as Params from './limitations.params';

@Component({
    selector: '[wlc-limitations]',
    templateUrl: './limitations.component.html',
    styleUrls: ['./styles/limitations.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimitationsComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILimitationsCParams;
    @Input() public useText: boolean;
    public override $params: Params.ILimitationsCParams;
    public loading: boolean = true;

    public formConfig: IFormWrapperCParams;

    public formData = new BehaviorSubject({});
    public limits: BehaviorSubject<any[]> = new BehaviorSubject([]);

    protected pending: boolean = false;
    protected form: UntypedFormGroup;
    protected useZeroBalance: boolean = null;

    public tableData: ITableCParams = {
        head: Params.tableConfig,
        rows: this.limits,
    };

    constructor(
        @Inject('injectParams') protected params: Params.ILimitationsCParams,
        protected userService: UserService,
        protected limitationService: LimitationService,
        protected eventService: EventService,
        protected modalService: ModalService,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.patchLimitTypeItems();
        await this.setLimits();

        this.formConfig = {
            class: 'wlc-form-wrapper',
            components: [
                Params.limitType,
                Params.limitAmount(this.useZeroBalance),
                Params.limitPeriod,
                Params.submitBtn,
            ],
        };

        this.eventService.subscribe({name: 'remove_exclusion'}, () => {
            this.setLimits();
        }, this.$destroy);

        this.eventService.subscribe({name: 'SELECT_CHOSEN_LIMITTYPE'}, (data: ISelectOptions<TLimitationType>) => {
            switch (data.value) {
                case 'realityChecker':
                    this.formConfig = {
                        class: this.formConfig.class,
                        components: [
                            Params.limitType,
                            Params.realityCheckerPeriod,
                            Params.submitBtn,
                        ],
                    };
                    break;
                case 'timeOut':
                    this.formConfig = {
                        class: this.formConfig.class,
                        components: [
                            Params.limitType,
                            Params.timeOutPeriod,
                            Params.submitBtn,
                        ],
                    };
                    break;
                default:
                    this.formConfig = {
                        class: this.formConfig.class,
                        components: [
                            Params.limitType,
                            Params.limitAmount(
                                this.isTypeLimitationsForZeroBalance(data.value) ? this.useZeroBalance : null,
                            ),
                            Params.limitPeriod,
                            Params.submitBtn,
                        ],
                    };
            }
            this.formData.next(this.form.value);
        }, this.$destroy);
    }

    public getForm(form: UntypedFormGroup): void {
        this.form = form;
    }

    public showModal(name: string, slug: string): void {
        this.modalService.showModal(name, {slug, parseAsPlainHTML: true, shouldClearStyles: true});
    }

    public async onSubmit(form: UntypedFormGroup): Promise<boolean> {
        if (this.pending) {
            return false;
        }

        this.pending = true;

        switch (form.value.limitType) {
            case 'MaxDepositSum':
            case 'MaxBetSum':
            case 'MaxLossSum':
                if (!+form.value.limitAmount && (!this.useZeroBalance ||
                    (this.useZeroBalance && !this.isTypeLimitationsForZeroBalance(form.value.limitType)))
                ) {
                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'error',
                            title: gettext('Profile update failed'),
                            message: gettext('The entered amount is less than the minimum'),
                            wlcElement: 'notification_profile-update-error',
                        },
                    });
                    this.pending = false;
                    return false;
                }
                try {
                    await this.limitationService.setUserSelfExclusion({
                        type: `${form.value.limitType}${form.value.limitPeriod}`,
                        value: form.value.limitAmount,
                    });
                } catch (error) {
                    //
                    return false;
                }
                break;

            case 'realityChecker':
                try {
                    const result = await this.userService.updateProfile({
                        extProfile: {
                            realityCheckTime: form.value.limitTime,
                        },
                    }, {updatePartial: true});

                    if (result) {
                        this.eventService.emit({
                            name: NotificationEvents.PushMessage,
                            data: <IPushMessageParams>{
                                type: 'success',
                                title: gettext('Profile updated successfully'),
                                message: gettext('Your profile has been updated successfully'),
                                wlcElement: 'notification_profile-update-success',
                            },
                        });
                    }
                } catch (error) {
                    this.eventService.emit({
                        name: NotificationEvents.PushMessage,
                        data: <IPushMessageParams>{
                            type: 'error',
                            title: gettext('Profile update failed'),
                            message: error,
                            wlcElement: 'notification_profile-update-error',
                        },
                    });
                    return false;
                }
                break;

            case 'timeOut':
                this.modalService.showModal({
                    id: 'limit-cancel-confirm',
                    modalTitle: gettext('Confirmation'),
                    modifier: 'confirmation',
                    modalMessage: gettext('Are you sure?'),
                    showConfirmBtn: true,
                    closeBtnParams: {
                        themeMod: 'secondary',
                        common: {
                            text: gettext('No'),
                        },
                    },
                    confirmBtnText: gettext('Yes'),
                    textAlign: 'center',
                    onConfirm: async () => {
                        try {
                            await this.limitationService.userSelfDisable(parseInt(form.value.limitTime, 10));
                        } catch (error) {
                            //
                        }
                    },
                    onModalHide: () => {
                        this.pending = false;
                    },
                    dismissAll: true,
                });
                return false;
            default:
                break;
        }

        await this.setLimits();
        this.pending = false;
        return true;
    }

    /**
     * Includes the specified limits
     */
    protected async patchLimitTypeItems(): Promise<void> {
        const types: ILimitationTypeItem[] = this.configService
            .get<ILimitationTypeItem[]>('$base.profile.limitations.limitTypes');

        if (_size(types)) {
            _set(Params, 'limitType.params.items', types);
        }
    }

    protected isTypeLimitationsForZeroBalance(type: TLimitationType): boolean {
        return type === 'MaxDepositSum' || type === 'MaxBetSum';
    }

    protected async setLimits(): Promise<void> {
        this.loading = true;
        const limits = [];
        await this.userService.userProfile$.pipe(first((v) => !!v)).toPromise();
        if (this.userService.userProfile.extProfile.realityCheckTime && this.limitationService.realityCheckEnabled) {
            limits.push({
                type: 'realityChecker',
                typeText: gettext('Activity checker'),
                amountValue: {
                    valueType: 'realityChecker',
                    value: this.userService.userProfile.extProfile.realityCheckTime,
                },
            });
        }

        const selfExclusion = await this.limitationService.getUserSelfExclusion();

        if (_isNil(this.useZeroBalance) && selfExclusion.ZeroLimits) {
            this.useZeroBalance = true;
        }

        _each(selfExclusion, (item, key) => {
            if (Params.limitTypeTexts[key] && (item !== '0' || this.useZeroBalance)) {
                limits.push({
                    type: key,
                    typeText: Params.limitTypeTexts[key],
                    amountValue: {
                        valueType: key,
                        value: item,
                    },
                });
            }
        });

        this.limits.next(limits);
        this.loading = false;
        this.cdr.markForCheck();
    }
}
