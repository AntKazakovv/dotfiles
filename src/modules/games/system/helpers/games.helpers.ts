import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';

import {
    IByCategory,
    IByMerchant,
    IMapping,
    ICategory,
    ICountriesRestriction,
    ICountriesRestrictions,
    IIndexingCategories,
    IIndexingMerchants,
    IMerchant,
    IRestrictions,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';

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
        merchantNameToObjectMapping: {},
        merchantNameToIdMapping: {},
        merchantNameToTitleMapping: {},
        byMerchant: {},
        categoryById: {},
        categoryByName: {},
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
     * @returns {{merchantsArray: MerchantModel[]}}
     */
    public static mapMerchants(merchants: IIndexingMerchants, merchantMap: IIndexing<string>): { merchantsArray: MerchantModel[] } {
        if (!merchants) {
            return;
        }
        const merchantsArray: MerchantModel[] = [];
        _each(merchants, (merchantItem: IMerchant, merchantId: string) => {
            if (merchantMap[merchantItem.menuId]) {
                merchantItem.Alias = merchantMap[merchantItem.menuId];
            }

            const merchant: MerchantModel = new MerchantModel(merchantItem);
            this.mapping.merchantIdToNameMapping[merchant.id] = merchant.menuId;
            this.mapping.merchantIdToAliasMapping[merchant.id] = merchant.alias || merchant.name;
            this.mapping.merchantNameToObjectMapping[merchant.menuId] = merchant;
            this.mapping.merchantNameToIdMapping[merchant.menuId] = _toNumber(merchantId);
            this.mapping.merchantNameToTitleMapping[merchant.menuId] = merchant.name;
            merchantsArray.push(merchant);
        });
        return {merchantsArray};
    }

    /**
     *
     * @param categories
     * @returns {{mapping: IMapping, categoriesArray: CategoryModel[]}}
     */
    public static mapCategories(categories: ICategory[]): { categoriesArray: CategoryModel[] } {
        if (!categories) {
            return;
        }
        const categoriesArray: CategoryModel[] = [];
        _each(categories, (item: ICategory) => {
            const category = new CategoryModel(item);
            categoriesArray.push(category);

            this.mapping.categoryById[category.id] = category;
            this.mapping.categoryByName[category.name] = category;
            this.mapping.categoryNameToIdMapping[category.name] = category.id;
            this.mapping.categoryNameToTitleMapping[category.name] = category.title;
            this.mapping.categoryIdToNameMapping[category.id] = category.name;
            this.mapping.categoryIdToTitleMapping[category.id] = category.title;
        });
        return {categoriesArray};
    }

    /**
     *
     * @param {Game} game
     * @param {CategoryModel[]} availableCategories
     * @param {IMerchant[]} availableMerchants
     */
    public static fillGamesByCategoriesMerchants(
        game: Game,
        availableCategories: CategoryModel[],
        availableMerchants: MerchantModel[]): void
    {
        const merchantName: string = game.getMerchantName();
        const merchants: string[] = [merchantName];

        if (_toNumber(game.subMerchantID)) {
            const subMerchantName = this.getMerchantNameById(game.subMerchantID);
            if (subMerchantName && merchantName !== subMerchantName) {
                merchants.push(subMerchantName);
            }
        }

        _each(merchants, (merch: number) => {
            if (!this.mapping.byMerchant[merch]) {
                this.mapping.byMerchant[merch] = {
                    games: [],
                    categories: {},
                };
                availableMerchants.push(GamesHelper.getMerchantByName(merch));
            }
            this.mapping.byMerchant[merch].games.push(game);
        });

        _each(game.categoryID, (categoryId: number) => {
            const category: CategoryModel = this.getCategoryById(categoryId);
            const categoryName: string = this.getCategoryNameById(categoryId);
            const categoryTitle = this.getCategoryTitleById(categoryId);

            if (!this.mapping.byCategory[categoryName]) {
                this.mapping.byCategory[categoryName] = {
                    title: categoryTitle,
                    games: [],
                    merchants: {},
                };
                availableCategories.push(category);
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
    public static getMerchantNameById(merchantId: number): string {
        return _get(this.mapping, `merchantIdToNameMapping[${merchantId}]`, '');
    }

    /**
     *
     * @param {string} merchantName
     * @returns {MerchantModel}
     */
    public static getMerchantByName(merchantId: number): MerchantModel {
        return _get(this.mapping, `merchantNameToObjectMapping[${merchantId}]`, '');
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
    public static getGameCategoryList(): { [key: string]: IIndexing<string>; } {
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
