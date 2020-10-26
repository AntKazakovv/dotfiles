import {IIndexing, IIndexingBoolean, IIndexingString} from 'wlc-engine/interfaces';

import {
    ICategoriesMapping,
    ICategory,
    ICountriesRestriction,
    ICountriesRestrictions,
    IIndexingCategories,
    IIndexingMerchants,
    IMerchant,
    IMerchantsMapping, IRestrictions,
} from 'wlc-engine/modules/games/interfaces/games.interfaces';

import {
    each as _each,
    assign as _assign,
    isArray as _isArray,
} from 'lodash';

export class GamesHelper {
    /**
     *
     * @param {IIndexingMerchants} merchants
     * @param {IIndexingString} merchantMap
     * @returns {{merchantsMapping: IMerchantsMapping; merchantsArray: IMerchant[]}}
     */
    public static mapMerchants(merchants: IIndexingMerchants, merchantMap: IIndexingString):
        { merchantsMapping: IMerchantsMapping, merchantsArray: IMerchant[] } {
        if (!merchants) {
            return;
        }

        const merchantsMapping: IMerchantsMapping = {
            merchantIdToNameMapping: {},
            merchantIdToAliasMapping: {},
            merchantNameToIdMapping: {},
            merchantNameToTitleMapping: {},
        };
        const merchantsArray: IMerchant[] = [];

        _each(merchants, (merchant: IMerchant, merchantId: string) => {
            if (merchantMap[merchant.menuId]) {
                merchant.Alias = merchantMap[merchant.menuId];
            }

            merchantsMapping.merchantIdToNameMapping[merchantId] = merchant.menuId;
            merchantsMapping.merchantIdToAliasMapping[merchantId] = merchant.Alias || merchant.Name;
            merchantsMapping.merchantNameToIdMapping[merchant.menuId] = merchantId;
            merchantsMapping.merchantNameToTitleMapping[merchant.menuId] = merchant.Name;
            merchantsArray.push(merchant);
        });

        return {merchantsMapping, merchantsArray};
    }


    /**
     *
     * @param {ICategory[]} categories
     * @returns {{categoriesMapping: ICategoriesMapping; categoriesArray: ICategory[]}}
     */
    public static mapCategories(categories: ICategory[]):
        { categoriesMapping: ICategoriesMapping, categoriesArray: ICategory[] } {
        if (!categories) {
            return;
        }

        const categoriesMapping: ICategoriesMapping = {
            categoryById: {},
            categoryNameToIdMapping: {},
            categoryNameToTitleMapping: {},
            categoryIdToNameMapping: {},
            categoryIdToTitleMapping: {},
        };
        const categoriesArray: ICategory[] = [];

        _each(categories, (category: ICategory) => {
            const categoryId = category.ID;
            const categoryName = category.Slug || category.menuId;
            const categoryTitle = category.Trans;

            category.MappingName = categoryName;
            categoriesArray.push(category);

            categoriesMapping.categoryById[categoryId] = category;
            categoriesMapping.categoryNameToIdMapping[categoryName] = categoryId;
            categoriesMapping.categoryNameToTitleMapping[categoryName] = categoryTitle;
            categoriesMapping.categoryIdToNameMapping[categoryId] = categoryName;
            categoriesMapping.categoryIdToTitleMapping[categoryId] = categoryTitle;
        });

        return {categoriesMapping, categoriesArray};
    }

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
