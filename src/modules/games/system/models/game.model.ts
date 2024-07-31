import {UIRouter} from '@uirouter/core';
import {BehaviorSubject} from 'rxjs';

import _assign from 'lodash-es/assign';
import _isObject from 'lodash-es/isObject';
import _each from 'lodash-es/each';
import _intersection from 'lodash-es/intersection';
import _includes from 'lodash-es/includes';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';
import _isArray from 'lodash-es/isArray';
import _find from 'lodash-es/find';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {
    IGame,
    IRestrictions,
    IStartGameOptions,
    IGameJackpotAmount,
    TGameImageSize,
    MerchantModel,
} from 'wlc-engine/modules/games';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {CategoryModel} from 'wlc-engine/modules/games/system/models/category.model';
import {TDisableDemoFor} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    GlobalHelper,
    IFromLog,
} from 'wlc-engine/modules/core';
import {Games} from 'wlc-engine/modules/games/system/classes/games';
import {UserProfile} from 'wlc-engine/modules/user/system/models';

export class Game extends AbstractModel<IGame> {
    public ID: number;
    public tableID: string;
    public name: IIndexing<string>;
    public categoryID: number[];
    public sortPerLanguage: IIndexing<number>;
    public sortPerCountry: IIndexing<number>;
    public launchCode: string;
    public merchantID: number;
    public subMerchantID: number;
    public sort: number;
    public aspectRatio: string;
    public image: string;
    public merchantName: string;
    public merchantAlias: string;
    public jackpot?: number;
    public isFavourite?: boolean;
    public sortPerCategory: IIndexing<number>;
    public launchMerchantID: number;
    public isVisibilityChangeCurrency: boolean = false;
    public initialCurrency: string;
    public admID?: string;
    public hotGameRTP?: number;

    protected url: string;
    protected isRestricted: boolean;
    protected countryRestrictionId: string;
    protected disableDemoBtnsFor: TDisableDemoFor;
    protected _withFreeRounds: boolean;

    private _jackpotAmount: IGameJackpotAmount;
    private static _enabledMerchants: MerchantModel[];
    private _selectedCurrency: string;

    constructor(
        from: IFromLog,
        data: IGame,
        protected router: UIRouter,
        protected configService: ConfigService,
        public merchantsCurrencies?: string[],
    ) {
        super({from: _assign({model: 'Game'}, from)});

        // Object.assign(this, data);
        this.ID = _toNumber(data.ID);
        this.tableID = data.TableID;
        this.aspectRatio = data.AR;
        this.name = data.Name;
        this.categoryID = _map(data.CategoryID, (id: string) => {
            return _toNumber(id);
        });
        this.launchCode = data.LaunchCode;
        this.merchantID = _toNumber(data.MerchantID);
        this.subMerchantID = _toNumber(data.SubMerchantID);
        this.admID = data.AdmID;
        this.launchMerchantID = this.subMerchantID && _find(Game._enabledMerchants, {id: this.subMerchantID})
            ? this.subMerchantID
            : this.merchantID;
        this.sortPerLanguage = !_isArray(data.CustomSort) ? data.CustomSort.Lang : {};
        this.sortPerCountry = !_isArray(data.CustomSort) ? data.CustomSort.Country : {};
        this.sort = _toNumber(data.Sort);
        this.url = data.Url;
        this.image = GlobalHelper.proxyUrl(data.Image);
        this.sortPerCategory = _isArray(data.SortPerCategory) ? {} : data.SortPerCategory;
        this.countryRestrictionId = data.IDCountryRestriction;
        this.merchantName = this.getMerchantName();
        this.merchantAlias = this.getMerchantAlias();
        this.disableDemoBtnsFor = this.configService.get<TDisableDemoFor>('$games.disableDemoBtnsFor');
        this._withFreeRounds = data.Freeround === '1';
        this.hotGameRTP = data.HotGameRTP && Number(data.HotGameRTP);

        this.data = data;
    }

    public static set enabledMerchants(merchants: MerchantModel[]) {
        Game._enabledMerchants = merchants;
    }

    public get hasDemo(): boolean {
        switch (this.disableDemoBtnsFor) {
            case 'all':
                return false;
            case 'auth':
                return this.configService.get<boolean>('$user.isAuthenticated') ? false : !!this.data.hasDemo;
            default:
                return !!this.data.hasDemo;
        }
    }

    public set jackpotAmount(amount: IGameJackpotAmount) {
        this._jackpotAmount = amount;
    }

    public get jackpotAmount(): IGameJackpotAmount {
        return this._jackpotAmount;
    }

    /**
     * Game with support free rounds or not
     *
     * @returns {boolean} True if game supports free rounds
     */
    public get withFreeRounds(): boolean {
        return this._withFreeRounds;
    }


    public get currency(): string {
        const currency: string = this._selectedCurrency
            ?? this.currencyIsSupportedByTheProvider()
            ?? this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                .getValue()?.currency;

        return currency;
    }

    public set selectedCurrency(currency: string) {
        this._selectedCurrency = currency;
    }

    public get showChoiceOfCurrency(): boolean {
        const alwaysShowChoiceOfCurrency: boolean = Games.alwaysShowChoiceOfCurrency && !this._selectedCurrency;
        const isShow: boolean = Games.allowGameCurrency
            && !!this.merchantsCurrencies?.length
            && (!(this.isVisibilityChangeCurrency || !!this.currencyIsSupportedByTheProvider())
                || alwaysShowChoiceOfCurrency);
        return isShow;
    }

    public currencyIsSupportedByTheProvider(): string | undefined {

        return this.merchantsCurrencies
            ?.find((currency: string): boolean =>
                currency === this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
                    .getValue()?.currency,
            );
    }
    /**
     *
     * @param {IRestrictions} restrictions
     * @param {string[]} countries
     * @returns {boolean}
     */
    public gameRestricted(restrictions: IRestrictions, countries: string[]): boolean {
        let restricted: boolean = false;

        const restrictedCountries: IIndexing<boolean> = restrictions.restrictedByID[this.countryRestrictionId]
            || restrictions.restrictedByDefault[this.subMerchantID]
            || restrictions.restrictedByDefault[this.merchantID];

        if (_isObject(restrictedCountries)) {
            _each(countries, (country: string) => {
                if (restrictedCountries[country]) {
                    restricted = true;
                }
            });
        }
        return restricted;
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
     * Check has category by id
     *
     * @param {number} categoryId
     * @returns {boolean}
     */
    public hasCategoryById(categoryId: number): boolean {
        return this.categoryID.includes(categoryId);
    }

    /**
     *
     * @returns {string}
     */
    public getMerchantName(): string {
        return GamesHelper.getMerchantNameById(this.merchantID)
            || GamesHelper.getMerchantNameById(this.subMerchantID);
    }

    public getMerchantAlias(firstMerchantAlias: boolean = true): string {
        const merchantAlias = GamesHelper.getMerchantAliasById(this.merchantID);
        const subMerchantAlias = GamesHelper.getMerchantAliasById(this.subMerchantID);

        return firstMerchantAlias ? (merchantAlias || subMerchantAlias) : (subMerchantAlias || merchantAlias);
    }

    /**
     *
     * @param {IStartGameOptions} options
     */
    public launch(options: IStartGameOptions): void {
        const locale = this.configService.get('currentLanguage') ?? this.configService.get('appConfig.language');
        this.router.stateService.go('app.gameplay', {
            merchantId: this.launchMerchantID,
            launchCode: this.launchCode,
            demo: options.demo || null,
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
            if (bonus.isActive) {
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
        if (size && this.image.indexOf('//agstatic') === 0) {
            const replaceVal: string = (size === 640) ? '/$1' : `/${size}/$1`;
            image = image.replace(/\/\d+\/(.+)$/, replaceVal);
        }
        if (extension) {
            image = GlobalHelper.setFileExtension(image, extension);
        }
        return GlobalHelper.proxyUrl(image);
    }
}
