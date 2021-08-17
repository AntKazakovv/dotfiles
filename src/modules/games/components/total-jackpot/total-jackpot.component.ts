import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {filter, takeUntil} from 'rxjs/operators';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {
    CachingService,
    ConfigService,
} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';

import * as Params from './total-jackpot.params';

export interface ITotalJackpotCurrency {
    currency: string;
    delimiter: ',' | '.' | any;
    position: 'right' | 'left';
    lang: string;
}

/**
 * Component displaying the latest jackpots
 *
 * @example
 *
 * {
 *     name: 'games.wlc-total-jackpot',
 * }
 *
 */
@Component({
    selector: '[wlc-total-jackpot]',
    templateUrl: './total-jackpot.component.html',
    styleUrls: ['./styles/total-jackpot.component.scss'],
})
export class TotalJackpotComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITotalJackpotCParams;

    public $params: Params.ITotalJackpotCParams;
    public amount: number;
    public currency: ITotalJackpotCurrency;
    public noContentParams: INoContentCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITotalJackpotCParams,
        protected configService: ConfigService,
        protected cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected cachingService: CachingService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getCache();
        this.gamesCatalogService.ready.then(() => {
            this.getLastJackpots();
        });
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService);
    }

    private async getCache(): Promise<void> {

        try {
            const currency: ITotalJackpotCurrency = await this.cachingService.get('total-jackpot-currency');

            if (currency && currency.lang === this.translateService.currentLang) {
                this.amount = await this.cachingService.get('total-jackpot-amount');
                this.currency = currency;
            }
        } catch (error) {}

        if (this.currency) {
            this.$params.countUpOptions.decimal = this.currency.delimiter;
        }

        this.cdr.markForCheck();
    }

    private getCurrency(currency: string): void {
        const format = Intl.NumberFormat(this.translateService.currentLang, {
            style: 'currency',
            currency: currency,
        }).format(0);

        this.currency = {
            currency: format.replace(/[\d\s\,\.]/g, ''),
            delimiter: /./.test(format) ? '.' : ',',
            position: /\d/g.test(format[0]) ? 'right' : 'left',
            lang: this.translateService.currentLang,
        };

        this.$params.countUpOptions.decimal = this.currency.delimiter;

        this.cdr.markForCheck();
        this.cachingService.set('total-jackpot-currency', this.currency, true);
    }

    private getLastJackpots(): void {
        this.gamesCatalogService.subscribeJackpots
            .pipe(
                takeUntil(this.$destroy),
                filter((data) => !!data.length), //TODO Delete after #246227
            )
            .subscribe((data: JackpotModel[]) => {
                this.calcAmount(data);
                this.getCurrency(data[0].currency);
            });
    }

    private calcAmount(data: JackpotModel[]): void {
        this.amount = data.reduce((accumulator: number, currentValue: JackpotModel) => (
            accumulator + currentValue.amount
        ), 0);
        this.cdr.markForCheck();
        this.cachingService.set('total-jackpot-amount', this.amount, true);
    }
}
