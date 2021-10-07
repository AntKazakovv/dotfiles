import {UIRouter} from '@uirouter/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    IGame,
    IRestrictions,
    IStartGameOptions,
    TGameImageSize,
} from 'wlc-engine/modules/games';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {
    GlobalHelper,
    IFromLog,
} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';
import _each from 'lodash-es/each';
import _intersection from 'lodash-es/intersection';
import _includes from 'lodash-es/includes';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';

export class Game extends AbstractModel<IGame> {
    public ID: number;
    public hasDemo: boolean;
    public name: IIndexing<string>;
    public categoryID: number[];
    public description: IIndexing<string> | string[];
    public launchCode: string;
    public merchantID: number;
    public subMerchantID: number;
    public sort: number;
    public aspectRatio: string;
    public image: string;
    public merchantName: string;
    public merchantAlias?: string;
    public jackpot?: number;
    public isFavourite?: boolean;
    public sortPerCategory: IIndexing<number>;

    protected url: string;
    protected isRestricted: boolean;
    protected IDCountryRestriction: string;
    protected freeround?: string;
    protected toggleFavourite?: any;
    protected isCurrencyDisabled?: boolean;
    protected CategoryTitle?: IIndexing<string>[];

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


    constructor(
        from: IFromLog,
        data: IGame,
        protected router: UIRouter,
        protected configService: ConfigService,
    ) {
        super({from: _assign({model: 'Game'}, from)});

        // Object.assign(this, data);
        this.ID = _toNumber(data.ID);
        this.aspectRatio = 'auto';
        this.hasDemo = !!data.hasDemo;
        this.name = data.Name;
        this.categoryID = _map(data.CategoryID, (id: string) => {
            return _toNumber(id);
        });
        this.description = data.Description;
        this.launchCode = data.LaunchCode;
        this.merchantID = _toNumber(data.MerchantID);
        this.subMerchantID = _toNumber(data.SubMerchantID);
        this.sort = _toNumber(data.Sort);
        this.url = data.Url;
        this.image = data.Image;
        this.sortPerCategory = data.SortPerCategory;
        this.isRestricted = data.isRestricted;
        this.freeround = data.Freeround;
        this.IDCountryRestriction = data.IDCountryRestriction;
        this.merchantName = this.getMerchantName();
        this.merchantAlias = this.getMerchantAlias();
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
     * Check has category or not
     *
     * @param {CategoryModel} category
     * @returns {boolean}
     */
    public hasCategory(category: CategoryModel): boolean {
        return _includes(this.categoryID, category.id);
    }

    /**
     *
     * @returns {string}
     */
    public getMerchantName(): string {
        return GamesHelper.getMerchantNameById(this.merchantID)
            || GamesHelper.getMerchantNameById(this.subMerchantID);
    }

    public getMerchantAlias(): string {
        return GamesHelper.getMerchantAliasById(this.merchantID)
            || GamesHelper.getMerchantAliasById(this.subMerchantID);
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
        const locale = this.configService.get('currentLanguage') ?? this.configService.get('appConfig.language');
        this.router.stateService.go('app.gameplay', {
            merchantId: this.merchantID,
            launchCode: this.launchCode,
            demo: options.demo,
            locale,
        }, {
            reload: false,
        });
    }

    /**
     * Check game run restricted by bonuses or not
     *
     * @param {Bonus} bonus
     * @returns {boolean} Restricted or not
     */
    public restrictedByBonuses(bonuses: Bonus[]): boolean {
        for (const bonus of bonuses) {
            const gamesWhiteList = bonus.gamesList(true),
                gamesBlackList = bonus.gamesList(false),
                categoriesWhiteList = bonus.categoriesList(true),
                categoriesBlackList = bonus.categoriesList(false);

            const inBlackList: boolean = _includes(gamesBlackList, this.ID) ||
                _intersection(categoriesBlackList, this.categoryID).length > 0;
            const notInWhiteList: boolean = gamesWhiteList.length && !_includes(gamesWhiteList, this.ID) ||
                categoriesWhiteList.length && !_intersection(categoriesWhiteList, this.categoryID).length;

            if (inBlackList || notInWhiteList) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get image path
     *
     * @param {TGameImageSize} size Image size
     * @param {string} extension Image extension
     * @returns {string} Image path
     */
    public getImage(size?: TGameImageSize, extension: string = ''): string {
        let image = this.image;
        if (size) {
            const replaceVal: string = (size === 640) ? '$1' : `/${size}/$1`;
            image = image.replace(/\/\d+\/(.+)$/, replaceVal);
        }
        if (extension) {
            image = GlobalHelper.setFileExtension(image, extension);
        }
        return image;
    }
}
