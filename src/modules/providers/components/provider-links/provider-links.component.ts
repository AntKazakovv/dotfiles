import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewChild,
    TemplateRef,
    AfterViewInit,
} from '@angular/core';
import {
    StateService,
} from '@uirouter/core';

import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import _times from 'lodash-es/times';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';
import _unset from 'lodash-es/unset';

import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {
    EventService,
    GlobalHelper,
    ModalService,
    ColorThemeService,
    ISlide,
    ISliderCParams,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
import {Game} from 'wlc-engine/modules/games/system/models';
import {CustomHook} from 'wlc-engine/modules/core/system/decorators/hook.decorator';
import * as Params from './provider-links.params';

@Component({
    selector: '[wlc-provider-links]',
    templateUrl: './provider-links.component.html',
    styleUrls: ['./styles/provider-links.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProviderLinksComponent extends IconListAbstract<Params.IProviderLinksCParams>
    implements OnInit, AfterViewInit {
    @Input() protected inlineParams: Params.IProviderLinksCParams;

    @ViewChild('iconItem') iconTemplate: TemplateRef<any>;
    @ViewChild('providersList') providersList: TemplateRef<any>;

    public override $params: Params.IProviderLinksCParams;
    public items: IWrapperCParams[] = [];
    public ready: boolean = false;
    public slides: ISlide[] = [];
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public sliderConfig: ISliderCParams;

    protected $itemsChanges = new BehaviorSubject<IWrapperCParams[]>([]);
    protected modalLinkParams: Params.IProviderLinksCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProviderLinksCParams,
        protected stateService: StateService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        colorThemeService: ColorThemeService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, colorThemeService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.prepareModalLinkParams();

        if (this.$params.linkText) {
            this.$params.btnParams.common.text = this.$params.linkText;
        }
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.gamesCatalogService.ready;

        this.setEventHandlers();
        this.initSlider();
        this.ready = true;
    }

    @CustomHook({module: 'providers', class: 'ProviderLinksComponent', method: 'showAllProviders'})
    public showAllProviders(): void {
        if (GlobalHelper.isMobileApp() || this.$params.redirectToPage) {
            this.stateService.go('app.providers');
            return;
        }

        this.modalService.showModal({
            id: 'provider-list',
            modalTitle: gettext('Providers'),
            modifier: 'provider-list',
            size: 'lg',
            wlcElement: 'provider-list',
            component: ProviderLinksComponent,
            componentParams: this.modalLinkParams,
        });
    }

    public getInfoText(icon: IconModel): string {
        if (this.$params.themeMod === 'wolf') {
            const merchant: MerchantModel = this.gamesCatalogService.getMerchantByAlias(icon.alt);

            const games: Game[] = this.gamesCatalogService.getGameList({
                merchants: [merchant.id],
            });

            if (games.length) {
                return games.length + ' ' + this.translateService.instant('games');
            }
        }

        return null;
    }

    /**
     * Init slider view
     */
    protected initSlider(): void {
        this.setMerchantsList();
        this.setSliderParams();
        this.initSliderConfig();
    }

    /**
     * Creates the icon list.
     * Based on games request data.
     **/
    @CustomHook({module: 'providers', class: 'ProviderLinksComponent', method: 'providerLinksSetMerchantsList'})
    protected setMerchantsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showIconAs = iconsType == 'black' ? 'svg' : 'img';

        const merchants: MerchantModel[] = this.prepareMerchants();

        const iconModels: IconModel[] = this.convertItemsToIconModel<MerchantModel>(
            merchants,
            (item) => {
                return {
                    from: {
                        component: 'ProviderLinksComponent',
                        method: 'setMerchantsList',
                    },
                    icon: this.merchantsPaymentsIterator('merchants', {
                        showAs: showIconAs,
                        wlcElement: item.wlcElement,
                        nameForPath: item.alias,
                        alt: item.alias,
                        title: gettext('See all games of'),
                        sref: this.$params.defaultLinkSref,
                        srefParams: {provider: item.menuId},
                        colorIconBg: colorIconBg,
                    }),
                };
            },
        );

        this.items = iconModels.map((iconModel: IconModel) => {
            return {
                components: [
                    {
                        name: 'icon-list.wlc-icon-list-item',
                        params: {
                            icon: iconModel,
                            infoText: this.getInfoText(iconModel),
                            class: this.$class + '-item',
                        },
                    },
                ],
            };
        });

        this.$itemsChanges.next(this.items);
        this.cdr.markForCheck();
    }

    protected setSliderParams(): void {
        this.sliderParams = this.$params.sliderParams || {};
        this.slides = _times(this.items.length, (index: number) => {
            return {
                templateRef: this.iconTemplate,
                templateParams: {item: this.items[index]},
            };
        });

        this.cdr.markForCheck();
    }

    protected setEventHandlers(): void {
        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
            && this.$params.colorIconBg && this.$params.iconsType === 'color') {
            this.subscribeOnToggleSiteTheme(() => {
                this.initSlider();
            });
        }

        this.eventService.subscribe([
            {name: gamesEvents.UPDATED_AVAILABLE_GAMES},
        ], (): void => {
            this.initSlider();
        }, this.$destroy);
    }

    protected initSliderConfig(): void {
        this.sliderConfig = {
            slides: this.slides,
            ...this.sliderParams,
        };
    }

    protected prepareModalLinkParams(): void {
        const params: Params.IProviderLinksCParams = {
            type: 'default',
            sliderParams: null,
            iconsType: this.$params.iconsType,
            colorIconBg: this.$params.colorIconBg,
            themeMod: 'inside-modal',
        };

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')) {
            _unset(params, 'colorIconBg');
        }

        this.modalLinkParams = params;
    }

    protected prepareMerchants(): MerchantModel[] {
        let preparedMerchants: MerchantModel[] =
            _sortedUniqBy(this.gamesCatalogService.getFilteredMerchants(), (item: MerchantModel) => item.alias);

        if (this.$params.excludeByAlias) {
            preparedMerchants = preparedMerchants.filter((merchant: MerchantModel) => {
                return !this.$params.excludeByAlias.includes(merchant.alias);
            });
        }

        if (this.$params.orderedByAlias) {
            preparedMerchants = preparedMerchants.sort((firstMerchant, secondMerchant) => {
                const firstMerchantOrder = this.$params.orderedByAlias[firstMerchant.alias]
                    ? this.$params.orderedByAlias[firstMerchant.alias]
                    : 0;
                const secondMerchantOrder = this.$params.orderedByAlias[secondMerchant.alias]
                    ? this.$params.orderedByAlias[secondMerchant.alias]
                    : 0;

                return firstMerchantOrder - secondMerchantOrder;
            });
        }

        return preparedMerchants;
    }
}
