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
import {gamesEvents} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';

import {
    clone as _clone,
} from 'lodash';

@Component({
    selector: '[wlc-category-menu]',
    templateUrl: './category-menu.component.html',
    styleUrls: ['./styles/category-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryMenuComponent extends AbstractComponent implements OnInit, OnChanges {

    public $params: Params.ICategoryMenuCParams;
    public items: MenuParams.IMenuItem[];
    public menuParams: MenuParams.IMenuCParams = {
        type: 'category-menu',
        items: [],
    };

    @Input() public inlineParams: Params.ICategoryMenuCParams;

    protected categories: CategoryModel[];
    protected parentCategory: CategoryModel;
    protected usedStandartCategories: boolean = false;
    protected onInitEnded: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ICategoryMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected gamesCatalogService: GamesCatalogService,
        protected eventService: EventService,
        protected translate: TranslateService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.ICategoryMenuCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            },
        );
    }

    ngOnInit(): void {
        super.ngOnInit(this.inlineParams);;
        this.init();
        this.onInitEnded = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        if (this.onInitEnded) {
            this.init();
        }
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
        if (this.$params.type == 'dropdown') {
            this.initAsDropdown();
        } else {
            if (this.gamesCatalogService.catalogOpened()) {
                this.parentCategory = this.gamesCatalogService.getParentCategoryByState();
                this.categories = this.gamesCatalogService.getCategoriesByParentId(this.parentCategory.id);
                if (!this.categories.length) {
                    this.setStandartCategories();
                }
            } else {
                this.setStandartCategories();
            }

            const menuItems = MenuHelper.getItemsForCategories({
                categories: this.categories,
                openChildCatalog: !this.usedStandartCategories && this.gamesCatalogService.catalogOpened(),
                lang: this.translate.currentLang,
            });
            this.menuParams.items = menuItems.concat(this.menuParams.items as MenuParams.IMenuItem[]);

            if (!this.usedStandartCategories) {
                this.menuParams.items.unshift(this.getAllGamesBtn());
            }

        }
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }

    /**
     * Set standart categories
     */
    protected setStandartCategories(): void {
        this.usedStandartCategories = true;
        this.categories = this.getStandartCategories();
    }

    /**
     * Get standart categories (which is not childs categpries and not for main menu)
     *
     * @returns {CategoryModel[]}
     */
    protected getStandartCategories(): CategoryModel[] {
        const itemByMenu: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('category-menu');
        return itemByMenu ? itemByMenu : this.gamesCatalogService.getCategoriesByMenu('');
    }

    /**
     * Get btn 'All games'
     *
     * @param {boolean} withoutParams Without params settings
     * @returns {IMenuItem}
     */
    protected getAllGamesBtn(withoutParams: boolean = false): MenuParams.IMenuItem {
        const item: MenuParams.IMenuItem = {
            name: this.translate.instant(gettext('All games')),
            type: 'sref',
            icon: 'allgames',
            class: 'allgames',
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

    /**
     * Init as dropdown menu
     */
    protected initAsDropdown(): void {
        const menuItems = MenuHelper.getItemsForCategories({
            categories: this.getStandartCategories(),
            openChildCatalog: false,
            lang: this.translate.currentLang,
        });
        const itemsGroup: MenuParams.IMenuItemsGroup = {
            parent: this.getAllGamesBtn(true),
            items: menuItems,
        };
        this.menuParams.items = [itemsGroup];
    }

}
