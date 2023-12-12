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
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _concat from 'lodash-es/concat';
import _filter from 'lodash-es/filter';
import _merge from 'lodash-es/merge';
import _bind from 'lodash-es/bind';
import {takeUntil} from 'rxjs';

import {
    AbstractComponent,
    IMixedParams,
    IMenuOptions,
    EventService,
    ConfigService,
    InjectionService,
    DeviceType,
    ActionService,
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
import {
    addAdditionalButtonsDefault,
    addAdditionalButtonsV2,
    initAsDropdownDefault,
    initAsDropdownV2,
} from './customizable';

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

    public override $params: Params.ICategoryMenuCParams;
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
    protected isMobile: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ICategoryMenuCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected eventService: EventService,
        protected translateService: TranslateService,
        protected router: UIRouter,
        protected injectionService: InjectionService,
        protected menuService: MenuService,
        protected actionService: ActionService,
    ) {
        super(
            <IMixedParams<Params.ICategoryMenuCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            configService,
            cdr,
        );
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.gamesCatalogService = await this.injectionService
            .getService<GamesCatalogService>('games.games-catalog-service');
        _assign(this.$params.menuParams, {
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        });

        if (this.$params.common?.useSliderNavigation) {
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

    public override ngOnChanges(changes: SimpleChanges): void {
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

        this.actionService.deviceType()
            .pipe(takeUntil(this.$destroy))
            .subscribe((type: DeviceType) => {
                this.isMobile = type !== DeviceType.Desktop;
            });
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
                    .parseMenuSettings(this.menuSettings, 'category-menu', this.translateService.currentLang, {
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
                    lang: this.translateService.currentLang,
                    icons: {
                        folder: this.iconsFolder,
                        disable: !this.useIcons,
                    },
                });
            }

            this.$params.menuParams.items = _concat(menuItems, this.$params.menuParams.items as MenuParams.IMenuItem[]);
            this.addAdditionalButtons();
        }
        this.$params.menuParams = _clone(this.$params.menuParams);
        this.inited = true;

        this.cdr.markForCheck();
    }

    protected getSpecialCategories(): CategoryModel[] {
        const specialCategories = [];
        if (this.isAuth) {
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('favourites'));
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('lastplayed'));
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('recommendations'));
        }
        specialCategories.push(this.gamesCatalogService.getCategoryBySlug('new'));
        specialCategories.push(this.gamesCatalogService.getCategoryBySlug('popular'));

        return _filter(specialCategories, (item) => !!item);
    }

    /**
     * Get btn 'All games'
     *
     * @param {boolean} withoutParams Without params settings
     * @param {CategoryModel} category category
     * @returns {IMenuItem}
     */
    protected getAllGamesBtn(
        withoutParams: boolean = false,
        category: CategoryModel = this.parentCategory,
    ): MenuParams.IMenuItem {
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
                        category: category ? category.slug : '',
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

    protected addAdditionalButtons(): void {
        if (this.$params.customizableFn?.addAdditionalButtons) {
            _bind(this.$params.customizableFn.addAdditionalButtons, this)();
        } else if (this.gamesCatalogService.architectureVersion === 3) {
            _bind(addAdditionalButtonsV2, this)();
        } else {
            _bind(addAdditionalButtonsDefault, this)();
        }
    }

    /**
     * Init as dropdown menu
     */
    protected initAsDropdown(): void {
        if (this.$params.customizableFn?.initAsDropdown) {
            _bind(this.$params.customizableFn.initAsDropdown, this)();
        } else if (this.gamesCatalogService.architectureVersion === 3) {
            _bind(initAsDropdownV2, this)();
        } else {
            _bind(initAsDropdownDefault, this)();
        }
    }

    protected iconPath(iconName: string): string {
        if (this.useIcons) {
            const folder = _trim(this.iconsFolder, '/');
            return folder ? `${folder}/${iconName}` : iconName;
        }
        return '';
    }
}
