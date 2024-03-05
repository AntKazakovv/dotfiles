import {
    Component,
    OnInit,
    ChangeDetectorRef,
    Inject,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
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
    AbstractComponent,
    IMixedParams,
    ConfigService,
    InjectionService,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
    GamesCatalogService,
    GamesHelper,
    IGamesGridCParams,
} from 'wlc-engine/modules/games';
import {UserProfile} from 'wlc-engine/modules/user';
import {ILocalJackpot} from 'wlc-engine/modules/local-jackpots/system/interfaces/local-jackpots.interface';
import {LocalJackpotsService} from 'wlc-engine/modules/local-jackpots/system/services';
import {JackpotCurrency} from 'wlc-engine/modules/core/constants';

import * as Params from './local-jackpot.params';

@Component({
    selector: '[wlc-local-jackpot]',
    templateUrl: './local-jackpot.component.html',
    styleUrls: ['./styles/local-jackpot.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalJackpotComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.ILocalJackpotsCParams;

    public override $params: Params.ILocalJackpotsCParams;
    public gridParams: IWrapperCParams = {components: [], class: 'wlc-games-grids-wrapper'};
    public isReady: boolean = false;
    public jackpot: ILocalJackpot = null;

    protected gamesCatalogService: GamesCatalogService = null;
    protected destroyRef = inject(DestroyRef);

    protected readonly localJackpotsService = inject(LocalJackpotsService);
    protected readonly injectionService = inject(InjectionService);
    protected readonly translateService = inject(TranslateService);
    protected readonly stateService = inject(StateService);

    constructor(
        @Inject('injectParams') protected params: Params.ILocalJackpotsCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.ILocalJackpotsCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.setSubscription();

        if (!this.configService.get<boolean>('$user.isAuthenticated')) {
            this.setJackpots();
        }
    }

    public goToCategory(): void {
        this.stateService.go(this.$params.noDataButton.state, this.$params.noDataButton.params);
    }

    public userCurrencyFormat(currentLang: string, currency: string): string {
        return Intl.NumberFormat(currentLang, {
            style: 'currency',
            currency,
        }).format(0).replace(JackpotCurrency.formatCurrency, '');
    }

    protected async setJackpots(): Promise<void> {
        const jackpots = await this.localJackpotsService.getJackpots(this.$params.userCurrency);

        if (jackpots?.length) {
            this.jackpot = jackpots[0];
            await this.initGameGrids();
        }

        this.isReady = true;
        this.cdr.markForCheck();
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
                const allCategories = this.gamesCatalogService.getCategories();
                categories = allCategories.filter((category) => !idRestrictedCategories.includes(category.id));
            }

            if (categories.length) {
                categories.forEach((category: CategoryModel): void => {
                    if (!category.games?.length) {
                        return;
                    }

                    const gridParams: IGamesGridCParams = _merge(_cloneDeep(this.$params.gamesGridParams), {
                        title: category.title[this.translateService.currentLang] || category.title['en'],
                        filter: {
                            categories: [category.slug],
                        },
                    });

                    this.gridParams.components.push({
                        name: 'games.wlc-games-grid',
                        params: gridParams,
                    });
                });
            }
        }
    }

    protected setSubscription(): void {
        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((v: UserProfile) => !!v),
                map((v: UserProfile) => v.currency),
                tap((currency: string) => {
                    this.$params.userCurrency = currency;
                    this.setJackpots();
                }),
                takeUntilDestroyed(this.destroyRef),
            ).subscribe();
    }
}
