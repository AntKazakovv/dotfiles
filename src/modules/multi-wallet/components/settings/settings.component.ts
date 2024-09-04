import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    inject,
    OnInit,
    OnDestroy,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import _assign from 'lodash-es/assign';

import {ICurrency} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';
import {AbstractComponent, ICheckboxCParams} from 'wlc-engine/modules/core';
import {WalletHelper, IWalletsSettings} from 'wlc-engine/modules/multi-wallet';
import {UserService} from 'wlc-engine/modules/user';
import {CurrencyService} from 'wlc-engine/modules/currency';

import * as Params from 'wlc-engine/modules/multi-wallet/components/settings/settings.params';

@Component({
    selector: '[wlc-settings]',
    templateUrl: './settings.component.html',
    styleUrls: ['./styles/settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() public inlineParams: Params.ISettingsParams;
    public override $params: Params.ISettingsParams;

    protected toggleHideZeroParams: ICheckboxCParams = {
        name: 'hideZeroBalances',
        theme: 'toggle',
    };
    protected toggleViewFiatParams: ICheckboxCParams = {
        name: 'viewFiat',
        theme: 'toggle',
    };

    private walletSettings: IWalletsSettings;

    private readonly currencyService: CurrencyService = inject(CurrencyService);
    private readonly userService: UserService = inject(UserService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISettingsParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.toggleHideZeroParams.control = new FormControl(WalletHelper.walletSettings.hideWalletsWithZeroBalance);
        this.toggleViewFiatParams.control = new FormControl(WalletHelper.walletSettings.conversionInFiat);
        this.toggleHideZeroParams.onChange = (checked: boolean): void => {
            WalletHelper.walletSettings.hideWalletsWithZeroBalance = checked;
        };
        this.toggleViewFiatParams.onChange = (checked: boolean): void => {
            WalletHelper.walletSettings.conversionInFiat = checked;
        };
        this.walletSettings = _assign({}, WalletHelper.walletSettings);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.walletSettings.conversionInFiat !== WalletHelper.walletSettings.conversionInFiat
            || this.walletSettings.hideWalletsWithZeroBalance !== WalletHelper.walletSettings.hideWalletsWithZeroBalance
            || this.walletSettings.currency !== WalletHelper.walletSettings.currency) {
            this.userService.updateProfile(
                {extProfile: {conversionCurrency: WalletHelper.walletSettings}},
                {updatePartial: true},
            );
        }
    }

    public get displayCurrencies(): ICurrency<string>[] {

        return Array.from(this.currencyService?.conversionCurrencies)
            .sort((currency: ICurrency<string>) => currency.Name === WalletHelper.walletSettings.currency ? -1 : 0);
    }

    public get currencyConversion(): string {
        return WalletHelper.walletSettings.currency;
    }

    public get showError(): boolean {
        return !WalletHelper.walletSettings.currency?.length && WalletHelper.walletSettings.conversionInFiat;
    }

    public onCurrencyChange(currency: string): void {
        WalletHelper.walletSettings.currency = currency;
        this.cdr.markForCheck();
    }
}
