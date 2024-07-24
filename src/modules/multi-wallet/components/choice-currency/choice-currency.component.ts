import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {StateService} from '@uirouter/core';
import {first, takeUntil} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    EventService,
    GlobalHelper,
    IButtonCParams,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';

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

    public override $params: Params.IChoiceCurrencyParams;

    protected isOpened: boolean = false;
    protected currentCurrency: string;
    protected isShow: boolean = false;
    protected buttonParams: IButtonCParams;
    protected allCurrency: boolean = true;
    protected isOverlap: boolean;
    protected readonly currencyService: CurrencyService = inject(CurrencyService);

    private readonly userService: UserService = inject(UserService);
    private readonly eventService: EventService = inject(EventService);
    private readonly stateService: StateService = inject(StateService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChoiceCurrencyParams,
        protected override configService: ConfigService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super(
            {
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.allCurrency = !this.configService.get<boolean>('$base.multiWallet.onlyFiat');
        this.userService.userProfile$
            .pipe(
                first((profile: UserProfile): boolean => !!profile),
                takeUntil(this.$destroy),
            )
            .subscribe((profile: UserProfile) => {
                this.currentCurrency =
                    this.$params.game.merchantsCurrencies
                        .find((currency: string): boolean => currency === profile.gamesCurrency)
                    ?? this.$params.game.merchantsCurrencies.find((currency: string): boolean => currency === 'EUR')
                    ?? this.$params.game.merchantsCurrencies[0];
                this.isShow = true;
                this.cdr.markForCheck();
            });

        if (this.$params.themeMod === 'in-modal') {
            this.eventService.subscribe(
                [{name: 'runReal@playGameForRealModal'}],
                (): void => {
                    this.selectCurrency();
                },
                this.$destroy,
            );
        }
        this.buttonParams = {
            common: {
                text: this.$params.btnText,
                typeAttr: 'button',
            },
        };
        this.isOverlap = this.$params.themeMod !== 'in-modal';
        this.cdr.markForCheck();
    }

    public get currencies(): string[] {
        return this.$params.game.merchantsCurrencies;
    }

    public get balanceText(): string {
        return this.$params.balanceText;
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

    public onSelectCurrency(): void {
        this.isShow = false;
        this.cdr.markForCheck();
        this.selectCurrency();
        this.stateService.reload();
    }

    protected showCurrency(currency: string): boolean {
        return this.allCurrency || this.currencyService.isFiat(currency);
    }

    private selectCurrency(): void {
        this.$params.game.selectedCurrency = this.currentCurrency;
        this.$params.game.isVisibilityChangeCurrency = true;

        if (this.userService.userProfile.gamesCurrency !== this.currentCurrency) {
            this.userService.updateProfile({extProfile: {gamesCurrency: this.currentCurrency}}, {updatePartial: true});
        }
    }
}
