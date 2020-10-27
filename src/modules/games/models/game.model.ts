import {IIndexing} from 'wlc-engine/interfaces/index';
import {IMerchantsMapping, IRestrictions} from 'wlc-engine/modules/games/interfaces/games.interfaces';

import {
    concat as _concat,
    find as _find,
    isArray as _isArray,
    isObject as _isObject,
    each as _each,
    get as _get,
    assign as _assign,
} from 'lodash';

export class Game {
    CategoryID: string[];
    CategoryTitle: IIndexing<string>[];
    Description: string[];
    Image: string;
    LaunchCode: string;
    MerchantID: string;
    SubMerchantID?: string;
    MobileUrl: string;
    Name: IIndexing<string>;
    Sort: string;
    SortPerCategory: IIndexing<boolean>;
    Url: string;
    hasDemo: number;
    isFavourite?: boolean;
    merchantAlias?: string;
    merchantName?: string;
    Freeround?: string;
    toggleFavourite?: any;
    isCurrencyDisabled?: boolean;
    protected isRestricted: boolean;
    protected AR: string;
    protected Branded: number;
    protected ID: string;
    protected IDCountryRestriction: string;
    protected SuperBranded: number;

    constructor(data: Game) {
        Object.assign(this, data);
    }

    /**
     *
     * @param {IRestrictions} restrictions
     * @param {string[]} countries
     * @returns {boolean}
     */
    public gameRestricted(restrictions: IRestrictions, countries: string[]): boolean {
        if (this.isRestricted) return true;

        const restrictedCountries = this.IDCountryRestriction
            ? restrictions.restrictedByID[this.IDCountryRestriction]
            : restrictions.restrictedByDefault[this.MerchantID];

        if (_isObject(restrictedCountries)) {
            _each(countries, (country: string) => {
                if (restrictedCountries[country]) {
                    this.isRestricted = true;
                }
            });
        }

        return this.isRestricted;
    }

    /**
     *
     * @param {IMerchantsMapping} merchantsMapping
     * @returns {string}
     */
    public getMerchantName(merchantsMapping: IMerchantsMapping): string {
        return _get(merchantsMapping, `merchantIdToNameMapping[${this.MerchantID}]`)
            || _get(merchantsMapping, `merchantIdToNameMapping[${this.SubMerchantID}]`);
    }


    /**
     *
     * @param {IIndexing<string>} categoryIdToNameMapping
     */
    public setSortedCategoryFields(categoryIdToNameMapping: IIndexing<string>): void {
        if (this.SortPerCategory) {
            _each(this.SortPerCategory, (value, key) => {
                if (value) {
                    const name = categoryIdToNameMapping[key];
                    this[name + 'Sorted'] = value;
                }
            });
        }
    }


}
