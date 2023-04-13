import {
    Component, Inject, Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/core/components/amount-limit/amount-limit.params';

import _isObject from 'lodash-es/isObject';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-amount-limit]',
    templateUrl: './amount-limit.component.html',
    styleUrls: ['./styles/amount-limit.component.scss'],
})
export class AmountLimitComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IAmountLimitCParams;
    @Input() public minValue: number;
    @Input() public maxValue: number;
    @Input() public showLimits?: boolean | Params.ILimits;

    public override $params: Params.IAmountLimitCParams;
    public limits: Params.ILimits;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAmountLimitCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['minValue', 'maxValue', 'showLimits']));
        this.setLimits();
    }

    public setLimits(): void {
        this.limits = this.$params.showLimits && _isObject(this.$params.showLimits)
            ? this.$params.showLimits
            : {
                min: this.$params.minValue,
                max: this.$params.maxValue,
            };
    }
}
