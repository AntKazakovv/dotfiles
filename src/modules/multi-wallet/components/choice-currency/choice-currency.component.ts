import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
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
    InjectionService,
} from 'wlc-engine/modules/core';
import {CurrencyService} from 'wlc-engine/modules/currency/system/services/currency.service';
import {CurrencyName} from 'wlc-engine/modules/currency/system/interfaces/currency.interface';

import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user';

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
    public modifyMerchantsCurrencies: CurrencyName[];
    public currencyService: CurrencyService;

    protected isOpened: boolean = false;
    protected currentCurrency: CurrencyName;
    protected isShow: boolean = false;
    protected buttonParams: IButtonCParams;

    private userService: UserService;

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
        this.userService = await this.injectionService.getService<UserService>('user.user-service');
        this.currencyService = await this.injectionService.getService<CurrencyService>('currency.currency-service');
        this.modifyMerchantsCurrencies = this.$params.game.merchantsCurrencies.map((curr: string) => {
            return {
                displayName: this.currencyService.getDisplayName(curr),
                name: curr,
            };
        });
        this.userService.userProfile$
            .pipe(
                first((profile: UserProfile): boolean => !!profile),
                takeUntil(this.$destroy),
            )
            .subscribe((profile: UserProfile) => {
                const initialCurrency: string = this.$params.game.merchantsCurrencies
                    .find((currency: string): boolean => currency === profile.gamesCurrency)
                    ?? this.$params.game.merchantsCurrencies.find((currency: string): boolean => currency === 'EUR')
                    ?? this.$params.game.merchantsCurrencies[0];
                this.currentCurrency = {
                    displayName: this.currencyService.getDisplayName(initialCurrency),
                    name: initialCurrency,
                };
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

    public onSelectCurrency(): void {
        this.isShow = false;
        this.cdr.markForCheck();
        this.selectCurrency();
        this.stateService.reload();
    }

    private selectCurrency(): void {
        this.$params.game.selectedCurrency = this.currentCurrency.name;
        this.$params.game.isVisibilityChangeCurrency = true;

        if (this.userService.userProfile.gamesCurrency !== this.currentCurrency.name) {
            this.userService.updateProfile({
                extProfile: {
                    gamesCurrency: this.currentCurrency.name,
                }},
            {updatePartial: true},
            );
        }
    }
}
