import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    ViewEncapsulation,
    ElementRef,
    HostBinding,
    AfterViewChecked,
    ViewChild,
    Injector,
} from '@angular/core';
import {fromEvent} from 'rxjs';
import {
    debounceTime,
    takeUntil,
} from 'rxjs/operators';

import {
    ConfigService,
    EventService,
    LogService,
    ActionService,
    TValueOf,
    InjectionService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {IPaysystem} from 'wlc-engine/modules/core/system/interfaces';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

import * as Params from './icon-list.params';

import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';
import _uniqBy from 'lodash-es/uniqBy';

/**
 *  Component to display an icon list.
 *  Take a look at [IconModel]{@link IconModel} to clarify data for items.
 */
@Component({
    selector: '[wlc-icon-list]',
    templateUrl: './icon-list.component.html',
    styleUrls: ['./styles/icon-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class IconListComponent extends IconListAbstract<Params.IIconListCParams> implements OnInit, AfterViewChecked {
    /** List of items being rendered. */
    public items: IconModel[] = [];
    public $params: Params.IIconListCParams;
    protected wrapper: HTMLElement;
    protected resized: boolean = false;
    protected gamesCatalogService: GamesCatalogService;

    @Input() protected inlineParams: Params.IIconListCParams;
    @HostBinding('class.scrollable--left') protected scrollableLeft: boolean = false;
    @HostBinding('class.scrollable--right') protected scrollableRight: boolean = false;
    @ViewChild('wrapper') wrapperElement: ElementRef;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListCParams,
        protected logService: LogService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected actionService: ActionService,
        protected injectionService: InjectionService,
        private injector: Injector,
        private hostElement: ElementRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    /** Calls method based on the component theme */
    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.runWithThemeParam();
    }

    public ngAfterViewChecked(): void {
        if (this.$params.watchForScroll) {
            this.scrollingCheck();
        }
    }

    protected scrollingCheck(): void {

        if (!this.resized) {
            this.resized = true;

            this.actionService.windowResize()
                .pipe(takeUntil(this.$destroy))
                .pipe(debounceTime(300))
                .subscribe(() => {
                    this.scrollingCheck();
                });
        }


        if (!this.wrapper) {
            this.wrapper = this.wrapperElement.nativeElement
                || this.hostElement.nativeElement.querySelector(`.${this.$params.class || 'wlc-icon-list'}__wrapper`);

            fromEvent(this.wrapperElement.nativeElement, 'scroll')
                .pipe(takeUntil(this.$destroy))
                .pipe(debounceTime(300))
                .subscribe(() => {
                    this.scrollingCheck();
                });
        }

        const {clientWidth, scrollWidth, scrollLeft} = this.wrapperElement.nativeElement;

        this.scrollableLeft = !!scrollLeft;
        this.scrollableRight = (scrollWidth - clientWidth) > scrollLeft;
        this.cdr.markForCheck();
    }

    protected async runWithThemeParam(): Promise<void> {
        switch (this.$params.theme) {
            case ('merchants'):
                await this.setMerchantsList();
                break;
            case ('payments'):
                this.setPaymentsList();
                break;
            default:
                this.setCustomList();
                break;
        }

        this.cdr.markForCheck();
    }

    /** Creates the icon list.
     * Calls if `theme` is `merchants`.
     * Based on games request data.
     **/
    protected async setMerchantsList(): Promise<void> {
        const {theme, type, colorIconBg} = this.$params;
        const showIconAs = type === 'svg' ? 'svg' : 'img';

        await this.configService.ready;
        this.gamesCatalogService = await this.injectionService.getService('games.games-catalog-service');

        this.gamesCatalogService.ready.then(() => {
            let merchants: MerchantModel[] = _sortedUniqBy(this.gamesCatalogService.getAvailableMerchants(),
                (item: MerchantModel) => item.name);

            merchants = this.updateList('merchant', merchants) as MerchantModel[];

            this.items = this.convertItemsToIconModel<MerchantModel>(
                merchants,
                (item) => {
                    return {
                        from: {
                            component: 'IconListComponent',
                            method: 'setMerchantsList',
                        },
                        icon: this.merchantsPaymentsIterator(theme, {
                            showAs: showIconAs,
                            wlcElement: item.wlcElement,
                            nameForPath: item.alias,
                            alt: item.name,
                            colorIconBg: colorIconBg,
                        }),
                    };
                },
            );

            this.cdr.markForCheck();
        });
    }

    /**
     * Creates the icon list.
     * Calls if `theme` is `payments`.
     * Based on bootstrap request data.
     **/
    protected setPaymentsList(): void {
        const {theme, type, colorIconBg} = this.$params;
        const showIconAs = type === 'svg' ? 'svg' : 'img';

        let payments: IPaysystem[] = _uniqBy(this.configService.get('appConfig.siteconfig.payment_systems') || [],
            (item) => item.Name.toLowerCase());

        payments = this.updateList('payment', payments) as IPaysystem[];

        const paymentsIcons = this.convertItemsToIconModel<IPaysystem>(
            payments,
            (item) => {
                return {
                    from: {
                        component: 'IconListComponent',
                        method: 'setPaymentsList',
                    },
                    icon: this.merchantsPaymentsIterator(theme, {
                        showAs: showIconAs,
                        wlcElement: 'block_payment-' + this.wlcElementTail(item.Name),
                        nameForPath: item.Name,
                        colorIconBg: colorIconBg,
                    }),
                };
            },
        );

        if (this.$params.items?.length) {
            this.items = [...paymentsIcons, ...this.getConvertedCustomList()];
        } else {
            this.items = paymentsIcons;
        }

        this.cdr.markForCheck();
    }

    /**
     * @returns {IconModel[]}
     * create and return iconmodel based on items from params
     **/
    protected getConvertedCustomList(): IconModel[] {
        return this.convertItemsToIconModel<IIconParams>(
            this.$params.items,
            (item) => {
                return {
                    icon: item,
                    from: {
                        component: 'IconListComponent',
                        method: 'getConvertedCustomList',
                    },
                };
            },
        );
    }

    /**
     * Creates the icon list.
     * Calls if `theme` is `custom`.
     * Based on `icons` param.
     **/
    protected setCustomList(): void {
        if (this.$params.items?.length) {
            this.items = this.getConvertedCustomList();
        } else {
            console.error('[wlc-icon-list] component requires "items" param on the custom theme');
        }
    }

    /**
     * Update icon list array by $params component
     * @param type {'merchant' | 'payment'} 'merchant' | 'payment'
     * @param source {MerchantModel[] | IPaysystem[]} MerchantModel[] | IPaysystem[]
     * @returns {MerchantModel[] | IPaysystem[]} MerchantModel[] | IPaysystem[]
     **/
    protected updateList(
        type: keyof Params.ListTypes,
        source: TValueOf<Params.ListTypes>,
    ): TValueOf<Params.ListTypes> {
        const isMerchant = type === 'merchant';
        const nameKey = isMerchant ? 'name' : 'Name';

        if (this.$params.common?.[type]) {
            if (this.$params.common[type].exclude?.includes('all')) {
                source = [];
            } else {
                _filter(source, (item) =>
                    !_includes(this.$params.common[type]?.exclude, item[nameKey].toLocaleLowerCase()));
            }

            this.$params.common[type].include?.forEach((name) => {
                if (!_find(source, (item) => item[nameKey].toLocaleLowerCase() === name)) {
                    if (isMerchant) {
                        const merchantByName = this.gamesCatalogService.getMerchantByName(name);

                        if (merchantByName) {
                            (source as MerchantModel[]).push(merchantByName);
                        }
                    } else {
                        (source as IPaysystem[]).push({
                            Name: name,
                            Alias: {},
                            Init: '',
                        });
                    }
                }
            });
        }
        return source;
    }
}
