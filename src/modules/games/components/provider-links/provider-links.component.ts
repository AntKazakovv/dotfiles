import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewChild,
    TemplateRef,
    AfterViewInit,
} from '@angular/core';
import {
    StateService,
} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';
import _times from 'lodash-es/times';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';

import {IconListAbstract} from 'wlc-engine/modules/icon-list/system/classes/icon-list-abstract.class';
import {
    ConfigService,
    EventService,
    GlobalHelper,
    IWrapperCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/promo';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';
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

    public $params: Params.IProviderLinksCParams;
    public items: IconModel[] = [];
    public ready: boolean = false;
    public slides: ISlide[] = [];
    public sliderParams: ISliderCParams = {
        swiper: {},
    };
    public sliderConfig: IWrapperCParams;

    protected $itemsChanges = new BehaviorSubject<IconModel[]>([]);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProviderLinksCParams,
        protected configService: ConfigService,
        protected stateService: StateService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, eventService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.gamesCatalogService.ready;

        this.setEventHandlers();
        this.initSlider();
        this.ready = true;
    }

    public showAllProviders(): void {
        if (GlobalHelper.isMobileApp()) {
            this.stateService.go('app.providers');
            return;
        }

        this.modalService.showModal({
            id: 'provider-list',
            modifier: 'provider-list',
            size: 'lg',
            wlcElement: 'provider-list',
            component: ProviderLinksComponent,
            componentParams: {
                type: 'default',
                sliderParams: null,
                iconsType: this.$params.iconsType,
                colorIconBg: this.$params.colorIconBg,
                themeMod: 'inside-modal',
            },
        });
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
    protected setMerchantsList(): void {
        const {iconsType, colorIconBg} = this.$params;
        const showIconAs = iconsType == 'black' ? 'svg' : 'img';

        const merchants: MerchantModel[] = _sortedUniqBy(this.gamesCatalogService.getFilteredMerchants(),
            (item: MerchantModel) => item.alias);

        this.items = this.convertItemsToIconModel<MerchantModel>(
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
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: <ISliderCParams>{
                        slides: this.slides,
                        ...this.sliderParams,
                    },
                },
            ],
        };
    }
}
