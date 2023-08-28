import {
    TranslateService,
} from '@ngx-translate/core';

import {
    ConfigService,
    ICategorySettings,
    IIndexing,
} from 'wlc-engine/modules/core';
import {Categories} from 'wlc-engine/modules/games/system/classes/categories';
import {
    IExcludeCategories,
    IHideCategories,
    ISortCategories,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {IGamesFilterData} from 'wlc-engine/modules/games/system/interfaces/filters.interfaces';

export interface IPrepareCategoriesListOptions {
    allCategories: CategoryModel[];
    availableGames: Game[];
    getCategoryBySlug: (slug: string | string[], byDefaultCategories?: boolean) => CategoryModel;
    categorySettings?: IIndexing<ICategorySettings>;
}

export interface ISetGamesForCategoriesOptions {
    categories: CategoryModel[];
    filterGames: (includeCategories: CategoryModel[], gameList?: Game[]) => Game[];
    getGameList: (filter?: IGamesFilterData) => Game[];
    categorySettings?: IIndexing<ICategorySettings>;
}

export interface ICategoriesSettings {
    architectureVersion?: 1 | 2 | 3;
    exclude?: IExcludeCategories;
    hide?: IHideCategories;
    parentCategories?: string[];
    transformSlugs?: IIndexing<string>;
    sortValues?: ISortCategories;
    sortFn?: (categories: CategoryModel[]) => CategoryModel[];
    prepareCategoriesList?: (options: IPrepareCategoriesListOptions) => CategoryModel[];
    setGamesForCategories?: (options: ISetGamesForCategoriesOptions) => void;
}

/**
 * This builder is used to set up categories in the project.
 * Most parameters are taken from current $games config settings
 *
 * @example
 *
 * export const $games: IGamesConfig = {
 *      catalogBuilder: catalogArch1
 *          .categories(
 *                  new CategoriesBuilder()
 *              .hide({
 *                  bySlug: ['megawaysglobal', 'jackpots'],
 *              })
 *              .transformSlugs({
 *                  top: 'top-games',
 *                  new: 'new-games',
 *              })
 *          ),
 *  };
 */
export class CategoriesBuilder {

    public settings: ICategoriesSettings = {};

    public parentCategories(parentCategories: ICategoriesSettings['parentCategories']): this {
        this.settings.parentCategories = parentCategories;
        return this;
    }

    public exclude(exclude: ICategoriesSettings['exclude']): this {
        this.settings.exclude = exclude;
        return this;
    }

    public hide(hide: ICategoriesSettings['hide']): this {
        this.settings.hide = hide;
        return this;
    }

    public transformSlugs(slugs: ICategoriesSettings['transformSlugs']): this {
        this.settings.transformSlugs = slugs;
        return this;
    }

    public sortValues(sortByCategory: ICategoriesSettings['sortValues']): this {
        this.settings.sortValues = sortByCategory;
        return this;
    }

    public prepareCategoriesList(prepareCategoriesList: ICategoriesSettings['prepareCategoriesList']): this {
        this.settings.prepareCategoriesList = prepareCategoriesList;
        return this;
    }

    public setGamesForCategories(setGamesForCategories: ICategoriesSettings['setGamesForCategories']): this {
        this.settings.setGamesForCategories = setGamesForCategories;
        return this;
    }

    public sortFn(sortFn: ICategoriesSettings['sortFn']): this {
        this.settings.sortFn = sortFn;
        return this;
    }

    public setArchitectureVersion(version: ICategoriesSettings['architectureVersion']): this {
        this.settings.architectureVersion = version;
        return this;
    }

    public build(
        configService: ConfigService,
        translateService: TranslateService,
    ): Categories {
        return new Categories(
            this.settings,
            configService,
            translateService,
        );
    }
}
