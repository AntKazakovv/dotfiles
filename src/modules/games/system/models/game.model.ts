import {UIRouter} from '@uirouter/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {IGame, IRestrictions, IStartGameOptions} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';

import {
    isObject as _isObject,
    each as _each,
    get as _get,
    toNumber as _toNumber,
} from 'lodash';

export class Game {
    public ID: number;
    public hasDemo: number;
    public name: IIndexing<string>;
    public categoryID: string[];
    public description: IIndexing<string> | string[];
    public launchCode: string;
    public merchantID: string;
    public subMerchantID: string;
    public sort: string;
    public aspectRatio: string;
    public image: string;

    protected url: string;
    protected sortPerCategory: IIndexing<number>;
    protected isRestricted: boolean;
    protected IDCountryRestriction: string;
    protected freeround?: string;

    // что-то не нужное
    // protected MobileUrl: string;
    // protected MobileAndroidUrl?: string;
    // protected MobileWindowsUrl?: string;
    // protected SuperBranded: number;
    // protected Branded: number;
    // protected PageCode: string;
    // protected MobilePageCode: string;
    // protected MobileAndroidPageCode: string;
    // protected MobileWindowsPageCode: string;
    // protected ExternalCode: string;
    // protected MobileExternalCode: string;
    // protected ImageFullPath: string;
    // protected WorkingHours: string;
    // protected IsVirtual: string;
    // protected TableID: string;

    public jackpot?: number;
    public isFavourite?: boolean;
    protected merchantAlias?: string;
    protected merchantName?: string;
    protected toggleFavourite?: any;
    protected isCurrencyDisabled?: boolean;
    protected CategoryTitle?: IIndexing<string>[];

    constructor(
        data: IGame,
        protected router: UIRouter,
    ) {
        // Object.assign(this, data);
        this.ID = _toNumber(data.ID);
        this.aspectRatio = data.AR;
        this.hasDemo = data.hasDemo;
        this.name = data.Name;
        this.categoryID = data.CategoryID;
        this.description = data.Description;
        this.launchCode = data.LaunchCode;
        this.merchantID = data.MerchantID;
        this.subMerchantID = data.SubMerchantID;
        this.sort = data.Sort;
        this.url = data.Url;
        this.image = data.Image;
        this.sortPerCategory = data.SortPerCategory;
        this.isRestricted = data.isRestricted;
        this.freeround = data.Freeround;
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
            : restrictions.restrictedByDefault[this.merchantID];

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
        return GamesHelper.getMerchantNameById(this.merchantID)
            || GamesHelper.getMerchantNameById(this.subMerchantID);
    }

    /**
     *
     */
    public setSortedCategoryFields(): void {
        if (this.sortPerCategory) {
            _each(this.sortPerCategory, (value, key) => {
                if (value) {
                    const name = GamesHelper.mapping.categoryIdToNameMapping[key];
                    this[name + 'Sorted'] = value;
                }
            });
        }
    }

    /**
     *
     * @param {IStartGameOptions} options
     */
    public launch(options: IStartGameOptions): void {
        this.router.stateService.go('app.gameplay', {
            merchantId: this.merchantID,
            launchCode: this.launchCode,
            demo: options.demo,
        });
    }
}
