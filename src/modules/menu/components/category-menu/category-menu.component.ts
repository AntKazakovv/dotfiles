import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {TranslateService} from '@ngx-translate/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {GamesCatalogService} from 'wlc-engine/modules/games/system/services';
import {EventService} from 'wlc-engine/modules/core/system/services';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import * as Params from 'wlc-engine/modules/menu/components/category-menu/category-menu.params';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {ConfigService} from 'wlc-engine/modules/core';

import _clone from 'lodash-es/clone';
import _assign from 'lodash-es/assign';
import _forEach from 'lodash-es/forEach';
import _has from 'lodash-es/has';
import _trim from 'lodash-es/trim';
import _concat from 'lodash-es/concat';
import _find from 'lodash-es/find';

@Component({
    selector: '[wlc-category-menu]',
    templateUrl: './category-menu.component.html',
    styleUrls: ['./styles/category-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryMenuComponent extends AbstractComponent implements OnInit, OnChanges {

    public $params: Params.ICategoryMenuCParams;
    public items: MenuParams.IMenuItem[];
    @Input() public inlineParams: Params.ICategoryMenuCParams;

    protected categories: CategoryModel[];
    protected parentCategory: CategoryModel;
    protected usedStandartCategories: boolean = false;
    protected onInitEnded: boolean = false;
    protected isAuth: boolean;
    protected iconsFolder: string;
    protected useIcons: boolean;
    protected useLobbyBtn: boolean;
    protected fallBackIcon: string = 'plug.svg';

    constructor(
        @Inject('injectParams') protected params: Params.ICategoryMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected gamesCatalogService: GamesCatalogService,
        protected configService: ConfigService,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.ICategoryMenuCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        _assign(this.$params.menuParams, {
            theme: this.$params.theme,
            themeMod: this.$params.themeMod,
        });

        this.useLobbyBtn = this.configService.get<boolean>('$menu.categoryMenu.lobbyBtn.use');
        this.useIcons = _has(this.$params, 'common.icons.use')
            ? this.$params.common.icons.use
            : this.configService.get<boolean>('$menu.categoryMenu.icons.use');

        this.iconsFolder = this.$params.common?.icons?.folder || this.configService.get<string>('$menu.categoryMenu.icons.folder');
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
            this.router.transitionService.onSuccess({}, (transition) => {
                this.$params.menuParams.items = [];
                this.$params.menuParams.common.swiper.scrollToStart = true;

                const currentParent = this.gamesCatalogService.getParentCategoryByState();
                if (this.parentCategory && currentParent) {
                    if (this.parentCategory.slug === currentParent.slug) {
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
        });

        this.eventService.subscribe({
            name: 'LOGIN',
        }, () => {
            this.isAuth = true;
            this.$params.menuParams.items = [];
            this.initMenu();
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
                this.categories = this.gamesCatalogService.getCategoriesByState();
            } else {
                const parentCategory = this.gamesCatalogService.getCategoryBySlug(['casino', 'livecasino', 'tablegames']);
                const specialCategories = this.getSpecialCategories();

                if (parentCategory) {
                    const categories: CategoryModel[] = _concat(specialCategories, parentCategory.childCategories) as CategoryModel[];
                    this.categories = this.gamesCatalogService.sortCategories(categories);
                }
            }
            const menuItems = MenuHelper.getItemsForCategories({
                categories: this.categories,
                openChildCatalog: true,
                lang: this.translate.currentLang,
                icons: {
                    folder: this.iconsFolder,
                    disable: !this.useIcons,
                },
            });
            this.$params.menuParams.items = menuItems.concat(this.$params.menuParams.items as MenuParams.IMenuItem[]);
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
        this.$params.menuParams = _clone(this.$params.menuParams);
        this.cdr.detectChanges();
    }

    protected getSpecialCategories(): CategoryModel[] {
        const specialCategories = [];
        if (this.isAuth) {
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('favourites'));
            specialCategories.push(this.gamesCatalogService.getCategoryBySlug('lastplayed'));
        }
        const newCategory = this.gamesCatalogService.getCategoryBySlug('new');
        const popularCategory = this.gamesCatalogService.getCategoryBySlug('popular');
        if (newCategory) {
            specialCategories.push(newCategory);
        }
        if (popularCategory) {
            specialCategories.push(popularCategory);
        }
        this.gamesCatalogService.sortCategories(specialCategories);
        return specialCategories;
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
                        reload: true,
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
