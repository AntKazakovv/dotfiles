import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';

import {StateService} from '@uirouter/core';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    GlobalHelper,
    InjectionService,
} from 'wlc-engine/modules/core';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';
import {CurrencyName} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

import * as Params
    from 'wlc-engine/modules/multi-wallet/components/choice-currency/choice-currency.params';

@Component({
    selector: '[wlc-choice-currency]',
    templateUrl: './choice-currency.component.html',
    styleUrls: ['./styles/choice-currency.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceCurrencyComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.IChoiceCurrencyParams;
    @Output() public currencyEmit: EventEmitter<void> = new EventEmitter();

    public override $params: Params.IChoiceCurrencyParams;
    public isOpened: boolean = false;
    public currentCurrency: CurrencyName;
    public isShow: boolean = false;
    public currencyService: CurrencyService;
    public modifyMerchantsCurrencies: CurrencyName[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChoiceCurrencyParams,
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
        private stateService: StateService,
        private eventService: EventService,
        protected injectionService: InjectionService,
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
        this.currencyService = await this.injectionService.getService<CurrencyService>('currency.currency-service');
        this.currentCurrency = {
            displayName: this.currencyService.getDisplayName(this.$params.game.initialCurrency),
            name: this.$params.game.initialCurrency,
        };
        this.modifyMerchantsCurrencies = this.$params.game.merchantsCurrencies.map((curr: string) => {
            return {
                displayName: this.currencyService.getDisplayName(curr),
                name: curr,
            };
        });
        this.isShow = !!this.$params.game.initialCurrency;

        if (this.$params.themeMod === 'in-modal') {
            this.$params.game.selectedCurrency = this.currentCurrency.name;

            this.eventService.subscribe(
                {name: 'CLOSE_MODAL'},
                (modalId: string): void => {
                    if (modalId === 'play-game-for-real') {
                        this.$params.game.selectedCurrency = null;
                    }
                },
                this.$destroy,
            );
        }
        this.cdr.markForCheck();
    }

    public onOpen(): void {
        this.isOpened = !this.isOpened;
    }

    public clickOutside(): void {
        this.isOpened = false;
    }

    public getCurrencyIconUrl(currency: string): string {
        const path: string = `/wlc/icons/currencies/${currency.toLowerCase()}.svg`;
        return GlobalHelper.proxyUrl(path);
    }

    public onChangingCurrency(currency: CurrencyName): void {
        this.currentCurrency = {
            ...currency,
            displayName: this.currencyService.getDisplayName(currency.name),
        };
        this.isOpened = false;
        this.cdr.markForCheck();
    }

    public onCurrencySelected(): void {
        this.isShow = false;
        this.cdr.markForCheck();

        if (this.$params.game.initialCurrency !== this.currentCurrency.name) {
            this.$params.game.selectedCurrency = this.currentCurrency.name;
            this.stateService.reload();
        } else {
            this.$params.game.selectedCurrency = null;
            this.currencyEmit.emit();
        }
    }
}
