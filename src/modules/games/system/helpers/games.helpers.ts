import {
    IIndexing,
    ICategorySettings,
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
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

import _get from 'lodash-es/get';
import _isArray from 'lodash-es/isArray';
import _toNumber from 'lodash-es/toNumber';
import _each from 'lodash-es/each';
import _set from 'lodash-es/set';
import _orderBy from 'lodash-es/orderBy';

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
     * @param {CategoryModel[]} availableCategories
     * @param {IMerchant[]} availableMerchants
     */
    public static fillGamesByCategoriesMerchants(
        game: Game,
        availableCategories: CategoryModel[]): void {
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
                availableCategories.push(category);
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
        return _orderBy(games, (game: Game) => game.sort || 0, 'desc');
    }

}
