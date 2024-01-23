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
} from 'wlc-engine/modules/core';

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
    public currentCurrency: string;
    public isShow: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChoiceCurrencyParams,
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
        private stateService: StateService,
        private eventService: EventService,
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

        this.currentCurrency = this.$params.game.initialCurrency;
        this.isShow = !!this.$params.game.initialCurrency;

        if (this.$params.themeMod === 'in-modal') {
            this.$params.game.selectedCurrency = this.currentCurrency;

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

    public onChangingCurrency(currency: string): void {
        this.isOpened = false;
        this.currentCurrency = currency;
        this.cdr.markForCheck();
    }

    public onCurrencySelected(): void {
        this.isShow = false;
        this.cdr.markForCheck();

        if (this.$params.game.initialCurrency !== this.currentCurrency) {
            this.$params.game.selectedCurrency = this.currentCurrency;
            this.stateService.reload();
        } else {
            this.$params.game.selectedCurrency = null;
            this.currencyEmit.emit();
        }
    }
}
