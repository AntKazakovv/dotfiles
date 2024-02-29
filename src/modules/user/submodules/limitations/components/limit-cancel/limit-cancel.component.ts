import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';

import {DateTime} from 'luxon';

import {
    AbstractComponent,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    LimitationService,
} from 'wlc-engine/modules/user/submodules/limitations/system/services/limitation/limitation.service';
import {TLimitationType} from 'wlc-engine/modules/user/submodules/limitations/system/interfaces/limitations.interface';

import * as Params from './limit-cancel.params';

@Component({
    selector: '[wlc-limit-cancel]',
    templateUrl: './limit-cancel.component.html',
    styleUrls: ['./styles/limit-cancel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LimitCancelComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ILimitCancelCParams;
    public cancelable: boolean = false;
    public pending: boolean = false;
    public timerValue: DateTime = null;

    protected useCoolOffTime: boolean = null;

    constructor(
        @Inject('injectParams') protected params: Params.ILimitCancelCParams,
        protected limitationService: LimitationService,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        if (Params.limitCancelTypes.includes(this.$params.value)) {
            this.cancelable = true;
        }

        const dateTimeValue: DateTime = DateTime.fromSQL(this.$params.value, {zone: 'utc'});
        if (dateTimeValue.isValid) {
            this.timerValue = dateTimeValue;
            this.useCoolOffTime = true;
        }

        if (this.$params.value === 'CoolOffTime') {
            this.useCoolOffTime = true;
            this.cancelable = true;
        }
    }

    /**
     * Cancel button click callback
     */
    public async cancel(): Promise<void> {
        if (this.pending) {
            return;
        }

        this.pending = true;

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
                    if (this.useCoolOffTime) {
                        return await this.limitationService.setSelfExclusion('disable');
                    }

                    return await this.limitationService.removeUserSelfExclusion(this.$params.value as TLimitationType);
                } catch (error) {
                    //
                }
            },
            onModalHide: () => {
                this.pending = false;
            },
            dismissAll: true,
        });
    }

    public timerEnds(): void {
        this.timerValue = null;
        this.cancelable = true;
    }
}
