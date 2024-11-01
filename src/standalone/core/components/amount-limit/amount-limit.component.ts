import {
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';

import _isObject from 'lodash-es/isObject';

import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {CoreModule} from 'wlc-engine/modules/core/core.module';

import * as Params from './amount-limit.params';

@Component({
    selector: '[wlc-amount-limit]',
    templateUrl: './amount-limit.component.html',
    styleUrls: ['./styles/amount-limit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CoreModule,
    ],
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
        super.ngOnInit(GlobalHelper.prepareCParams(this, ['minValue', 'maxValue', 'showLimits']));
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
