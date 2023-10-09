import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
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
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService);
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
        WalletHelper.walletSettings = this.$params.walletSettings;
    }

    public onCurrencyChange(currency: string): void {
        this.$params.walletSettings.currency = currency;
        this.cdr.markForCheck();
    }
}
