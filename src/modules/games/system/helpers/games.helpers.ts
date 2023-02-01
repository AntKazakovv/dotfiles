import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _toNumber from 'lodash-es/toNumber';
import _each from 'lodash-es/each';
import _set from 'lodash-es/set';
import _orderBy from 'lodash-es/orderBy';
import _isNil from 'lodash-es/isNil';
import {
    inPlaceSort,
    ISortBy,
    ISortByFunction,
    ISortByObjectSorter,
} from 'fast-sort';

import {
    IIndexing,
    ICategorySettings,
    TSortDirection,
} from 'wlc-engine/modules/core';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {
    IByCategory,
    IMapping,
    ICategory,
    ICountriesRestriction,
    ICountriesRestrictions,
    IIndexingMerchants,
    IMerchant,
    IRestrictions,
    IByMerchantItemCategory,
    IGamesSortSetting,
    TGameSortFeature,
    IGamesSeparateSortSetting,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    IAllSortsItemResponse,
} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';
import {
    GamesSortOrder,
    GamesInCategorySortOrder,
    sortGetters,
} from 'wlc-engine/modules/games/system/interfaces/sorts.constants';

/**
 * Games sort options
 *
 * @param sortSetting Sort settings
 * @param country User country
 * @param language Used language
 * @param category Used games category.
 */
export interface ISortGamesOptions {
    sortSetting: IGamesSortSetting;
    country: string;
    language: string;
    categoryId?: number;
}

export interface ISeparateSortGamesOptions {
    sortSetting: IGamesSeparateSortSetting;
    country: string;
    language: string;
    categoryId?: number;
}

const directions: Record<TSortDirection, number> = {
    asc: -1,
    desc: 1,
};

type TSortRule = [feature: TGameSortFeature, suffix: string | number, direction: TSortDirection];

export class GamesHelper {

    public static availableMerchants: MerchantModel[] = [];

    public static mapping: IMapping = {};

    public static reset(): void {
        GamesHelper.mapping = {};
        GamesHelper.availableMerchants = [];
    }

    /***************************************************************************************************************
     * MAPPING
     **************************************************************************************************************/

    /**
     *
     * @param {IIndexingMerchants} merchants
     * @param {IIndexing<string>} merchantMap
     * @returns {{merchantsArray: MerchantModel[]}}
     */
    public static mapMerchants(
        merchants: IIndexingMerchants, merchantMap: IIndexing<string>,
    ): {merchantsArray: MerchantModel[]} {
        if (!merchants) {
            return;
        }
        const merchantsArray: MerchantModel[] = [];
        _each(merchants, (merchantItem: IMerchant, merchantId: string) => {
            if (merchantMap[merchantItem.menuId]) {
                merchantItem.Alias = merchantMap[merchantItem.menuId];
            }

            const merchant: MerchantModel = new MerchantModel(
                {helper: 'GamesHelper', method: 'mapMerchants'},
                merchantItem,
            );
            _set(this.mapping, `merchantIdToNameMapping.${merchant.id}`, merchant.menuId);
            _set(this.mapping, `merchantIdToAliasMapping.${merchant.id}`, merchant.alias || merchant.name);
            _set(this.mapping, `merchantNameToObjectMapping.${merchant.menuId}`, merchant);
            _set(this.mapping, `merchantNameToIdMapping.${merchant.menuId}`, _toNumber(merchantId));
            _set(this.mapping, `merchantNameToTitleMapping.${merchant.menuId}`, merchant.name);
            merchantsArray.push(merchant);
        });
        return {merchantsArray};
    }

    /**
     *
     * @param categories
     * @returns {{mapping: IMapping, categoriesArray: CategoryModel[]}}
     */
    public static mapCategories(
        categories: ICategory[],
        settings: IIndexing<ICategorySettings>,
        sortSetting: IGamesSortSetting,
        sorts: IIndexing<IAllSortsItemResponse>,
        separateSortSettings: IGamesSeparateSortSetting,
        useSeparateSorts: boolean,
        defaultSpecialCategories: string[],
        defaultParentCategories: string[],
    ): CategoryModel[] {
        if (!categories) {
            return;
        }

        const categoriesArray: CategoryModel[] = [];
        _each(categories, (item: ICategory) => {
            const categorySettings: ICategorySettings = _get(settings, item.Slug);
            const category = new CategoryModel(
                {helper: 'GamesHelper', method: 'mapCategories'},
                item,
                categorySettings,
                sortSetting,
                sorts,
                separateSortSettings,
                useSeparateSorts,
                defaultSpecialCategories,
                defaultParentCategories,
            );

            if (_get(this.mapping, `categoryByName.${category.slug}`)) {
                return;
            }

            categoriesArray.push(category);

            _set(this.mapping, `categoryById.${category.id}`, category);
            _set(this.mapping, `categoryByName.${category.slug}`, category);
            _set(this.mapping, `categoryNameToIdMapping.${category.slug}`, category.id);
            _set(this.mapping, `categoryNameToTitleMapping.${category.slug}`, category.title);
            _set(this.mapping, `categoryIdToNameMapping.${category.id}`, category.slug);
            _set(this.mapping, `categoryIdToTitleMapping.${category.id}`, category.title);
        });
        return categoriesArray;
    }

    /**
     *
     * @param {Game} game
     */
    public static fillGamesByCategoriesMerchants(game: Game): void {
        const merchantName: string = game.getMerchantName();
        const merchants: string[] = [merchantName];

        if (_toNumber(game.subMerchantID)) {
            const subMerchantName = this.getMerchantNameById(game.subMerchantID);
            if (subMerchantName && merchantName !== subMerchantName) {
                merchants.push(subMerchantName);
            }
        }

        _each(merchants, (merchantName: string) => {
            if (!_get(this.mapping, `byMerchant.${merchantName}`)) {
                _set(this.mapping, `byMerchant.${merchantName}`, {
                    games: [],
                    categories: {},
                });
                GamesHelper.availableMerchants.push(GamesHelper.getMerchantByName(merchantName));
            }
            this.mapping.byMerchant[merchantName].games.push(game);
        });

        _each(game.categoryID, (categoryId: number) => {
            const category: CategoryModel = GamesHelper.getCategoryById(categoryId);
            const categoryName: string = GamesHelper.getCategoryNameById(categoryId);
            const categoryTitle = GamesHelper.getCategoryTitleById(categoryId);

            if (!_get(this.mapping, `byCategory.${categoryName}`)) {
                _set(this.mapping, `byCategory.${categoryName}`, {
                    title: categoryTitle,
                    games: [],
                    merchants: {},
                });
            }

            if (category) {
                this.mapping.byCategory[categoryName].games.push(game);
                this.mapping.byCategory[categoryName].merchants[merchantName] = true;
                this.mapping.byMerchant[merchantName].categories[category.id] = {
                    menuId: category.menuId,
                    slug: category.slug,
                    id: category.id,
                    sort: category.sort,
                };
            }
        });
    }

    /**
     *
     * @param {string} merchantName
     * @returns {string}
     */
    public static getMerchantIdByName(merchantName: string): string {
        return _get(this.mapping, `merchantNameToIdMapping[${merchantName}]`, '');
    }

    /**
     *
     * @param {string} merchantId
     * @returns {string}
     */
    public static getMerchantNameById(merchantId: number): string {
        return _get(this.mapping, `merchantIdToNameMapping[${merchantId}]`, '');
    }

    /**
     * Get merchant by name
     *
     * @param {string} merchantName
     * @returns {MerchantModel}
     */
    public static getMerchantByName(merchantName: string): MerchantModel {
        return _get(this.mapping, `merchantNameToObjectMapping[${merchantName}]`, '');
    }

    /**
     *
     * @param {string} merchantId
     * @returns {string}
     */
    public static getMerchantAliasById(merchantId: number): string {
        return _get(this.mapping, `merchantIdToAliasMapping[${merchantId}]`, '');
    }

    /**
     *
     * @returns {{[p: string]: IIndexing<string>}}
     */
    public static getGameCategoryList(): {[key: string]: IIndexing<string>;} {
        return _get(this.mapping, 'categoryNameToTitleMapping', {});
    }

    /**
     *
     * @param {string} categoryName
     */
    public static getCategoryIdByName(categoryName: string): number {
        return _get(this.mapping, `categoryNameToIdMapping[${categoryName}]`);
    }

    /**
     *
     * @param {string} categoryId
     * @returns {string}
     */
    public static getCategoryNameById(categoryId: number): string {
        return _get(this.mapping, `categoryIdToNameMapping[${categoryId}]`);
    }

    /**
     *
     * @param {string} categoryId
     * @returns {IIndexing<string>}
     */
    public static getCategoryTitleById(categoryId: number): IIndexing<string> {
        return _get(this.mapping, `categoryIdToTitleMapping[${categoryId}]`, {});
    }

    /**
     *
     * @param {string} categoryId
     * @returns {CategoryModel}
     */
    public static getCategoryById(categoryId: number): CategoryModel {
        return _get(this.mapping, `categoryById[${categoryId}]`);
    }

    /**
     *
     * @param {string} categoryId
     * @returns {CategoryModel}
     */
    public static getCategoryByMenuId(categoryId: number): CategoryModel {
        return _get(this.mapping, `categoryById[${categoryId}]`);
    }

    /**
     *
     * @param {string} categoryName
     * @returns {IByCategory}
     */
    public static getMerchantsByCategory(categoryName: string): IByCategory {
        return _get(this.mapping, `byCategory[${categoryName}].merchants`, {});
    }

    /**
     *
     * @param {string} merchantName
     * @returns {IIndexing<IByMerchantItemCategory>}
     */
    public static getCategoriesByMerchant(merchantName: string): IIndexing<IByMerchantItemCategory> {
        return _get(this.mapping, `byMerchant[${merchantName}].categories`, {});
    }

    /***************************************************************************************************************
     * RESTRICTIONS
     **************************************************************************************************************/

    /**
     *
     * @param {ICountriesRestrictions} countriesRestrictions
     * @returns {IRestrictions}
     */
    public static createRestrictions(countriesRestrictions: ICountriesRestrictions): IRestrictions {
        if (!countriesRestrictions) {
            return;
        }
        const restrictions: IRestrictions = {
            restrictedByID: {},
            restrictedByDefault: {},
        };
        _each(countriesRestrictions, (restriction: ICountriesRestriction) => {
            if (_isArray(restriction.Countries)) {
                _each(restriction.Countries, (country: string) => {
                    if (restriction.IsDefault === '1') {
                        if (!restrictions.restrictedByDefault[restriction.IDMerchant]) {
                            restrictions.restrictedByDefault[restriction.IDMerchant] = {};
                        }
                        restrictions.restrictedByDefault[restriction.IDMerchant][country] = true;
                    } else {
                        if (!restrictions.restrictedByID[restriction.ID]) {
                            restrictions.restrictedByID[restriction.ID] = {};
                        }
                        restrictions.restrictedByID[restriction.ID][country] = true;
                    }
                });
            }
        });
        return restrictions;
    }

    /**
     * Sort games by default using global sort
     *
     * @param {Game[]} games Games list for sort
     * @returns {Game[]} Sorted games
     */
    public static sortGamesByDefault(games: Game[]): Game[] {
        return _orderBy(games, (game: Game) => game.sort ?? 0, 'desc');
    }

    /**
     * Sort games
     *
     * @param {ISortGamesOptions} options Sort options
     */
    public static sortGames(games: Game[], options: ISortGamesOptions): void {
        const {direction} = options.sortSetting;

        games.sort((a: Game, b: Game): number => {

            let sortValue: number | null = null;

            const rules: TSortRule[] = [
                ['sortPerCountry', options.country, direction?.sortPerCountry ?? 'asc'],
                ['sortPerLanguage', options.language, direction?.sortPerLanguage ?? 'asc'],
                ['sortPerCategory', options.categoryId, direction?.sortPerCategory ?? 'asc'],
            ];


            _each(rules, ([feature, suffix, direction]) => {

                if (feature === 'sortPerCategory' && !options.categoryId) {
                    return;
                }

                sortValue = GamesHelper.compareGamesByFeature(
                    a,
                    b,
                    feature,
                    suffix,
                    direction,
                );

                if (!_isNil(sortValue)) {
                    return false;
                }
            });

            return sortValue || directions[direction?.baseSort ?? 'desc'] * ((b.sort || 0) - (a.sort || 0));
        });
    }

    /**
     * Sorting method that compares two games by a specific feature.
     *
     * @param {Game} a - game a
     * @param {Game} b - game b
     * @param {TGameSortFeature} feature - sorting feature
     * @param {string | number} suffix - specified field in feature
     * @param {TSortDirection} direction - sort direction
     * @returns {number | null} - sorting results
     */
    protected static compareGamesByFeature(
        a: Game,
        b: Game,
        feature: TGameSortFeature,
        suffix: string | number,
        direction: TSortDirection,
    ): number | null {
        const perA = _isNil(a[feature]?.[suffix] || null);
        const perB = _isNil(b[feature]?.[suffix] || null);
        if (perA && !perB) {
            return 1;
        } else if (!perA && perB) {
            return -1;
        } else if (!perA && !perB && b[feature][suffix] !== a[feature][suffix]) {
            return directions[direction] * (b[feature][suffix] - a[feature][suffix]);
        }
        return null;
    };

    /**
     * Sorts category games
     *
     * @public
     * @static
     * @param {Pick<Game, 'ID'>[]} games - games for sorting
     * @param {IIndexing<Partial<IAllSortsItemResponse>>} sorts - games sorts
     * @param {ISeparateSortGamesOptions} options - games sort options
     */
    public static sortGamesGeneral(
        games: Pick<Game, 'ID'>[],
        sorts: IIndexing<Partial<IAllSortsItemResponse>>,
        options: ISeparateSortGamesOptions,
    ): void {
        const direction = options.sortSetting.direction;

        const {country, language} = options;

        const sorters = GamesSortOrder.map(rank => {
            const sortBy: ISortBy<Pick<Game, 'ID'>> = game => {
                return sortGetters[rank](sorts[game.ID], rank, country, language);
            };

            return this.getSorter(direction[rank] ?? 'desc', sortBy);
        });

        inPlaceSort(games).by(sorters);
    }

    /**
     * Sorts category games
     *
     * @public
     * @static
     * @param {Pick<Game, 'ID'>[]} games - games for sorting
     * @param {IIndexing<Partial<IAllSortsItemResponse>>} sorts - games sorts
     * @param {ISeparateSortGamesOptions} options - games sort options
     */
    public static sortGamesInCategory(
        games: Pick<Game, 'ID'>[],
        sorts: IIndexing<Partial<IAllSortsItemResponse>>,
        options: ISeparateSortGamesOptions,
    ): void {
        const direction = options.sortSetting.direction;

        const {country, language, categoryId} = options;

        const sorters = GamesInCategorySortOrder.map(rank => {
            const sortBy: ISortBy<Pick<Game, 'ID'>> = game => {
                return sortGetters[rank](sorts[game.ID], rank, country, language, categoryId);
            };

            return this.getSorter(direction[rank] ?? 'desc', sortBy);
        });

        inPlaceSort(games).by(sorters);
    }

    /**
     * Default sorting compare function.
     *
     * @public
     * @static
     * @param {(number | string | undefined)} a index
     * @param {(number | string | undefined)} b index
     * @returns {number} position
     */
    public static defaultComparerFn(a: number | string | undefined, b: number | string | undefined) {
        const aNilOrZero = _isNil(a) || a == 0;
        const bNilOrZero = _isNil(b) || b == 0;
        if (aNilOrZero && !bNilOrZero) {
            return -1;
        } else if (!aNilOrZero && bNilOrZero) {
            return 1;
        } else if (!aNilOrZero && !bNilOrZero && b !== a) {
            return Number(a) - Number(b);
        }
        return 0;
    }

    private static getSorter(direction: TSortDirection, sortBy: ISortByFunction<Pick<Game, 'ID'>>) {
        const sorter = {
            comparer: GamesHelper.defaultComparerFn,
        } as unknown as ISortByObjectSorter<Pick<Game, 'ID'>>;
        sorter[direction] = sortBy;
        return sorter;
    }
}
