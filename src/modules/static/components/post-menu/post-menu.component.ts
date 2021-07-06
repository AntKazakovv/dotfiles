import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
    TemplateRef,
    ElementRef,
    ViewChild,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';
import {ISlide} from 'wlc-engine/modules/promo';
import {
    AbstractComponent,
    ActionService,
    ConfigService,
    GlobalHelper,
    IWrapperCParams,
} from 'wlc-engine/modules/core';
import {
    StaticService,
    TextDataModel,
} from 'wlc-engine/modules/static';

import * as Params from './post-menu.params';

import _get from 'lodash-es/get';
import _sortBy from 'lodash-es/sortBy';
import _includes from 'lodash-es/includes';
import _merge from 'lodash-es/merge';
import _map from 'lodash-es/map';
import _isArray from 'lodash-es/isArray';
import _flatten from 'lodash-es/flatten';
import _filter from 'lodash-es/filter';

@Component({
    selector: '[wlc-post-menu]',
    templateUrl: './post-menu.component.html',
    styleUrls: ['./styles/post-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public menuItems: TextDataModel[];
    public groupedMenuItems: TextDataModel[][];
    public title: string;
    public type = 'sref';
    public basePath: string;
    public $params: Params.IPostMenuCParams;
    public swiperConfig: IWrapperCParams;
    public useSlider: boolean = false;

    @ViewChild('menuItemRef') protected menuItemRef: TemplateRef<ElementRef>;

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected injectParams: Params.IPostMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected actionService: ActionService,
        private translate: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        if (this.configService.get('$base.app.type') === 'aff') {
            const basePath: Params.IBasePath = {
                url: this.configService.get<string>('$base.affiliate.siteUrl'),
                addLanguage: true,
            };
            _merge(this.$params.common, {basePath});
        }

        const {categorySlug, useSlider} = this.$params.common;
        let lists: TextDataModel[][] = [];

        if (_isArray(categorySlug)) {
            const requests = _map(categorySlug, (slug) => {
                return this.staticService.getPostsListByCategorySlug(slug);
            });

            lists = _filter(await Promise.all(requests), ({length}) => !!length);
        } else {
            lists = [await this.staticService.getPostsListByCategorySlug(categorySlug)];
        }

        this.setMenuItems(lists);

        if (useSlider) {
            const breakpoint = window.matchMedia(this.$params.asListBp);

            if (!breakpoint.matches) {
                this.useSlider = true;
                this.swiperConfig = this.getSwiperConfig();
            }

            GlobalHelper.mediaQueryObserver(breakpoint)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {
                    if (!event.matches) {
                        this.useSlider = true;
                        if (!this.swiperConfig) {
                            this.swiperConfig = this.getSwiperConfig();
                        }
                    } else {
                        this.useSlider = false;
                    }
                    this.cdr.markForCheck();
                });
        }

        this.isReady = true;

        this.prepareParams();
        this.cdr.markForCheck();
    }

    public getFullOuterLink({outerLink}: TextDataModel): string {
        return _includes(outerLink, '//') ? outerLink : '//' + outerLink;
    }

    protected getSwiperConfig(): IWrapperCParams {
        const slides: ISlide[] = _map(this.menuItems, (item) => {
            return {
                templateRef: this.menuItemRef,
                templateParams: {item},
            };
        });

        return {
            class: '',
            components: [
                {
                    name: 'promo.wlc-slider',
                    params: {
                        slides,
                        swiper: this.$params.swiperParams,
                    },
                },
            ],
        };
    }

    protected prepareParams(): void {
        this.title = _get(this.$params, 'common.title');

        if (this.$params.common.basePath?.url) {
            this.type = 'href';
            this.setBasePath();
        }
    }

    protected setBasePath(): void {
        this.basePath = this.$params.common.basePath?.url;

        if (!this.basePath.endsWith('/')) {
            this.basePath += '/';
        }

        if (this.$params.common.basePath.addLanguage) {
            this.basePath += this.translate.currentLang + '/';
        }

        if (this.$params.common.basePath.page) {
            this.basePath += this.$params.common.basePath.page + '/';
        }
    }

    protected setMenuItems(lists: TextDataModel[][]): void {
        this.menuItems = _sortBy(_flatten(lists), (item) => item.sortOrder);
        if (this.$params.common.groupBySlag && lists.length > 1) {
            this.groupedMenuItems = _map(lists, (subList) => _sortBy(subList, (item) => item.sortOrder));
        }
    }
}
