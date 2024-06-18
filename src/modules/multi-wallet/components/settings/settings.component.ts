import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {CurrencyName} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';
import {AbstractComponent} from 'wlc-engine/modules/core';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';

import * as Params from 'wlc-engine/modules/multi-wallet/components/settings/settings.params';

@Component({
    selector: '[wlc-settings]',
    templateUrl: './settings.component.html',
    styleUrls: ['./styles/settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ISettingsParams;
    public override $params: Params.ISettingsParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISettingsParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.$params.toggleHideZero.control = new FormControl(this.$params.walletSettings.hideWalletsWithZeroBalance);
        this.$params.toggleViewFiat.control = new FormControl(this.$params.walletSettings.conversionInFiat);
        this.$params.toggleHideZero.onChange = (checked: boolean): void => {
            this.$params.walletSettings.hideWalletsWithZeroBalance = checked;
        };
        this.$params.toggleViewFiat.onChange = (checked: boolean): void => {
            this.$params.walletSettings.conversionInFiat = checked;
        };

        if (this.$params.walletSettings?.currency?.length) {
            this.$params.currencies = this.$params.currencies
                .sort((item: CurrencyName) => item.name === this.$params.walletSettings.currency ? -1 : 1);
        }
        WalletHelper.walletSettings = this.$params.walletSettings;
    }

    public onCurrencyChange(currency: string): void {
        this.$params.walletSettings.currency = currency;
        this.$params.currencies = this.$params.currencies
            .sort((item: CurrencyName) => item.name === currency ? -1 : 1);
        this.cdr.markForCheck();
    }

    public get showError (): boolean {
        return !this.$params.walletSettings.currency?.length && this.$params.walletSettings.conversionInFiat;
    }
}
