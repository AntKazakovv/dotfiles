import {
    Component,
    OnInit,
    Input,
    Inject,
    ChangeDetectorRef,
} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import _each from 'lodash-es/each';
import _set from 'lodash-es/set';
import _size from 'lodash-es/size';

import {
    AbstractComponent,
    IFormWrapperCParams,
    ITableCParams,
    ISelectOptions,
    EventService,
    ModalService,
    ConfigService,
    NotificationEvents,
    IPushMessageParams,
    ILimitationTypeItem,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {LimitationService} from 'wlc-engine/modules/user/system/services/limitation/limitation.service';

import * as Params from './limitations.params';

@Component({
    selector: '[wlc-limitations]',
    templateUrl: './limitations.component.html',
    styleUrls: ['./styles/limitations.component.scss'],
})
export class LimitationsComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILimitationsCParams;
    @Input() public useText: boolean;
    public $params: Params.ILimitationsCParams;
    public loading: boolean = true;

    public formConfig: IFormWrapperCParams = {
        class: 'wlc-form-wrapper',
        components: [
            Params.limitType,
            Params.limitAmount,
            Params.limitPeriod,
            Params.submitBtn,
        ],
    };

    public formData = new BehaviorSubject({});
    public limits: BehaviorSubject<any[]> = new BehaviorSubject([]);

    protected pending: boolean = false;
    protected form: FormGroup;

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
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService);
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.patchLimitTypeItems();
        await this.getLimits();
        this.eventService.subscribe({name: 'remove_exclusion'}, () => {
            this.getLimits();
        }, this.$destroy);

        this.eventService.subscribe({name: 'SELECT_CHOSEN_LIMITTYPE'}, (data: ISelectOptions) => {
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
                            Params.limitAmount,
                            Params.limitPeriod,
                            Params.submitBtn,
                        ],
                    };
            }
            this.formData.next(this.form.value);
        }, this.$destroy);
    }

    public getForm(form: FormGroup): void {
        this.form = form;
    }

    public showModal(name: string, slug: string): void {
        this.modalService.showModal(name, {slug, parseAsPlainHTML: true, shouldClearStyles: true});
    }

    public async onSubmit(form: FormGroup): Promise<void> {
        if (this.pending) {
            return;
        }

        this.pending = true;

        switch (form.value.limitType) {
            case 'MaxDepositSum':
            case 'MaxBetSum':
            case 'MaxLossSum':
                if (!+form.value.limitAmount) {
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
                    return;
                }
                try {
                    await this.limitationService.setUserSelfExclusion({
                        type: `${form.value.limitType}${form.value.limitPeriod}`,
                        value: form.value.limitAmount,
                    });
                } catch (error) {
                    //
                }
                break;

            case 'realityChecker':
                try {
                    const result = await this.userService.updateProfile({
                        extProfile: {
                            realityCheckTime: form.value.limitTime,
                        },
                    }, true);

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
                return;
            default:
                break;
        }

        await this.getLimits();
        this.pending = false;
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

    protected async getLimits(): Promise<void> {
        this.loading = true;
        const limits = [];
        await this.userService.userProfile$.pipe(first((v) => !!v)).toPromise();
        if (this.userService.userProfile.extProfile.realityCheckTime && this.limitationService.realityCheckEnabled) {
            limits.push({
                type: 'realityChecker',
                typeText: gettext('Reality checker'),
                amountValue: {
                    valueType: 'realityChecker',
                    value: this.userService.userProfile.extProfile.realityCheckTime,
                },
            });
        }

        const selfExclusion = await this.limitationService.getUserSelfExclusion();
        _each(selfExclusion, (item, key) => {
            if (Params.limitTypeTexts[key] && item !== '0') {
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
