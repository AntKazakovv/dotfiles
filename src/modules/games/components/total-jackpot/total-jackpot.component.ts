import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {CachingService, DataService} from 'wlc-engine/modules/core/system/services';
import {IData} from 'wlc-engine/modules/core/system/services/data/data.service';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {IJackpot} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
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
export class TotalJackpotComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.ITotalJackpotCParams;

    public $params: Params.ITotalJackpotCParams;
    public amount: number;
    public currency: ITotalJackpotCurrency;
    private jackpotsSubscriber$: Subscription;

    constructor(
        @Inject('injectParams') protected params: Params.ITotalJackpotCParams,
        protected dataService: DataService,
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
        this.getLastJackpots();
    }

    public ngOnDestroy(): void {
        this.jackpotsSubscriber$?.unsubscribe();
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

        this.jackpotsSubscriber$ = this.dataService.subscribe('games/jackpots', (req: IData): void => {
            if (req?.data?.length) {
                this.calcAmount(req.data);
                this.getCurrency(req.data[0].currency);
            }
        });
    }

    private calcAmount(data: IJackpot[]): void {
        this.amount = data.reduce((accumulator: number, currentValue: IJackpot) => (
            accumulator + currentValue.amount
        ), 0);
        this.cdr.markForCheck();
        this.cachingService.set('total-jackpot-amount', this.amount, true);
    }
}
