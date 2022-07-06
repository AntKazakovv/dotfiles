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

import {BehaviorSubject} from 'rxjs';
import {
    first,
    takeUntil,
} from 'rxjs/operators';

import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';
import {
    ConfigService,
    EventService,
    IFormWrapperCParams,
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
import {IconModel} from 'wlc-engine/modules/core/system/models/icon-list-item.model';

import * as Params from './provider-links.params';

import _times from 'lodash-es/times';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';

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
    public sliderConfig: IFormWrapperCParams = {components: []};

    protected $itemsChanges = new BehaviorSubject<IconModel[]>([]);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProviderLinksCParams,
        protected configService: ConfigService,
        protected gamesCatalogService: GamesCatalogService,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, eventService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.loadSliderComponentOnSliderType();
    }

    public async ngAfterViewInit(): Promise<void> {
        await this.gamesCatalogService.ready;

        if (this.configService.get<boolean>('$base.colorThemeSwitching.use')
        && this.$params.colorIconBg && this.$params.iconsType === 'color') {
            this.subscribeOnToggleSiteTheme(() => {this.setMerchantsList(); this.setSliderParams();});
        }
        this.setMerchantsList();
        this.setSliderParams();
        this.ready = true;
    }

    public showModal(): void {
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
                themeMod: 'inside-modal',
            },
        });
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
                        title: gettext('See all games of') + ' ' + item.alias,
                        sref: 'app.providers',
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
        this.sliderParams.swiper = this.$params.sliderParams || {};

        this.slides = _times(this.items.length, (index: number) => {
            return {
                templateRef: this.iconTemplate,
                templateParams: {item: this.items[index]},
            };
        });

        this.cdr.markForCheck();
    }

    protected loadSliderComponentOnSliderType(): void {
        this.$itemsChanges
            .pipe(
                first((items: IconModel[]) => {
                    const hasItems = this.ready && items.length;
                    const isTypeSlider = this.$params.type === 'slider';

                    return hasItems && isTypeSlider;
                }),
                takeUntil(this.$destroy),
            )
            .subscribe(() => this.loadSliderComponent());
    }

    protected loadSliderComponent(): void {
        this.sliderConfig = {
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: <ISliderCParams>{
                        slides: this.slides,
                        swiper: this.sliderParams,
                    },
                },
            ],
        };
    }
}
