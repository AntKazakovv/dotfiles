import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    TemplateRef,
    AfterViewInit,
    AfterContentChecked,
    ElementRef,
    ViewContainerRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    RawParams,
    UIRouter,
    StateService,
} from '@uirouter/core';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import _isString from 'lodash-es/isString';
import _isObject from 'lodash-es/isObject';
import _has from 'lodash-es/has';
import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _reduce from 'lodash-es/reduce';
import _find from 'lodash-es/find';
import _forEach from 'lodash-es/forEach';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _flatten from 'lodash-es/flatten';
import _isEqual from 'lodash-es/isEqual';
import _includes from 'lodash-es/includes';
import _trim from 'lodash-es/trim';

import {
    AbstractComponent,
    IMixedParams,
    ActionService,
    ModalService,
    ConfigService,
    DeviceType,
    EventService,
    InjectionService,
    GlobalHelper,
    IWrapperCParams,
    ISlide,
    ISliderCParams,
} from 'wlc-engine/modules/core';
import {TIconExtension} from 'wlc-engine/modules/menu/system/interfaces/menu.interface';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {
    IMenuItem,
    IMenuItemsGroup,
    IStateForExpand,
    MenuItemObjectType,
} from 'wlc-engine/modules/menu/components/menu/menu.params';

import * as Params from './menu.params';

@Component({
    selector: '[wlc-menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('opened', style({
                height: '*',
                opacity: 1,
                margin: '*',
                'pointer-events': 'initial',
            })),
            state('closed', style({
                height: '0px',
                opacity: 0,
                margin: 0,
                'pointer-events': 'none',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.3s'),
            ]),
        ]),
    ],
})
export class MenuComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit, AfterContentChecked  {
    public items: Params.MenuItemObjectType[];
    public override $params: Params.IMenuCParams;
    public inited: boolean = false;

    @ViewChild('anchor') tplAnchor: TemplateRef<ElementRef>;
    @ViewChild('sref') tplSref: TemplateRef<ElementRef>;
    // меняем на sref для swiper чтобы он отрисовывал нужный шаблон (после ревью удалить коммент)
    @ViewChild('sref') tplTitle: TemplateRef<ElementRef>;
    @ViewChild('modal') tplModal: TemplateRef<ElementRef>;
    @ViewChild('href') tplHref: TemplateRef<ElementRef>;
    @ViewChild('event') tplEvent: TemplateRef<ElementRef>;
    @ViewChild('scroll') tplScroll: TemplateRef<ElementRef>;
    @ViewChild('srefWithParent') srefWithParent: ViewContainerRef;
    @ViewChild('content') tplContent: TemplateRef<ElementRef>;

    @Input() protected inlineParams: Params.IMenuCParams;

    public slides: ISlide[] = [];
    public iconsFallback: string = '';
    public useArrows: boolean = false;
    public innerLinkArrow: string = '';
    public outerLinkArrow: string = '';
    public sliderConfig!: IWrapperCParams;

    protected staticService: StaticService;
    protected iconsExtension: TIconExtension = 'svg';
    protected scrollDuration = 400;
    protected baseUrl: string = '';
    protected lang: string = '';
    protected isAffiliate: boolean = false;
    protected isMobile: boolean = false;
    protected sliderParams!: ISliderCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        cdr: ChangeDetectorRef,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected stateService: StateService,
        configService: ConfigService,
        protected eventService: EventService,
        protected injectionService: InjectionService,
        protected translateService: TranslateService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    protected get isAuth(): boolean {
        return this.configService.get('$user.isAuthenticated');
    }

    /**
     * Open or hide menu items dropdown
     *
     * @param {IMenuItemsGroup} item Menu items dropdown
     */
    public toggleDropdown(item: Params.IMenuItemsGroup): void {
        if (this.$params.dropdowns?.expandableOnHover) {
            return;
        }

        if (!this.$params.dropdowns?.expandableOnClick) {
            if (item.parent.type === 'sref') {
                this.router.stateService.go(
                    item.parent.params.state.name,
                    item.parent.params.state.params,
                );
            }
            return;
        }
        item.expand = !item.expand;
    }

    public override async ngOnChanges(changes: SimpleChanges): Promise<void> {
        super.ngOnChanges(changes);
        if (!this.inited) {
            return;
        }
        await this.initItems();
        // TODO after #465119
        this.initSliderConfig();
    }

    public ngAfterContentChecked(): void {
        this.cdr.detectChanges();
    }

    public ngAfterViewInit(): void {
        this.initItems();
        this.inited = true;
        this.cdr.detectChanges();
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.initSliderConfig();

        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.iconsExtension = this.$params.common.icons.extension;
        this.iconsFallback = this.setExtension(this.$params.common.icons.fallback);

        if (_get(this.$params, 'common.icons.arrows.use')) {
            this.useArrows = true;
            this.innerLinkArrow = this.$params.common.icons.arrows.innerLinks;
            this.outerLinkArrow = this.$params.common.icons.arrows.outerLinks;
        }

        if (this.$params.common?.scrollToSelector) {
            setTimeout(() => {
                this.scrollTo(this.$params.common.scrollToSelector);
            }, this.$params.scrollDuration);
        }

        this.isAffiliate = this.configService.get<string>('$base.app.type') === 'aff';

        if (this.isAffiliate) {
            this.baseUrl = this.configService.get<string>('$base.affiliate.siteUrl');
        } else if (GlobalHelper.isMobileApp()) {
            this.baseUrl = GlobalHelper.mobileAppApiUrl;
        }

        this.lang = this.configService.get<string>('currentLanguage') || 'en';
        this.initEventHandlers();
    }

    /**
     * Arrow icon for menu item
     *
     * @param {IMenuItem} item Menu item
     * @returns {string} Arrow icon path
     */
    public menuItemArrow(item: IMenuItem): string {
        if (item.type === 'href') {
            return _includes(this.getHref(item), location.hostname)
                ? this.innerLinkArrow
                : this.outerLinkArrow;
        }
        return this.innerLinkArrow;
    }

    /**
     * Get translated name of menu item
     *
     * @param {IMenuItem} item Menu item
     * @returns {string} Translated item name
     */
    public menuItemName(item: IMenuItem): string {
        if (_isObject(item.name)) {
            const translatedName: string = item.name[this.translateService.currentLang];
            if (!translatedName) {
                return item.noTranslate ? item.name['en'] : this.translateService.instant(item.name['en']);
            }
            return translatedName;
        }

        const itemName: string = item.name || '';

        if (itemName) {
            return item.noTranslate ? itemName : this.translateService.instant(itemName);
        }
        return itemName;
    }

    /**
     * Check menu item is active or not by state
     *
     * @param {string | string[]} state State
     * @param {RawParams} stateParams State params
     * @returns {boolean} True if menu item active by specified state
     */
    public isActive(state: string | string[], stateParams?: RawParams): boolean {
        if (_isString(state)) {
            return this.stateService.includes(state, stateParams);
        } else {
            return _reduce(state, (res: boolean, item: string): boolean => {
                return res || this.stateService.includes(item, stateParams);
            }, false);
        }
    }

    /**
     * Scroll to element with specified selector
     *
     * @param {string} selector Html element selector
     */
    public scrollTo(selector: string): void {
        this.actionService.scrollTo(selector);
    }

    /**
     * Get menu item icon
     *
     * @param {IMenuItem} item Menu item
     * @returns {string} Menu item icon path
     */
    public getIcon(item: Params.IMenuItem): string {
        if (item.iconUrl) {
            return item.iconUrl;
        }
        if (item.icon) {
            return this.setExtension(item.icon);
        }
        return '';
    }

    /**
     * Get icon fallabck
     *
     * @param {IMenuItem} item Menu item
     * @returns {string} Fallback icon path
     */
    public getIconFallback(item: Params.IMenuItem): string {
        if (item.iconFallback) {
            return this.setExtension(item.iconFallback);
        }
        return this.iconsFallback;
    }

    /**
     * Open modal
     *
     * @param {IMenuItemParamsModal} item Modal params
     * @returns {Promise<void>}
     */
    public async openModal(item: Params.IMenuItemParamsModal): Promise<void> {
        const {name, params} = item.params.modal;
        if (name) {
            this.modalService.showModal(name, params || {});
        }
    }

    public hrefClick(item: Params.IMenuItem): void {
        if (GlobalHelper.isMobileApp()) {
            const href: string = this.getHref(item);
            GlobalHelper.openBrowserLinkFromMobileApp(href);
        }
    }

    /**
     * Get href link
     *
     * @param {string | IMenuItemParamsHref} data Href options
     * @returns {string} Href link
     */
    public getHref(item: Params.IMenuItem): string {
        if (!item?.params?.href) {
            return;
        }

        let href: string = '';

        if (_isString(item.params.href)) {
            href =  item.params.href;
        } else {
            href = item.params.href.baseSiteUrl
                ? _trim(this.baseUrl, '/') + '/' + this.lang + item.params.href.url
                : item.params.href.url.replace('[lang]', this.lang);

            if (item.params.href.jwtToken) {
                href = GlobalHelper.hrefLinkWithJwt(href);
            }
        }
        return href;
    }

    /**
     * Emits event
     *
     * @param {IMenuItemParamsEvent} event event options
     */
    public eventEmit(event: Params.IMenuItemParamsEvent): void {
        this.eventService.emit(event);
    }

    /**
     * Set or change icon extension
     *
     * @param {string} iconPath Icon path with or without icon extension
     * @returns {string} Icon path with extension
     */
    protected setExtension(iconPath: string): string {
        return iconPath.replace(/\.[\da-z]+$/i, '') + `.${this.iconsExtension}`;
    }

    /**
     * Init menu items
     *
     * @returns {Promise<void>}
     */
    protected async initItems(): Promise<void> {
        this.items = MenuHelper.getItems(
            {
                isMobile: this.isMobile,
                isAuth: this.isAuth,
                items: this.$params.items,
            },
        );

        if (this.isAffiliate) {
            this.items = this.changeLinkForAffiliate(this.items);
        }

        await this.initWpItems();
        this.expandItems();

        if (!this.items.length) {
            this.addModifiers('empty');
        } else {
            this.removeModifiers('empty');
        }

        if (this.$params.common?.useSwiper) {
            this.slides = [];
            this.addModifiers('swiper');
            _forEach(this.items, (item) => {
                let template: TemplateRef<any>;
                let templateParams = {item: item};

                if (_has(item, 'parent')) {
                    return;
                }

                const menuItem: Params.IMenuItem = item as Params.IMenuItem;
                switch (menuItem.type) {
                    case 'anchor':
                        template = this.tplAnchor;
                        break;
                    case 'sref':
                        template = this.tplSref;
                        break;
                    case 'title':
                        template = this.tplTitle;
                        break;
                    case 'modal':
                        template = this.tplModal;
                        break;
                    case 'href':
                        template = this.tplHref;
                        break;
                    case 'scroll':
                        template = this.tplScroll;
                        break;
                    case 'event':
                        template = this.tplEvent;
                        break;
                }
                this.slides.push({
                    templateRef: template,
                    templateParams: templateParams,
                });
            });

            if (this.$params?.common?.swiper?.scrollToStart) {
                this.sliderParams.events.next({name: 'scrollToStart'});
                this.sliderParams.events.next({name: 'update'});
            }

            this.sliderParams.slides = this.slides;
        }

        this.expandByCurrentState();

        this.cdr.detectChanges();
    }

    /**
     * Expand menu dropdowns
     *
     * @param {boolean} force Force expand all menu dropdowns
     */
    protected expandItems(force: boolean = false): void {
        if (this.$params.expandOnStart || force) {
            _forEach(this.items, (item: Params.IMenuItemsGroup): void => {
                if (item.parent) {
                    item.expand = true;
                }
            });
        } else {
            _forEach(this.items, (item: Params.IMenuItemsGroup): void => {
                if (item.parent) {
                    if (this.isActive(
                        item.parent.params?.state?.name,
                        item.parent.params?.state?.params,
                    )) {
                        item.expand = true;
                        return;
                    }

                    item.expand = !!_find(item.items, (subItem: MenuItemObjectType): boolean => {
                        if (this.checkIsMenuItem(subItem)) {
                            const {name, params} = subItem.params?.state;

                            return this.isActive(
                                name,
                                params,
                            );
                        }

                        return false;
                    });

                }
            });
        }
        this.cdr.markForCheck();
    }

    /**
     * Check value is menuItem or menuItemGroup
     *
     * @param {MenuItemObjectType} value Item options
     * @returns {value is IMenuItem}
     */
    protected checkIsMenuItem = (value: MenuItemObjectType): value is Params.IMenuItem => {
        return !_has(value, 'parent');
    };

    protected changeLinkForAffiliate(items: Params.MenuItemObjectType[]): Params.MenuItemObjectType[] {
        return _map(
            items,
            (item: Params.MenuItemObjectType) => {
                if (item['type'] === 'sref' && item['params']?.['href']) {
                    (item as Params.IMenuItem).type = 'href';
                }

                if (item['items']) {
                    (item as Params.IMenuItemsGroup).items =
                        (this.changeLinkForAffiliate((item as Params.IMenuItemsGroup).items) as Params.IMenuItem[]);
                }

                return item;
            });
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        this.listenAuthEvents();

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;
                this.initItems();
            });

        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (): void => {
            if (this.$params.dropdowns?.expandByStates) {
                this.expandByCurrentState();
                return;
            }
            this.expandItems();
        }, this.$destroy);
    }

    protected listenAuthEvents(): void {
        this.eventService
            .filter([{name: 'LOGIN'}, {name: 'LOGOUT'}], this.$destroy)
            .subscribe(async () => {
                await this.initItems();
                this.initSliderConfig();
            });
    }

    /**
     * Expand menu dropdowns by current state name and state params
     */
    protected expandByCurrentState(): void {
        if (!this.$params.dropdowns?.expandByStates) {
            return;
        }

        const stateName = this.router.globals.current.name;
        const stateParams = this.router.globals.current.params;

        const forceExpand: boolean = !!_find(
            this.$params.dropdowns.expandByStates,
            (state: IStateForExpand): boolean => {
                return state.name === stateName && _isEqual(state.params, state.params ? stateParams : undefined);
            });

        this.expandItems(forceExpand);
    }

    /**
     * Init wp items
     *
     * @returns {Promise<void>}
     */
    protected async initWpItems(): Promise<void> {
        let newItems: Array<Params.MenuItemObjectType | Params.MenuItemObjectType[]> = [];
        let useExpand: boolean = false;

        await Promise.all(_map(this.items, async (item: Params.MenuItemObjectType, index: number): Promise<void> => {
            let wpParams: Params.IMenuItemParamsWp;
            if (item.type === 'wordpress') {
                wpParams = _get(item, 'params.wp');
            } else if (item.type === 'group') {
                const itemsGroup: IMenuItemsGroup = item as IMenuItemsGroup;
                if (itemsGroup.parent.type === 'wordpress') {
                    wpParams = itemsGroup.parent.params?.wp;
                }
            }

            if (!wpParams?.slug) {
                newItems[index] = item;
                return;
            }

            if (!this.staticService) {
                this.staticService = await this.injectionService.getService<StaticService>('static.static-service');
            }

            const requests: Promise<TextDataModel[]>[] = _map(
                wpParams.slug,
                (slug: string): Promise<TextDataModel[]> => {
                    return this.staticService.getPostsListByCategorySlug(slug);
                });

            await Promise.all(requests).then((data: TextDataModel[][]) => {
                let posts: TextDataModel[] = _flatten<TextDataModel>(data);

                if (_has(item, 'params.wp.exclude') || _has(item, 'parent.params.wp.exclude')) {
                    posts = _filter(posts, (post: TextDataModel): boolean => {
                        const slugs = _get(item, 'params.wp.exclude') || _get(item, 'parent.params.wp.exclude');
                        return !_includes(slugs, post.slug);
                    });
                }

                const subItems: Params.IMenuItem[] = MenuHelper.getItemsByWpPosts({
                    posts: posts,
                    defaultItemState: wpParams.defaultState,
                    defaultItemType: wpParams.defaultType,
                    wlcElementPrefix: `link_${this.$params.type}_`,
                    iconFolder: wpParams.iconFolder,
                    disableTooltip: wpParams.disableTooltip,
                });

                if (item.type === 'group') {
                    _set(item, 'items', subItems);
                    useExpand = true;

                    if (wpParams.parentAsLink && (item as IMenuItemsGroup).parent) {
                        const parentParams = {
                            ...(item as IMenuItemsGroup).parent.params,
                            state: subItems[0].params.state,
                        };

                        _set(item, 'parent.params', parentParams);
                    }
                }

                if (wpParams.replace) {
                    if (subItems.length) {
                        newItems[index] = subItems;
                    }
                } else {
                    newItems[index] = item;
                }
            });
        }));

        if (newItems.length) {
            this.items = _flatten(newItems);
        }

        if (useExpand) {
            this.expandItems();
        }
    }

    protected initSliderConfig(): void {
        this.sliderParams = {
            ...this.$params.sliderParams,
            slides: this.slides,
            events: new Subject(),
        };

        this.sliderConfig = {
            components: [
                {
                    name: 'core.wlc-slider',
                    params: this.sliderParams,
                },
            ],
        };
    }
}
