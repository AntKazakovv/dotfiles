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

import {AbstractComponent, ICheckboxCParams} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user';
import {ICurrency} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';
import {CurrencyService} from 'wlc-engine/modules/currency';
import {IWalletsSettings} from 'wlc-engine/modules/multi-wallet';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

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
    public walletSettings: IWalletsSettings;

    public readonly currencyService: CurrencyService = inject(CurrencyService);
    public readonly userService: UserService = inject(UserService);
    public readonly walletsService: WalletsService = inject(WalletsService);


    protected toggleHideZeroParams: ICheckboxCParams = {
        name: 'hideZeroBalances',
        theme: 'toggle',
    };
    protected toggleViewFiatParams: ICheckboxCParams = {
        name: 'viewFiat',
        theme: 'toggle',
    };

    constructor(@Inject('injectParams') protected injectParams: Params.ISettingsParams) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.toggleHideZeroParams.control =
            new FormControl(this.walletsService.walletSettings.hideWalletsWithZeroBalance);
        this.toggleViewFiatParams.control = new FormControl(this.walletsService.walletSettings.conversionInFiat);
        this.toggleHideZeroParams.onChange = (checked: boolean): void => {
            this.walletsService.walletSettings.hideWalletsWithZeroBalance = checked;
        };
        this.toggleViewFiatParams.onChange = (checked: boolean): void => {
            this.walletsService.walletSettings.conversionInFiat = checked;
        };
        this.walletSettings = _assign({}, this.walletsService.walletSettings);
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        if (this.walletSettings.conversionInFiat !== this.walletsService.walletSettings.conversionInFiat
            || (this.walletSettings.hideWalletsWithZeroBalance
                !== this.walletsService.walletSettings.hideWalletsWithZeroBalance)
            || this.walletSettings.currency !== this.walletsService.walletSettings.currency) {
            this.userService.updateProfile(
                {extProfile: {conversionCurrency: this.walletsService.walletSettings}},
                {updatePartial: true},
            );
        }
    }

    public get displayCurrencies(): ICurrency<string>[] {

        return Array.from(this.currencyService?.conversionCurrencies)
            .sort((currency: ICurrency<string>): number =>
                currency.Name === this.walletsService.walletSettings.currency ? -1 : 0);
    }

    public get currencyConversion(): string {
        return this.walletsService.walletSettings.currency;
    }

    public get showError(): boolean {
        return !this.walletsService.walletSettings.currency?.length
            && this.walletsService.walletSettings.conversionInFiat;
    }

    public onCurrencyChange(currency: string): void {
        this.walletsService.walletSettings.currency = currency;
        this.cdr.markForCheck();
    }
}
