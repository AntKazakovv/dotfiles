import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input, OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    TemplateRef,
    AfterViewInit,
    ElementRef,
    ViewContainerRef,
} from '@angular/core';
import {
    StateService,
    TransitionService,
} from '@uirouter/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';
import {
    takeUntil,
} from 'rxjs/operators';
import {
    AbstractComponent,
    IMixedParams,
    LayoutService,
    ActionService,
    ModalService,
    ConfigService,
    DeviceType,
    EventService,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    ISlide,
    SliderComponent,
} from 'wlc-engine/modules/promo';
import {
    TIconExtension,
    MenuHelper,
} from 'wlc-engine/modules/menu';
import * as Params from './menu.params';

import _isString from 'lodash-es/isString';
import _has from 'lodash-es/has';
import _reduce from 'lodash-es/reduce';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _forEach from 'lodash-es/forEach';
import _map from 'lodash-es/map';

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
export class MenuComponent extends AbstractComponent implements OnInit, OnChanges, AfterViewInit {
    public items: Params.MenuItemObjectType[];
    public $params: Params.IMenuCParams;
    public inited: boolean = false;

    @ViewChild('slider') slider: SliderComponent;
    @ViewChild('anchor') tplAnchor: TemplateRef<ElementRef>;
    @ViewChild('sref') tplSref: TemplateRef<ElementRef>;
    @ViewChild('title') tplTitle: TemplateRef<ElementRef>;
    @ViewChild('modal') tplModal: TemplateRef<ElementRef>;
    @ViewChild('href') tplHref: TemplateRef<ElementRef>;
    @ViewChild('scroll') tplScroll: TemplateRef<ElementRef>;
    @ViewChild('srefWithParent') srefWithParent: ViewContainerRef;

    @Input() protected inlineParams: Params.IMenuCParams;

    public slides: ISlide[] = [];
    public iconsFallback: string = '';

    protected iconsExtension: TIconExtension = 'svg';
    protected scrollDuration = 400;
    protected baseUrl: string = '';
    protected lang: string = '';
    protected isAffiliate: boolean = false;
    protected isMobile: boolean = false;
    protected isAuth: boolean;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected stateService: StateService,
        protected transitionService: TransitionService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public isActive(state: string | string[]): boolean {
        if (_isString(state)) {
            return this.stateService.includes(state);
        } else {
            return _reduce(state, (res, item) => {
                return res || this.stateService.includes(item);
            }, false);
        }
    }

    public toggleDropdown(item: Params.IMenuItemsGroup): void {
        item.expand = !item.expand;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (!this.inited) {
            return;
        }
        this.initItems();
    }

    public ngAfterViewInit(): void {
        this.inited = true;
        this.initItems();

        this.transitionService.onSuccess({}, () => {
            this.expandItems();
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.isMobile = this.configService.get<boolean>('appConfig.mobile');
        this.iconsExtension = this.$params.common.icons.extension;
        this.iconsFallback = this.setExtension(this.$params.common.icons.fallback);

        if (this.$params.common?.scrollToSelector) {
            setTimeout(() => {
                this.scrollTo(this.$params.common.scrollToSelector);
            }, this.$params.scrollDuration);
        }

        this.isAffiliate = this.configService.get<string>('$base.app.type') === 'aff';

        if (this.isAffiliate) {
            this.baseUrl = this.configService.get<string>('$base.affiliate.siteUrl');
        }

        this.lang = this.configService.get<string>('currentLanguage') || 'en';
        this.initEventHandlers();
    }

    public scrollTo(selector: string): void {
        this.actionService.scrollTo(selector);
    }

    public getIcon(item: Params.IMenuItem): string {
        if (item.iconUrl) {
            return item.iconUrl;
        }
        if (item.icon) {
            return this.setExtension(item.icon);
        }
        return '';
    }

    public async openModal(item: Params.IMenuItemParamsModal) {
        const {name, params} = item.params.modal;
        if (name) {
            this.modalService.showModal(name, params || {});
        }
    }

    public getHref(data: string | Params.IMenuItemParamsHref): string {
        if (_isString(data)) {
            return data;
        } else if (data.baseSiteUrl) {
            return this.baseUrl + this.lang + data.url;
        } else {
            return data.url;
        }
    }

    protected setExtension(iconPath: string): string {
        return GlobalHelper.setFileExtension(iconPath, this.iconsExtension);
    }

    protected initItems(): void {
        this.items = MenuHelper.getItems(
            {
                isMobile: this.isMobile,
                isAuth: this.isAuth,
                items: this.$params.items,
                type: this.$params.type,
            },
        );

        this.expandItems();

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
                }
                this.slides.push({
                    templateRef: template,
                    templateParams: templateParams,
                });
            });

            if (this.slider && this.$params?.common?.swiper?.scrollToStart) {
                this.slider.scrollToStart();
                this.slider.update();
            }
        }

        this.cdr.detectChanges();
    }

    protected expandItems(): void {
        if (this.$params.expandOnStart) {
            _forEach(this.items, (item: Params.IMenuItemsGroup) => {
                if (item.parent) {
                    item.expand = true;
                }
            });
        } else {
            _forEach(this.items, (item: Params.IMenuItemsGroup) => {
                if (item.parent) {
                    item.expand = !!_find(item.items, (subItem) => {
                        if (_has(subItem, 'parent')) {
                            return false;
                        }
                        return this.isActive((subItem as Params.IMenuItem).params?.state?.name);
                    });
                }
            });
        }

        if (this.isAffiliate) {
            this.items = this.changeLinkForAffiliate(this.items);
        }

        this.cdr.markForCheck();
    }

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
        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
        });

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                if (!type) {
                    return;
                }

                this.isMobile = type !== DeviceType.Desktop;
                this.cdr.markForCheck();
            });
    }
}
