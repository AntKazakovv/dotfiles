import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input, OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild,
    TemplateRef,
    AfterViewInit,
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

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {
    LayoutService,
    ActionService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {IMenuItem, IMenuItemsGroup} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {ISlide, ISliderCParams} from 'wlc-engine/modules/promo/components/slider/slider.params';
import {SliderComponent} from 'wlc-engine/modules/promo/components/slider/slider.component';

import {
    forEach as _forEach,
    has as _has,
    find as _find,
    isString as _isString,
    reduce as _reduce,
} from 'lodash-es';

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
    @ViewChild('anchor') tplAnchor: TemplateRef<any>;
    @ViewChild('sref') tplSref: TemplateRef<any>;
    @ViewChild('title') tplTitle: TemplateRef<any>;
    @ViewChild('modal') tplModal: TemplateRef<any>;
    @ViewChild('href') tplHref: TemplateRef<any>;
    @ViewChild('scroll') tplScroll: TemplateRef<any>;

    @Input() protected inlineParams: Params.IMenuCParams;

    public slides: ISlide[] = [];
    public sliderParams: ISliderCParams = {
        swiper: {
            direction: 'horizontal',
            slidesPerView: 'auto',
            spaceBetween: 10,
        },
    };
    public iconsFallback: string = '';

    protected iconsExtension: string = 'svg';
    protected scrollDuration = 300;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected stateService: StateService,
        protected transitionService: TransitionService,
    ) {
        super(
            <IMixedParams<Params.IMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
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

        this.iconsFallback = this.$params.common?.icons?.fallback;

        if (this.$params.common?.scrollToSelector) {
            setTimeout(() => {
                this.scrollTo(this.$params.common.scrollToSelector);
            }, this.scrollDuration);
        }
    }

    public scrollTo(selector: string): void {
        this.actionService.scrollTo(selector);
    }

    public getIcon(item: IMenuItem): string {
        if (item.icon) {
            return item.icon.split('.').length > 1 ? item.icon : `${item.icon}.${this.iconsExtension}`;
        }
        return '';
    }

    public async openModal(item: Params.IMenuItemParamsModal) {
        const component: any = await this.layoutService.loadComponent(item.params.modal.name);
        if (component) {
            this.modalService.showModal({
                id: 'static-text',
                component: component,
                componentParams: {
                    slug: item.params.modal.params.slug,
                },
                modifier: 'info',
                modalTitle: 'Loading...',
                scrollable: true,
                size: 'lg',
            });
        }
    }

    protected initItems(): void {
        this.items = MenuHelper.getItems(
            {
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

                const menuItem: IMenuItem = item as IMenuItem;
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
        _forEach(this.items, (item: IMenuItemsGroup) => {
            if (item.parent) {
                item.expand = !!_find(item.items, (subItem) => {
                    return this.isActive(subItem.params?.state?.name);
                });
            }
        });
    }
}
