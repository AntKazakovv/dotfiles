import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    inject,
    DestroyRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {StateService} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';
import {
    BehaviorSubject,
    filter,
    map,
    tap,
} from 'rxjs';
import _merge from 'lodash-es/merge';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    ConfigService,
    IWrapperCParams,
    InjectionService,
    AbstractComponent,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {
    CategoryModel,
    GamesCatalogService,
    GamesHelper,
    IGamesGridCParams,
} from 'wlc-engine/modules/games';
import {ILocalJackpot} from 'wlc-engine/modules/local-jackpots/system/interfaces/local-jackpots.interface';
import {JackpotCurrency} from 'wlc-engine/modules/core/constants';
import {
    LocalJackpotsService,
} from 'wlc-engine/modules/local-jackpots/system/services/local-jackpots/local-jackpots.service';

import * as Params from './jackpot-banner.params';

@Component({
    selector: '[wlc-jackpot-banner]',
    templateUrl: './jackpot-banner.component.html',
    styleUrls: ['./styles/jackpot-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotBannerComponent extends AbstractComponent implements OnInit {
    public override $params: Params.IJackpotBannerCParams;

    @Input() protected inlineParams: Params.IJackpotBannerCParams;

    public jackpot: ILocalJackpot;
    public isReady: boolean = false;
    public gridParams: IWrapperCParams = {components: [], class: 'wlc-games-grid-wrapper'};

    protected gamesCatalogService: GamesCatalogService;
    protected destroyRef = inject(DestroyRef);

    protected readonly localJackpotsService = inject(LocalJackpotsService);
    protected readonly injectionService = inject(InjectionService);
    protected readonly translateService = inject(TranslateService);
    protected readonly stateService = inject(StateService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IJackpotBannerCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            {injectParams, defaultParams: Params.defaultParams},
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        if (this.configService.get<boolean>('appConfig.siteconfig.LocalJackpots')) {
            this.setSubscriptions();

            if (!this.configService.get<boolean>('$user.isAuthenticated')) {
                this.setJackpot();
            }
        } else {
            this.isReady = true;
        }
    }

    public noDataGoToState(): void {
        this.stateService.go(this.$params.noData?.button?.state, this.$params.noData?.button?.params);
    }

    public goPageLocalJackpots(): void {
        this.stateService.go('app.local-jackpots');
    }

    public userCurrencyFormat(currentLang: string, currency: string): string {
        return Intl.NumberFormat(currentLang, {
            style: 'currency',
            currency,
        }).format(0).replace(JackpotCurrency.formatCurrency, '');
    }

    protected async initGameGrids(): Promise<void> {
        const idAllowedCategories = this.jackpot?.restrictions?.categories?.allowed;
        const idRestrictedCategories = this.jackpot?.restrictions?.categories?.restricted;

        if (idAllowedCategories || idRestrictedCategories) {
            this.gamesCatalogService ??= await this.injectionService.getService('games.games-catalog-service');
            await this.gamesCatalogService.ready;

            let categories: CategoryModel[];

            if (idAllowedCategories) {
                categories = idAllowedCategories
                    .map((id: number) => GamesHelper.getCategoryById(id)).filter((v) => !!v);
            } else if (idRestrictedCategories) {
                const allCategories: CategoryModel[] = this.gamesCatalogService.getCategories();
                categories = allCategories.filter((category) => !idRestrictedCategories.includes(category.id));
            }

            const gamesList = this.gamesCatalogService.getGamesByCategories(categories);

            if (gamesList.length) {
                const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                    gamesList,
                });

                this.gridParams.components = [{
                    name: 'games.wlc-games-grid',
                    params: gridParams,
                }];
            }
        }

        this.isReady = true;
        this.cdr.markForCheck();
    }

    protected async setJackpot(): Promise<void> {
        const jackpots = await this.localJackpotsService.getJackpots(this.$params.userCurrency);

        if (jackpots?.length) {
            this.jackpot = jackpots[0];
        }

        this.initGameGrids();
    }

    protected setSubscriptions(): void {
        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((v: UserProfile) => !!v),
                map((v: UserProfile) => v.currency),
                tap((currency: string) => {
                    this.$params.userCurrency = currency;
                    this.setJackpot();
                }),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe();
    }

}
