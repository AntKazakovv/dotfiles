import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    OnInit
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
export class CategoryMenuComponent extends AbstractComponent implements OnInit {

    public items: MenuParams.IMenuItem[];
    public menuParams: MenuParams.IMenuCParams = {
        type: 'category-menu',
        items: [],
    };

    protected categories: CategoryModel[];
    protected parentCategory: CategoryModel;
    protected usedStandartCategories: boolean = false;

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
        super.ngOnInit();

        if (this.gamesCatalogService.getGameList()) {
            this.initMenu();
        } else {
            this.eventService.subscribe({
                name: gamesEvents.FETCH_GAME_CATALOG_SUCCEEDED,
            }, () => {
                this.initMenu();
            });
        }
    }

    protected initMenu(): void {
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

        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }

    protected setStandartCategories(): void {
        this.usedStandartCategories = true;
        const itemByMenu: CategoryModel[] = this.gamesCatalogService.getCategoriesByMenu('category-menu');
        this.categories = itemByMenu ? itemByMenu : this.gamesCatalogService.getCategoriesByMenu('');
    }

    protected getAllGamesBtn(): MenuParams.IMenuItem {
        if (this.parentCategory) {
            return {
                name: this.translate.instant(gettext('All games')),
                type: 'sref',
                icon: 'allgames',
                class: 'allgames',
                params: {
                    state: {
                        name: 'app.catalog',
                        params: {
                            category: this.parentCategory.slug,
                        },
                    },
                }
            };
        }
    }

}
