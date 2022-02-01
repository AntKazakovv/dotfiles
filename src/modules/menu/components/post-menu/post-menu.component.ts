import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {takeUntil} from 'rxjs/operators';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ActionService} from 'wlc-engine/modules/core/system/services/action/action.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {StaticService} from 'wlc-engine/modules/static/system/services/static/static.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers';
import {TextDataModel} from 'wlc-engine/modules/static/system/models/textdata.model';
import {
    IMenuItem,
    WpItemType,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    MenuHelper,
} from 'wlc-engine/modules/menu/system/helpers';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

import * as Params from './post-menu.params';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

import _get from 'lodash-es/get';
import _set from 'lodash-es/set';
import _clone from 'lodash-es/clone';
import _includes from 'lodash-es/includes';
import _merge from 'lodash-es/merge';
import _map from 'lodash-es/map';
import _isArray from 'lodash-es/isArray';
import _flatten from 'lodash-es/flatten';
import _filter from 'lodash-es/filter';
import _concat from 'lodash-es/concat';

@Component({
    selector: '[wlc-post-menu]',
    templateUrl: './post-menu.component.html',
    styleUrls: ['./styles/post-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public groupedMenu: MenuParams.IMenuCParams[];
    public title: string;
    public type: WpItemType = 'sref';
    public basePath: string;
    public $params: Params.IPostMenuCParams;
    public useSwiper: boolean;

    protected staticService: StaticService;
    protected wlcElementPrefix: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPostMenuCParams,
        protected injectionService: InjectionService,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected actionService: ActionService,
        private translate: TranslateService,
        @Inject(WINDOW) private window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();
        this.prepareParams();

        this.staticService = await this.injectionService.getService<StaticService>('static.static-service');
        const posts: TextDataModel[][] = await this.getWpPosts();

        this.setMenuItems(posts);
        this.isReady = true;
        this.cdr.detectChanges();
    }

    protected prepareParams(): void {
        this.title = this.$params.common?.title;

        if (this.configService.get('$base.app.type') === 'aff') {
            const basePath: Params.IBasePath = {
                url: this.configService.get<string>('$base.affiliate.siteUrl'),
                addLanguage: true,
            };
            _merge(this.$params.common, {basePath});
        }

        if (this.$params.common.basePath?.url) {
            this.type = 'href';
            this.setBasePath();
        }

        this.wlcElementPrefix = 'link_';
        if (this.$params.theme === 'contacts') {
            this.wlcElementPrefix = 'left_link_';
        }

        this.useSwiper = _get(this.$params, 'menuParams.common.useSwiper', false);
        if (this.useSwiper) {
            const breakpoint = this.window.matchMedia(this.$params.asListBp);
            this.useSwiper = !breakpoint.matches;
            this.updateSwiperMode();

            GlobalHelper.mediaQueryObserver(breakpoint)
                .pipe(takeUntil(this.$destroy))
                .subscribe((event: MediaQueryListEvent) => {
                    if (!event.matches) {
                        this.useSwiper = true;
                    } else {
                        this.useSwiper = false;
                    }
                    this.updateSwiperMode();
                });
        } else {
            this.addModifiers('without-swiper');
        }
    }

    /**
     * Update swiper mode (enable or not)
     */
    protected updateSwiperMode(): void {
        _set(this.$params, 'menuParams.common.useSwiper', this.useSwiper);
        this.$params.menuParams = _clone(this.$params.menuParams);
        this.cdr.detectChanges();

        if (!this.useSwiper) {
            this.addModifiers('without-swiper');
        } else {
            this.removeModifiers('without-swiper');
        }
    }

    /**
     * Set base path for href links
     */
    protected setBasePath(): void {
        this.basePath = MenuHelper.getHrefItemBasePath({
            url: this.$params.common.basePath?.url,
            lang: this.$params.common.basePath?.addLanguage ? this.translate.currentLang + '/' : '',
            page: this.$params.common.basePath?.page,
        });
    }

    /**
     * Get wordpress posts data by category slugs from component settings
     *
     * @returns {Promise<TextDataModel[][]>}
     */
    protected async getWpPosts(): Promise<TextDataModel[][]> {
        const {categorySlug, exclude} = this.$params.common;
        let posts: TextDataModel[][] = [];

        if (_isArray(categorySlug)) {
            const requests = _map(categorySlug, (slug) => {
                return this.staticService.getPostsListByCategorySlug(slug);
            });

            posts = _filter(await Promise.all(requests), ({length}) => !!length);
        } else {
            posts = [await this.staticService.getPostsListByCategorySlug(categorySlug)];
        }

        if (exclude) {
            posts = _map(posts, (list: TextDataModel[])  => {
                return _filter(list, (listItem) =>  !_includes(exclude, listItem.slug));
            });
        }
        return posts;
    }

    /**
     * Set post menu items
     *
     * @param lists Items data from wordpress
     */
    protected setMenuItems(lists: TextDataModel[][]): void {
        this.$params.menuParams.items = [];

        if (this.$params.common.groupBySlag && lists.length > 1) {
            this.groupedMenu = _map(lists, (subList) => {
                const items: IMenuItem[] = MenuHelper.getItemsByWpPosts({
                    posts: subList,
                    defaultItemState: this.$params.common.defaultState,
                    defaultItemType: this.type,
                    hrefBasePath: this.basePath,
                    wlcElementPrefix: this.wlcElementPrefix,
                });
                this.$params.menuParams.items = _concat(this.$params.menuParams.items, items);

                const menuParams: MenuParams.IMenuCParams = _clone(this.$params.menuParams);
                menuParams.items = items;
                return menuParams;
            });
        } else {
            this.$params.menuParams.items = MenuHelper.getItemsByWpPosts({
                posts: _flatten(lists),
                defaultItemState: this.$params.common.defaultState,
                defaultItemType: this.type,
                hrefBasePath: this.basePath,
                wlcElementPrefix: this.wlcElementPrefix,
            });
        }
    }
}
