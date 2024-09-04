import {
    Component,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    AbstractComponent,
    EventService,
    GlobalHelper,
    ValidatorType,
} from 'wlc-engine/modules/core';

import * as Params from './amount-field.params';

import _find from 'lodash-es/find';
import _isFinite from 'lodash-es/isFinite';

type TChangeType = '+' | '-';

@Component({
    selector: '[wlc-amount-field]',
    templateUrl: './amount-field.component.html',
    styleUrls: ['./styles/amount-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountFieldComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAmountFieldComponent;

    public override $params: Params.IAmountFieldComponent;

    protected control: UntypedFormControl;
    protected minValue: number;
    protected maxValue: number;
    protected stepValue: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAmountFieldComponent,
        protected eventService: EventService,
    ){
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.control = this.$params.amount.control;
        this.$params.amount.validators = this.$params.validators;
        this.prepareLimitsAndSteps();
    }

    public changeAmount(changeType: TChangeType): void {
        const amountValue: number = Number(this.control.value);
        let newAmountValue: number;

        if (changeType === '-') {
            newAmountValue = GlobalHelper.sumNumbers(amountValue, -this.stepValue);
            newAmountValue = (newAmountValue >= this.minValue) ? newAmountValue : this.minValue;
        } else {
            newAmountValue = GlobalHelper.sumNumbers(amountValue, this.stepValue);
            newAmountValue = (newAmountValue <= this.maxValue) ? newAmountValue : this.maxValue;
        }

        this.eventService.emit(
            {
                name: 'INCREASE_AMOUNT',
                data: {amount: newAmountValue},
            },
        );
    }

    protected prepareLimitsAndSteps(): void {
        const validators: ValidatorType[] = this.$params.validators;
        let minValue: number;
        let maxValue: number;

        if (this.$params.minValue) {
            minValue = this.$params.minValue;
        } else if (validators?.length) {
            minValue = Number(_find(validators, {name: 'min'})?.['options']);
        }
        this.minValue = (_isFinite(minValue) && minValue >= 0) ? minValue : 0;

        if (this.$params.maxValue) {
            maxValue = this.$params.maxValue;
        } else if (validators?.length) {
            maxValue = Number(_find(validators, {name: 'max'})?.['options']);
        }
        this.maxValue = (_isFinite(maxValue) && maxValue > this.minValue) ? maxValue : Infinity;

        if (this.$params.stepValue) {
            this.stepValue = this.$params.stepValue;
        } else if (this.minValue) {
            this.stepValue = this.minValue;
        } else {
            this.stepValue = 1;
        }
    }
}
