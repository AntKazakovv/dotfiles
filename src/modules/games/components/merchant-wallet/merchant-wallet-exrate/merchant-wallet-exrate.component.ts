import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import _find from 'lodash-es/find';
import _multiply from 'lodash-es/multiply';
import _divide from 'lodash-es/divide';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractComponent,
    ConfigService,
    IIndexing,
    ICurrency,
} from 'wlc-engine/modules/core';

import * as Params from './merchant-wallet-exrate.params';

@Component({
    selector: '[wlc-merchant-wallet-exrate]',
    templateUrl: './merchant-wallet-exrate.component.html',
    styleUrls: ['./styles/merchant-wallet-exrate.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MerchantWalletExrateComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IMerchantWalletExrateCParams;

    public override $params: Params.IMerchantWalletExrateCParams;
    public value: number;
    public exrate: number;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMerchantWalletExrateCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.value && this.$params.currency) {
            this.setExRate();

            this.$params.value.pipe(takeUntil(this.$destroy))
                .subscribe((value: number): void => {
                    this.onValueChange(value);
                });
        }

    }

    protected setExRate(): void {
        const currencies = this.configService.get<IIndexing<ICurrency>>('appConfig.siteconfig.currencies');
        const usdExRate: number = _toNumber(_find(currencies, {Alias: 'USD'}).ExRate);

        this.exrate = this.$params.currency === 'EUR'
            ? usdExRate
            : _divide(usdExRate, _toNumber(_find(currencies, {Alias: this.$params.currency}).ExRate));
    }

    protected onValueChange(value: number): void {
        this.value = _multiply(value, this.exrate);
        this.cdr.markForCheck();
    }

}
