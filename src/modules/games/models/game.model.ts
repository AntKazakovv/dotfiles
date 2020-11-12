import {IIndexing} from 'wlc-engine/interfaces/index';
import {IMapping, IRestrictions} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {GamesHelper} from 'wlc-engine/modules/games/games.helpers';

import {
    isObject as _isObject,
    each as _each,
    get as _get,
} from 'lodash';

export abstract class AbstractGame {
    public ID: string;
    public Image: string;
    public hasDemo: number;
    public Url: string;
    public Name: IIndexing<string>;
    public CategoryID: string[];
    public Description: IIndexing<string> | string[];
    public LaunchCode: string;
    public MerchantID: string;
    public SubMerchantID: string;
    public Sort: string;
    public SortPerCategory: IIndexing<number>;
    public MobileUrl: string;
    public MobileAndroidUrl?: string;
    public MobileWindowsUrl?: string;
    public SuperBranded: number;
    public Branded: number;
    public AR: string;
    public IDCountryRestriction: string;
    public PageCode: string;
    public MobilePageCode: string;
    public MobileAndroidPageCode: string;
    public MobileWindowsPageCode: string;
    public ExternalCode: string;
    public MobileExternalCode: string;
    public ImageFullPath: string;
    public WorkingHours: string;
    public IsVirtual: string;
    public TableID: string;
    public isRestricted: boolean;
    public Freeround?: string;
}

export class Game extends AbstractGame {
    protected isFavourite?: boolean;
    protected merchantAlias?: string;
    protected merchantName?: string;
    protected toggleFavourite?: any;
    protected isCurrencyDisabled?: boolean;
    protected CategoryTitle?: IIndexing<string>[];

    constructor(data: AbstractGame) {
        super();
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

    public openGame(): void {

    }
}
