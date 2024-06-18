import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import _findIndex from 'lodash-es/findIndex';
import _filter from 'lodash-es/filter';

import {
    AbstractComponent,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';
import {
    ICurrencyFilter,
    WalletHelper,
} from 'wlc-engine/modules/multi-wallet';

import * as Params from 'wlc-engine/modules/multi-wallet/components/filters/filters.params';

@Component({
    selector: '[wlc-filters]',
    templateUrl: './filters.component.html',
    styleUrls: ['./styles/filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltersComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IFiltersParams;
    public override $params: Params.IFiltersParams;

    protected readonly walletHelper = WalletHelper;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFiltersParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
    }

    public createCheckboxParams(currency: ICurrencyFilter): ICheckboxCParams {
        return {
            control: new FormControl(currency.isUsed),
            onChange: (isUsed: boolean) => {
                this.$params.currencies[
                    _findIndex(this.$params.currencies, (item: ICurrencyFilter) => item.code === currency.code)
                ].isUsed = isUsed;
                WalletHelper.currencies = _filter(this.$params.currencies,
                    (currency: ICurrencyFilter) => !currency.isUsed);
            },
            theme: 'toggle',
        };
    }
}
