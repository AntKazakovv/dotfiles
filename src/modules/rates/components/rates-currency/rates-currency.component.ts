import {
    Component,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    NgZone,
} from '@angular/core';

import {interval} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import {ICoupleCurrency} from 'wlc-engine/modules/rates/system/interfaces/';
import {RateCurrencyModel} from 'wlc-engine/modules/rates/system/models/';
import {RatesCurrencyService} from 'wlc-engine/modules/rates/system/services/';

import * as Params from './rates-currency.params';

@Component({
    selector: '[wlc-rates-currency]',
    templateUrl: './rates-currency.component.html',
    styleUrls: ['./styles/rates-currency.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [RatesCurrencyService],
})
export class RatesCurrencyComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IRatesCurrencyParams;
    public ratesList: RateCurrencyModel[];
    private hour: number = 1000 * 60 * 60;
    private rates: ICoupleCurrency[];
    private ngZone: NgZone;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRatesCurrencyParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected ratesService: RatesCurrencyService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.rates = this.configService.get<ICoupleCurrency[]>('$base.rates');

        if (!this.rates.length) {
            this.$destroy;
        }

        await this.getRates();

        this.ngZone.runOutsideAngular(() => {
            interval(this.hour)
                .pipe(takeUntil(this.$destroy))
                .subscribe(() => {
                    this.ngZone.run(() => {
                        this.getRates();
                    });
                });
        });
    };

    private async getRates(): Promise<void>{
        if (this.rates.length) {
            this.ratesList = await Promise.all(this.rates.map(async (item) => {
                return await this.ratesService.getRateCurrency(item.cryptoCurrency, item.currency);
            }));
            this.cdr.markForCheck();
        }
    };
};
