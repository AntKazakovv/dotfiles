import {Injectable} from '@angular/core';
import {IIndexing} from 'wlc-engine/interfaces';
import {EventService} from 'wlc-engine/modules/core/services';
import {ICategory} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {UserService} from 'wlc-engine/modules/user/services/user.service';
import {GamesCatalogService, GamesFilterService} from 'wlc-engine/modules/games';

import {
    ICategoryMenuItem,
    ICategoryOptions,
    IGamesFilterData,
    IGamesFilterServiceEvents,
} from 'wlc-engine/modules/games/interfaces/filters.interfaces';

import {
    concat as _concat,
    forEach as _forEach,
    isArray as _isArray,
    isString as _isString,
    isObject as _isObject,
    get as _get,
    includes as _includes,
} from 'lodash';

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
        const categories: ICategory[] = this.gamesCatalog.getCategories();
        const categoryItems: ICategoryMenuItem[] = [];
        _forEach(categories, (category: ICategory) => {
            const cat: ICategoryMenuItem = {...{}, ...category};
            cat.filters = {
                categories: [category.menuId || category.Slug],
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
