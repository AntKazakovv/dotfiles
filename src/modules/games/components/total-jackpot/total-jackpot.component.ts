import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ElementRef,
    ChangeDetectionStrategy,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    filter,
    takeUntil,
} from 'rxjs/operators';
import _clone from 'lodash-es/clone';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';
import {
    CachingService,
    ConfigService,
} from 'wlc-engine/modules/core/system/services';
import {INoContentCParams} from 'wlc-engine/modules/core/components/no-content/no-content.params';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';

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
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TotalJackpotComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITotalJackpotCParams;

    public override $params: Params.ITotalJackpotCParams;
    public amount: number;
    public currency: ITotalJackpotCurrency;
    public noContentParams: INoContentCParams;
    public gamesList: Game[] = [];

    constructor(
        public elementRef: ElementRef,
        @Inject('injectParams') protected params: Params.ITotalJackpotCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected translateService: TranslateService,
        protected cachingService: CachingService,
        protected gamesCatalogService: GamesCatalogService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.getCache();
        this.gamesCatalogService.ready.then(() => {
            this.getLastJackpots();
        });
        this.noContentParams = GlobalHelper.getNoContentParams(this.$params, this.$class, this.configService);

        this.cdr.markForCheck();
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
                filter((data: JackpotModel[]) => !!data.length),
                takeUntil(this.$destroy),
            )
            .subscribe((data: JackpotModel[]) => {
                this.calcAmount(data);
                this.getCurrency(data[0].currency);

                if (this.$params.theme === 'games-inside') {
                    this.updateGameList();
                }
            });
    }

    private calcAmount(data: JackpotModel[]): void {
        this.amount = data.reduce((accumulator: number, currentValue: JackpotModel) => (
            accumulator + currentValue.amount
        ), 0);
        this.cdr.markForCheck();
        this.cachingService.set('total-jackpot-amount', this.amount, true);
    }

    private async updateGameList(): Promise<void> {
        this.$params.gamesGridParams.gamesList = await this.gamesCatalogService.getJackpotGames();
        this.$params.gamesGridParams = _clone(this.$params.gamesGridParams);
    }
}
