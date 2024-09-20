import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    AbstractComponent,
    ICheckboxCParams,
} from 'wlc-engine/modules/core';
import {ICurrencyFilter} from 'wlc-engine/modules/multi-wallet';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

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

    public readonly walletsService: WalletsService = inject(WalletsService);

    protected toggleHideZeroParams: ICheckboxCParams = {
        name: 'hideZeroBalances',
        theme: 'toggle',
    };

    constructor(@Inject('injectParams') protected injectParams: Params.IFiltersParams) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.toggleHideZeroParams.control =
            new FormControl(this.walletsService.walletSettings.hideWalletsWithZeroBalance);
        this.toggleHideZeroParams.onChange = (checked: boolean): void => {
            this.walletsService.walletSettings.hideWalletsWithZeroBalance = checked;
        };
    }

    public get hideWalletText(): string {
        return this.$params.hideWalletText;
    }
    public getDisplayName(currency: ICurrencyFilter): string {
        return currency.displayName ?? currency.name;
    }

    public getCurrencyIconUrl(currency: string): string {
        return this.walletsService.getCurrencyIconUrl(currency);
    }

    public createCheckboxParams(currency: ICurrencyFilter): ICheckboxCParams {
        return {
            control: new FormControl(currency.isUsed),
            onChange: (isUsed: boolean) => {
                this.$params.currencies[
                    this.$params.currencies.findIndex((item: ICurrencyFilter) => item.name === currency.name)
                ].isUsed = isUsed;
                this.walletsService.currencies = this.$params.currencies
                    .filter((currency: ICurrencyFilter) => !currency.isUsed);
            },
            theme: 'toggle',
        };
    }
}
