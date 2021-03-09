import {Injectable} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core/system/services';
import {GamesCatalogService, GamesFilterService} from 'wlc-engine/modules/games';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';

import {
    ICategoryMenuItem,
    ICategoryOptions,
} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

import {
    forEach as _forEach,
} from 'lodash-es';

/**
 * @deprecated
 */
@Injectable({
    providedIn: 'root',
})
export class CategoriesService {

    protected specialCategories: string[] = [
        'lottery',
        'favourites',
        'last',
        'all',
    ];

    protected categoryOptions: ICategoryOptions;

    constructor(protected eventService: EventService,
                protected gamesCatalog: GamesCatalogService,
                protected gamesFilterService: GamesFilterService) {
    }

    /**
     *
     * @returns {ICategoryMenuItem[]}
     */
    public getCategories(): ICategoryMenuItem[] {
        const categories: CategoryModel[] = this.gamesCatalog.getCategories();
        const categoryItems: ICategoryMenuItem[] = [];
        _forEach(categories, (category: CategoryModel) => {
            const cat: ICategoryMenuItem = {...{}, ...category} as any;
            cat.filters = {
                categories: [category.slug],
            };
            categoryItems.push(cat);
        });
        return categoryItems;
    }

    // TODO Перенести куда-то в компонент
    public setConfigs() {
        const categoriesMenu: ICategoryMenuItem[] = this.getCategories();
        _forEach(categoriesMenu, (categoryMenuItem: ICategoryMenuItem) => {
            this.gamesFilterService.set(categoryMenuItem.menuId, categoryMenuItem.filters);
        });
    }


}
