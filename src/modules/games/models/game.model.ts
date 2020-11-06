import {IIndexing} from 'wlc-engine/interfaces/index';
import {IMapping, IRestrictions} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {GamesHelper} from 'wlc-engine/modules/games/games.helpers';

import {
    isObject as _isObject,
    each as _each,
    get as _get,
} from 'lodash';

export class Game {
    public ID: string;
    public Image: string;
    public hasDemo: number;
    public Url: string;
    public Name: IIndexing<string>;
    CategoryID: string[];
    CategoryTitle?: IIndexing<string>[];
    Description: string[];
    LaunchCode: string;
    MerchantID: string;
    SubMerchantID?: string;
    MobileUrl: string;
    Sort: string;
    SortPerCategory?: IIndexing<number>;
    isFavourite?: boolean;
    merchantAlias?: string;
    merchantName?: string;
    Freeround?: string;
    toggleFavourite?: any;
    isCurrencyDisabled?: boolean;
    protected isRestricted: boolean;
    protected AR: string;
    protected Branded: number;
    protected IDCountryRestriction: string;
    protected SuperBranded?: number;

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
     * @returns {string}
     */
    public getMerchantName(): string {
        return GamesHelper.getMerchantNameById(this.MerchantID)
            || GamesHelper.getMerchantNameById(this.SubMerchantID);
    }

    /**
     *
     */
    public setSortedCategoryFields(): void {
        if (this.SortPerCategory) {
            _each(this.SortPerCategory, (value, key) => {
                if (value) {
                    const name = GamesHelper.mapping.categoryIdToNameMapping[key];
                    this[name + 'Sorted'] = value;
                }
            });
        }
    }


}
