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

    private userService: UserService;
    public currencyService: CurrencyService;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IChoiceCurrencyParams,
        protected override cdr: ChangeDetectorRef,
        protected override configService: ConfigService,
        private stateService: StateService,
        private eventService: EventService,
        private injectionService: InjectionService,
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
        this.currencyService =
            await this.injectionService.getService<CurrencyService>('currency.currency-service');

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

    public onSelectCurrency(): void {
        this.isShow = false;
        this.cdr.markForCheck();
        this.selectCurrency();
        this.stateService.reload();
    }

    private selectCurrency(): void {
        this.$params.game.selectedCurrency = this.currentCurrency;
        this.$params.game.isVisibilityChangeCurrency = true;

        if (this.userService.userProfile.gamesCurrency !== this.currentCurrency) {
            this.userService.updateProfile({extProfile: {gamesCurrency: this.currentCurrency}}, {updatePartial: true});
        }
    }
}
