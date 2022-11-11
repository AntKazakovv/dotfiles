import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import _set from 'lodash-es/set';
import _clone from 'lodash-es/clone';
import _assign from 'lodash-es/assign';
import _forEach from 'lodash-es/forEach';
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _concat from 'lodash-es/concat';
import _find from 'lodash-es/find';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';

import {
    AbstractComponent,
    IMixedParams,
    IMenuOptions,
    EventService,
    ConfigService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    CategoryModel,
} from 'wlc-engine/modules/games';
import {
    GamesCatalogService,
} from 'wlc-engine/modules/games/system/services/games-catalog/games-catalog.service';
import {
    MenuHelper,
    MenuParams,
    TIconExtension,
    MenuService,
} from 'wlc-engine/modules/menu';

import * as Config from 'wlc-engine/modules/menu/system/config/category-menu.config';
import * as Params from './category-menu.params';

@Component({
    selector: '[wlc-category-menu]',
    templateUrl: './category-menu.component.html',
    styleUrls: ['./styles/category-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryMenuComponent extends AbstractComponent implements OnInit, OnChanges {

    @Input() public inlineParams: Params.ICategoryMenuCParams;

    public $params: Params.ICategoryMenuCParams;
    public items: MenuParams.IMenuItem[];
    public inited: boolean = false;

    protected categories: CategoryModel[];
    protected parentCategory: CategoryModel;
    protected usedStandartCategories: boolean = false;
    protected onInitEnded: boolean = false;
    protected isAuth: boolean;
    protected iconsFolder: string;
    protected useIcons: boolean;
    protected useLobbyBtn: boolean;
    protected fallBackIcon: string = 'plug';
    protected menuSettings: IMenuOptions;
    protected gamesCatalogService: GamesCatalogService;

    constructor(
        @Inject('injectParams') protected params: Params.ICategoryMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected router: UIRouter,
        protected injectionService: InjectionService,
        protected menuService: MenuService,
    ) {
        super(
            <IMixedParams<Params.ICategoryMenuCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        _assign(this.$params.menuParams, {
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        });

        this.initMenuParams();

        this.menuSettings = await this.menuService.getFundistMenuSettings('categoryMenu');

        this.useLobbyBtn = this.configService.get<boolean>('$menu.categoryMenu.lobbyBtn.use');
        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.categoryMenu.icons.use');

        const extension: TIconExtension = _has(this.$params, 'common.icons.extension')
            ? this.$params.common.icons.extension
            : this.configService.get<TIconExtension>('$menu.categoryMenu.icons.extension');

        if (extension) {
            _set(this.$params, 'menuParams.common.icons.extension', extension);
        }

        this.iconsFolder = this.menuSettings?.iconsPack ||
            this.$params.common?.icons?.folder ||
            this.configService.get<string>('$menu.categoryMenu.icons.folder');
        this.$params.menuParams.common.icons.fallback = this.iconPath(this.fallBackIcon);

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.init();
        this.initEventHandlers();
        this.onInitEnded = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (this.onInitEnded) {
            this.init();
        }
    }

    /**
     * Init event handlers
     */
    protected initEventHandlers(): void {
        if (this.$params.type !== 'dropdown') {
            this.router.transitionService.onSuccess({}, () => {
                this.$params.menuParams.items = [];
                this.$params.menuParams.common.swiper.scrollToStart = true;

                if (this.menuSettings) {
                    this.$params.menuParams.common.swiper.scrollToStart = false;
                } else {
                    const currentParent = this.gamesCatalogService.getParentCategoryByState();
                    if (this.parentCategory && currentParent && this.parentCategory.slug === currentParent.slug) {
                        this.$params.menuParams.common.swiper.scrollToStart = false;
                    }
                }
                this.initMenu();
            });
        }

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.isAuth = false;
            this.$params.menuParams.items = [];
            this.initMenu();
        }, this.$destroy);

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.$params.menuParams.items = [];
            this.initMenu();
        }, this.$destroy);
    }

    /**
     * Init component
     *
     * @returns {Promise<void>}
     */
    protected async init(): Promise<void> {
        await this.gamesCatalogService.ready;
        this.initMenu();
    }

    /**
     * Init menu
     */
    protected initMenu(): void {
        this.usedStandartCategories = false;
        this.categories = [];
        this.parentCategory = this.gamesCatalogService.getParentCategoryByState();

        if (this.$params.type === 'dropdown') {
            this.initAsDropdown();
            this.$params.menuParams.common.useSwiper = false;
        } else {

            if (this.gamesCatalogService.catalogOpened()) {
                this.categories = this.gamesCatalogService.getCategoriesByState(this.isAuth);
            } else {
                const parentCategory = this.gamesCatalogService
                    .getCategoryBySlug(['casino', 'livecasino', 'tablegames']);
                const specialCategories = this.getSpecialCategories();

                if (parentCategory) {
                    const categories: CategoryModel[] = _concat(
                        specialCategories, parentCategory.childCategories,
                    ) as CategoryModel[];
                    this.categories = this.gamesCatalogService.sortCategories(categories);
                }
            }

            let menuItems;
            if (this.menuSettings) {
                const itemsConfig = MenuHelper
                    .parseMenuSettings(this.menuSettings, 'category-menu', this.translate.currentLang, {
                        isAuth: this.isAuth,
                        wlcElementPrefix: 'link_game-categories-',
                    });

                menuItems = MenuHelper.parseMenuConfig(itemsConfig, Config.wlcCategoryMenuItemsGlobal, {
                    icons: {
                        folder: this.iconsFolder,
                        disable: !this.useIcons,
                    },
                });
            } else {
                menuItems = MenuHelper.getItemsForCategories({
                    categories: this.categories,
                    openChildCatalog: true,
                    lang: this.translate.currentLang,
                    icons: {
                        folder: this.iconsFolder,
                        disable: !this.useIcons,
                    },
                });
            }

            this.$params.menuParams.items = _concat(menuItems, this.$params.menuParams.items as MenuParams.IMenuItem[]);
            if (!this.menuSettings) {
                if (this.gamesCatalogService.catalogOpened()) {
                    const parentInMenu: boolean = !!_find(this.categories, (category) => {
                        return this.parentCategory.slug === category.slug;
                    });
                    if (!parentInMenu) {
                        this.$params.menuParams.items.unshift(this.getAllGamesBtn());
                    }
                }
                if (this.useLobbyBtn) {
                    this.$params.menuParams.items.unshift(this.getLobbyBtn());
                }
            }
        }
        this.$params.menuParams = _clone(this.$params.menuParams);
        this.inited = true;
        this.cdr.detectChanges();
    }

    protected initMenuParams(): void {
        if (this.$params.common?.useSwiperNavigation) {
            _merge(this.$params.menuParams, {
                sliderParams: {
                    swiper: {
                        navigation: {
                            nextEl: '.wlc-category-menu__control--next',
                            prevEl: '.wlc-category-menu__control--prev',
                        },
                    },
                },
            });
        }
    }

    protected getSpecialCategories(): CategoryModel[] {
        const specialCategories = [];
        if (this.isAuth) {
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('favourites'));
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('lastplayed'));
        }
        specialCategories.push(this.gamesCatalogService.getCategoryBySlug('new'));
        specialCategories.push(this.gamesCatalogService.getCategoryBySlug('popular'));

        return _filter(specialCategories, (item) => !!item);
    }

    /**
     * Get btn 'All games'
     *
     * @param {boolean} withoutParams Without params settings
     * @returns {IMenuItem}
     */
    protected getAllGamesBtn(withoutParams: boolean = false): MenuParams.IMenuItem {
        const item: MenuParams.IMenuItem = {
            name: gettext('All games'),
            type: 'sref',
            icon: this.iconPath('allgames'),
            class: 'allgames',
            wlcElement: 'link_game-categories-allgames',
            params: {
                state: {
                    name: 'app.catalog',
                    activeEq: true,
                    params: {
                        category: this.parentCategory ? this.parentCategory.slug : '',
                    },
                    options: {
                        reload: false,
                    },
                },
            },
        };
        if (withoutParams) {
            delete item.params;
        }
        return item;
    }

    protected getLobbyBtn(): MenuParams.IMenuItem {
        return {
            name: gettext('Lobby'),
            type: 'sref',
            icon: this.iconPath('lobby'),
            class: 'lobby',
            wlcElement: 'link_game-categories-lobby',
            params: {
                state: {
                    name: 'app.home',
                },
            },
        };
    }

    /**
     * Init as dropdown menu
     */
    protected initAsDropdown(): void {
        const parentCategories = this.gamesCatalogService.getParentCategories();
        let dropdownMenu = [];

        const specialCategories = this.getSpecialCategories();
        if (specialCategories.length) {
            dropdownMenu = MenuHelper.getItemsForCategories({
                categories: specialCategories,
                lang: this.translate.currentLang,
                icons: {
                    folder: this.iconsFolder,
                    disable: true,
                },
            });
        }

        _forEach(parentCategories, (category) => {
            const menuItems = MenuHelper.getItemsForCategories({
                categories: [category],
                lang: this.translate.currentLang,
                icons: {
                    folder: this.iconsFolder,
                    disable: true,
                },
            });
            if (category.childCategories.length) {
                const childItems = MenuHelper.getItemsForCategories({
                    categories: category.childCategories,
                    lang: this.translate.currentLang,
                    icons: {
                        folder: this.iconsFolder,
                        disable: !this.useIcons,
                        fallback: this.fallBackIcon,
                    },
                });
                dropdownMenu.push({
                    parent: menuItems[0],
                    items: childItems,
                    type: 'group',
                });
            } else if (menuItems[0]) {
                dropdownMenu.push(menuItems[0]);
            }
        });

        this.$params.menuParams.items = dropdownMenu;
    }

    protected iconPath(iconName: string): string {
        if (this.useIcons) {
            const folder = _trim(this.iconsFolder, '/');
            return folder ? `${folder}/${iconName}` : iconName;
        }
        return '';
    }
}
