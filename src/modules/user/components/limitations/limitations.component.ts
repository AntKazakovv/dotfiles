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
import {
    AbstractComponent,
    IFormWrapperCParams,
    ITableCParams,
    ISelectOptions,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    UserService,
    LimitationService,
} from 'wlc-engine/modules/user/system/services';

import * as Params from './limitations.params';

import _each from 'lodash-es/each';

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

    protected limits: BehaviorSubject<any[]> = new BehaviorSubject([]);
    protected pending: boolean = false;
    protected form: FormGroup;

    public tableData: ITableCParams = {
        noItemsText: gettext('No limitations set'),
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
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
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

    public async onSubmit(form: FormGroup): Promise<void> {
        if (this.pending) {
            return;
        }

        this.pending = true;

        switch (form.value.limitType) {
            case 'MaxDepositSum':
            case 'MaxBetSum':
            case 'MaxLossSum':
                try {
                    const params = {};
                    params[`${form.value.limitType}${form.value.limitPeriod}`] = form.value.limitAmount;
                    await this.limitationService.setUserSelfExclusion(params);
                } catch (error) {
                    //
                }
                break;

            case 'realityChecker':
                try {
                    await this.userService.updateProfile({
                        extProfile: {
                            realityCheckTime: form.value.limitTime,
                        },
                    }, true);
                } catch (error) {
                    //
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

    private async getLimits(): Promise<void> {
        this.loading = true;
        const limits = [];
        await this.userService.userProfile$.pipe(first((v) => !!v)).toPromise();
        if (this.userService.userProfile.extProfile.realityCheckTime) {
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
