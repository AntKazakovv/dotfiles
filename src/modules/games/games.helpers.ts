import {IIndexing} from 'wlc-engine/interfaces';
import {Game} from 'wlc-engine/modules/games/models/game.model';

import {
    IAvailableCategories,
    IByCategory,
    IByMerchant,
    IMapping,
    ICategory,
    ICountriesRestriction,
    ICountriesRestrictions,
    IIndexingCategories,
    IIndexingMerchants,
    IMerchant,
    IRestrictions, IAvailableMerchants,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

import {
    each as _each,
    assign as _assign,
    isArray as _isArray,
    toNumber as _toNumber,
    get as _get,
} from 'lodash';

export class GamesHelper {
    /**
     * Initial value
     */
    public static mapping: IMapping = {
        merchantIdToNameMapping: {},
        merchantIdToAliasMapping: {},
        merchantNameToIdMapping: {},
        merchantNameToTitleMapping: {},
        byMerchant: {},
        categoryById: {},
        categoryNameToIdMapping: {},
        categoryNameToTitleMapping: {},
        categoryIdToNameMapping: {},
        categoryIdToTitleMapping: {},
        byCategory: {},
    };

    /***************************************************************************************************************
     * MAPPING
     **************************************************************************************************************/

    /**
     *
     * @param {IIndexingMerchants} merchants
     * @param {IIndexing<string>} merchantMap
     * @returns {{merchantsArray: IMerchant[]}}
     */
    public static mapMerchants(merchants: IIndexingMerchants, merchantMap: IIndexing<string>): { merchantsArray: IMerchant[] } {
        if (!merchants) {
            return;
        }
        const merchantsArray: IMerchant[] = [];
        _each(merchants, (merchant: IMerchant, merchantId: string) => {
            if (merchantMap[merchant.menuId]) {
                merchant.Alias = merchantMap[merchant.menuId];
            }
            this.mapping.merchantIdToNameMapping[merchantId] = merchant.menuId;
            this.mapping.merchantIdToAliasMapping[merchantId] = merchant.Alias || merchant.Name;
            this.mapping.merchantNameToIdMapping[merchant.menuId] = merchantId;
            this.mapping.merchantNameToTitleMapping[merchant.menuId] = merchant.Name;
            merchantsArray.push(merchant);
        });
        return {merchantsArray};
    }

    /**
     *
     * @param categories
     * @returns {{mapping: IMapping, categoriesArray: ICategory[]}}
     */
    public static mapCategories(categories: ICategory[]): { categoriesArray: ICategory[] } {
        if (!categories) {
            return;
        }
        const categoriesArray: ICategory[] = [];
        _each(categories, (category: ICategory) => {
            const categoryId = category.ID;
            const categoryName = category.Slug || category.menuId;
            const categoryTitle = category.Trans;
            category.MappingName = categoryName;
            categoriesArray.push(category);
            this.mapping.categoryById[categoryId] = category;
            this.mapping.categoryNameToIdMapping[categoryName] = categoryId;
            this.mapping.categoryNameToTitleMapping[categoryName] = categoryTitle;
            this.mapping.categoryIdToNameMapping[categoryId] = categoryName;
            this.mapping.categoryIdToTitleMapping[categoryId] = categoryTitle;
        });
        return {categoriesArray};
    }

    /**
     *
     * @param {Game} game
     * @param {IAvailableCategories[]} availableCategories
     * @param {IAvailableMerchants[]} availableMerchants
     */
    public static fillGamesByCategoriesMerchants(game: Game,
        availableCategories: IAvailableCategories[],
        availableMerchants: IAvailableMerchants[]): void {
        const merchantName: string = game.getMerchantName();
        const merchants: string[] = [merchantName];

        if (_toNumber(game.subMerchantID)) {
            const subMerchantName = this.getMerchantNameById(game.subMerchantID);
            if (subMerchantName && merchantName !== subMerchantName) {
                merchants.push(subMerchantName);
            }
        }

        _each(merchants, (merch: string) => {
            if (!this.mapping.byMerchant[merch]) {
                this.mapping.byMerchant[merch] = {
                    games: [],
                    categories: {},
                };
                availableMerchants.push({
                    id: game.merchantID,
                    value: merch,
                    title: this.mapping.merchantNameToTitleMapping[merch],
                });
            }
            this.mapping.byMerchant[merch].games.push(game);
        });

        _each(game.categoryID, (categoryId: string) => {
            const category: ICategory = this.getCategoryById(categoryId);
            const categoryName: string = this.getCategoryNameById(categoryId);
            const categoryTitle = this.getCategoryTitleById(categoryId);

            if (!this.mapping.byCategory[categoryName]) {
                this.mapping.byCategory[categoryName] = {
                    title: categoryTitle,
                    games: [],
                    merchants: {},
                };
                availableCategories.push({
                    id: game.merchantID,
                    value: categoryName,
                    title: categoryTitle,
                    sort: _toNumber(category?.CSort || 0),
                });
            }

            this.mapping.byCategory[categoryName].games.push(game);
            this.mapping.byCategory[categoryName].merchants[merchantName] = true;
            this.mapping.byMerchant[merchantName].categories[categoryName] = true;
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
    public static getMerchantNameById(merchantId: string): string {
        return _get(this.mapping, `merchantIdToNameMapping[${merchantId}]`, '');
    }

    /**
     *
     * @param {string} merchantId
     * @returns {string}
     */
    public static getMerchantAliasById(merchantId: string): string {
        return _get(this.mapping, `merchantIdToAliasMapping[${merchantId}]`, '');
    }

    /**
     *
     * @returns {{[p: string]: IIndexing<string>}}
     */
    public static getGameCategoryList(): { [key: string]: IIndexing<string>; } {
        return _get(this.mapping, 'categoryNameToTitleMapping', {});
    }

    /**
     *
     * @param {string} categoryName
     */
    public static getCategoryIdByName(categoryName: string): string {
        return _get(this.mapping, `categoryNameToIdMapping[${categoryName}]`, '');
    }

    /**
     *
     * @param {string} categoryId
     * @returns {string}
     */
    public static getCategoryNameById(categoryId: string): string {
        return _get(this.mapping, `categoryIdToNameMapping[${categoryId}]`, '');
    }

    /**
     *
     * @param {string} categoryId
     * @returns {IIndexing<string>}
     */
    public static getCategoryTitleById(categoryId: string): IIndexing<string> {
        return _get(this.mapping, `categoryIdToTitleMapping[${categoryId}]`, {});
    }

    /**
     *
     * @param {string} categoryId
     * @returns {ICategory}
     */
    public static getCategoryById(categoryId: string): ICategory {
        return _get(this.mapping, `categoryById[${categoryId}]`);
    }

    public static getCategoryByMenuId(categoryId: string): ICategory {
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
     * @returns {IByMerchant}
     */
    public static getCategoriesByMerchant(merchantName: string): IByMerchant {
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

}
