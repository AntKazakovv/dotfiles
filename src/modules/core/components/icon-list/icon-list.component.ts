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
    LayoutService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {
    IconModel,
    IIconParams,
} from 'wlc-engine/modules/core/system/models/icon-list-item.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {IPaysystem} from 'wlc-engine/modules/core/system/services/config/app-config.model';
import {IconListAbstract} from 'wlc-engine/modules/core/system/classes/icon-list-abstract.class';

import * as Params from './icon-list.params';

import _includes from 'lodash-es/includes';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _sortedUniqBy from 'lodash-es/sortedUniqBy';
import _uniqBy from  'lodash-es/uniqBy';

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
    public items: IconModel[];
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
        protected layoutService: LayoutService,
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
                this.setPaymentsLst();
                break;
            default:
                this.setCustomLst();
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
        await this.layoutService.importModules(['games']);
        this.gamesCatalogService = this.injector.get(GamesCatalogService);

        this.gamesCatalogService.ready.then(() => {
            const merchants: MerchantModel[] = _sortedUniqBy(this.gamesCatalogService.getAvailableMerchants(),
                (item: MerchantModel) => item.alias);

            this.setItemsList<MerchantModel>(merchants, (item) => this.merchantsPaymentsIterator(theme, {
                showAs: showIconAs,
                wlcElement: item.wlcElement,
                nameForPath: item.alias,
                alt: item.name,
                colorIconBg: colorIconBg,
            }));

            this.cdr.markForCheck();
        });
    }

    /**
     * Creates the icon list.
     * Calls if `theme` is `payments`.
     * Based on bootstrap request data.
     **/
    protected setPaymentsLst(): void {
        const {theme, type, colorIconBg} = this.$params;
        const showIconAs = type === 'svg' ? 'svg' : 'img';

        let payments: IPaysystem[] = _uniqBy(this.configService.get('appConfig.siteconfig.payment_systems') || [],
            (item) => item.Name.toLowerCase());

        if (this.$params.common?.payment?.exclude?.length) {

            if (this.$params.common.payment.exclude[0] === 'all') {
                payments = [];
            } else {
                payments = _filter(payments, (item) => {
                    return !_includes(this.$params.common.payment.exclude, item.Name.toLocaleLowerCase());
                });
            }
        }

        if (this.$params.common?.payment?.include?.length) {
            this.$params.common.payment.include.forEach((item) => {
                if (!_find(payments, (i) => i.Name.toLocaleLowerCase() === item)) {
                    payments.push({
                        Name: item,
                        Alias: {},
                        Init: '',
                    });
                }
            });
        }

        this.setItemsList<IPaysystem>(payments, (item) =>this.merchantsPaymentsIterator(theme, {
            showAs: showIconAs,
            wlcElement: 'block_payment-' + this.wlcElementTail(item.Name),
            nameForPath: item.Name,
            colorIconBg: colorIconBg,
        }));
    }

    /**
     * Creates the icon list.
     * Calls if `theme` is `custom`.
     * Based on `icons` param.
     **/
    protected setCustomLst(): void {
        if (this.$params.items?.length) {
            this.setItemsList<IIconParams>(this.$params.items, (item) => item);
        } else {
            console.error('[wlc-icon-list] component requires "items" param on the custom theme');
        }
    }

}
