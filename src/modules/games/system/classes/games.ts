import {
    TranslateService,
} from '@ngx-translate/core';

import _filter from 'lodash-es/filter';
import _includes from 'lodash-es/includes';
import _uniq from 'lodash-es/uniq';
import _forEach from 'lodash-es/forEach';
import _union from 'lodash-es/union';
import _find from 'lodash-es/find';
import _values from 'lodash-es/values';
import _each from 'lodash-es/each';
import _isArray from 'lodash-es/isArray';
import _concat from 'lodash-es/concat';

import {
    ConfigService,
    IIndexing,
} from 'wlc-engine/modules/core';
import {IGamesSettings} from 'wlc-engine/modules/games/system/builders/games.builder';
import {IAllSortsItemResponse} from 'wlc-engine/modules/games/system/interfaces/sorts.interfaces';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {
    ICountriesRestrictions,
    IGamesSeparateSortSetting,
    IGamesSortSetting,
    IMerchantCurrency,
    IMerchantsCurrencies,
    IRestrictions,
    ISearchFilter,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';

interface IGenerateParameters extends IFilterParameters {
    /**
     * providers id's
     */
    merchantsIds: number[];
    /**
     * should providers be first in search result
     */
    showMerchantsFirst: boolean;
}

interface IFilterParameters {
    /**
     * full search word
     */
    searchString: string,
    /**
     * partial search word
     */
    queries: string[],
}

interface IFilterItemsParameters<T, L> extends IFilterParameters {
    /**
     * collection for sorting
     */
    collection: T[],
    /**
     * a function that returns in which word will be searched for matches
     */
    getItemName: (item: T) => string | string[],
    /**
     * function that returns which element will be in the sorted array
     */
    getPushItem: (item: T) => L,
    /**
     * callback function that returns the weight to sort the item
     */
    callback?: (item: T) => number,
}

export class Games {

    public availableGames: Game[];
    public allGames: Game[] = [];
    public sortSetting: IGamesSortSetting;
    public separateSortSettings: IGamesSeparateSortSetting;
    public useSeparateSorts: boolean;
    public overrideJackpots: boolean;
    public searchByCyrillicLetters: boolean;
    public merchantsCurrencies: IMerchantsCurrencies = {};
    public static allowGameCurrency: boolean;
    public static isMultiWallet: boolean;
    public static alwaysShowChoiceOfCurrency: boolean = false;

    protected restrictions: IRestrictions;

    constructor(
        protected settings: IGamesSettings,
        protected sorts: IIndexing<IAllSortsItemResponse>,
        protected configService: ConfigService,
        protected translateService: TranslateService,
    ) {
        this.init();
    }

    public setGames(games: Game[]): void {
        this.allGames = games;
        this.sort(this.allGames);
        this.availableGames = this.allGames;
    }

    public setRestrictions(countriesRestrictions: ICountriesRestrictions): void {
        this.restrictions = GamesHelper.createRestrictions(countriesRestrictions);
    }

    public setMerchantsCurrencies(merchants: IMerchantCurrency[]): void {
        for (let merchant of merchants) {
            //TODO переделать после релиза https://tracker.egamings.com/issues/599028
            if (merchant.IsDefault === '1') {
                this.merchantsCurrencies[merchant.IDMerchant] = merchant.Currencies;
            }
        }
    }

    public setAvailableGames(disabledMerchants: number[], restrictCountries: string[]): void {
        this.availableGames = _filter(this.allGames, (game: Game) => {
            if (disabledMerchants && _includes(disabledMerchants, game.merchantID)) {
                return false;
            }

            return !game.gameRestricted(this.restrictions, restrictCountries);
        });
        this.sort(this.availableGames);
    }

    public sort(games: Game[] = this.allGames): void {
        if (this.useSeparateSorts) {
            GamesHelper.sortGamesGeneral(games, this.sorts, {
                sortSetting: this.separateSortSettings,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        } else {
            GamesHelper.sortGames(games, {
                sortSetting: this.sortSetting,
                country: this.configService.get('appConfig.country'),
                language: this.translateService.currentLang || 'en',
            });
        }
    }

    /**
     * Find and sort games by searchQuery
     *
     * @param {string} searchQuery Some text to search by game name
     * @param {Game[]} gamesList Games for search
     * @returns {Game[]} Filtered and sorted games
     */
    public sortNameByRegExp(searchQuery: string, gamesList: Game[]): Game[] {
        const arrays: IIndexing<ISearchFilter> = {
            completeMatch: {
                array: [],
                regExp: `^${searchQuery}[\\s]`,
            },
            firstMatch: {
                array: [],
                regExp: `[\\s]${searchQuery}[\\s]?$`,
            },
            secondMatch: {
                array: [],
                regExp: `[\\s]${searchQuery}`,
            },
            thirdMatch: {
                array: [],
                regExp: `${searchQuery}`,
            },
        };

        _forEach(arrays, (item: ISearchFilter): void => {
            item.array = _filter(gamesList, (game: Game): boolean => {
                return !!_find(game.name, (lang: string): boolean => {
                    return new RegExp(item.regExp, 'gi').test(lang);
                });
            });
        });

        return _uniq(_union(arrays.completeMatch.array,
            arrays.firstMatch.array,
            arrays.secondMatch.array,
            arrays.thirdMatch.array));
    }

    /**
     * Replace cyrillic chars in search query
     *
     * @param {string} word input word (cyrillic)
     * @returns {string} output latins chars from cyrillic word
     */
    public replaceCyrillicChars(word: string): string {
        word = word.toLowerCase();
        const cyrillicAlphabet: string[] = ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
            'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
            'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'];
        const latinAlphabet: string[] = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '', '',
            'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '', '',
            'z', 'x', 'c', 'v', 'b', 'n', 'm', '', ''];

        for (let i = 0; i < cyrillicAlphabet.length; i++) {
            word = word.replace(new RegExp(cyrillicAlphabet[i], 'g'), latinAlphabet[i]);
        }

        return word;
    }

    /**
     * @param param {IGenerateParameters}
     * @returns {IFilterItemsParameters} parameters for filterItems
     */
    public generateParams({
        searchString,
        queries,
        merchantsIds,
        showMerchantsFirst,
    }: IGenerateParameters): IFilterItemsParameters<Game, Game> {
        return {
            collection: this.availableGames,
            getItemName: (item: Game): string[] => _values(item.name),
            searchString,
            queries,
            getPushItem: (item: Game): Game => item,
            callback: (item: Game): number => this.filterGamesCallback(
                merchantsIds,
                item,
                showMerchantsFirst,
            ),
        };
    }

    /**
     * Filters and sorts collections by weight. The weight is determined by the parameters passed in.
     * The greater the weight, the more items will be first.
     */
    public filterItems<T, L>({
        collection,
        getItemName,
        searchString,
        queries,
        getPushItem,
        callback,
    }: IFilterItemsParameters<T, L>): L[] {
        const searchList: L[][] = [];

        _each(collection, (item: T): void => {
            let weight: number = 0;
            const itemNames: string | string[] = getItemName(item);

            if (callback) {
                weight += callback(item);
            }

            if (_isArray(itemNames)) {
                _each(itemNames, (name: string): void => {
                    weight += this.getWeightByMatching(name, searchString, queries);
                });
            } else {
                weight += this.getWeightByMatching(itemNames, searchString, queries);
            }

            if (weight === 0) {
                return;
            }

            if (!searchList[weight]) {
                searchList[weight] = [];
            }

            searchList[weight].push(getPushItem(item));
        });

        return searchList.reduceRight((previous, current) => _concat(previous, current), []);
    }

    /**
     * increases the weight by a full match, then by a partial match, then returns the weight
     * @param name {string}
     * @param searchString {string}
     * @param queries {string[]}
     * @returns {number} weight by match
     */
    private getWeightByMatching(name: string, searchString: string, queries: string[]): number {
        const itemName = name.toLowerCase();
        let weight: number = 0;

        // exact match
        if (_includes(itemName, searchString)) {
            weight += 5;
        }

        // partial match
        if (queries.length > 1) {
            _each(queries, (query: string): void => {
                if (query.length >= 2 && _includes(itemName, query)) {
                    weight++;
                }
            });
        }

        return weight;
    }

    private init(): void {
        this.useSeparateSorts = this.configService.get<boolean>('$games.sortsV2.use');
        this.overrideJackpots = !this.configService.get<boolean>('$games.categories.useFundistJackpots');
        this.searchByCyrillicLetters = this.configService.get<boolean>('$games.search.byCyrillicLetters');
        this.sortSetting = this.configService.get<IGamesSortSetting>('$games.categories.gamesSortSetting');
        this.separateSortSettings = this.configService.get<IGamesSeparateSortSetting>('$games.sortsV2.settings');
        Games.alwaysShowChoiceOfCurrency = this.configService.get<boolean>('$base.games.alwaysShowChoiceOfCurrency');
        Games.allowGameCurrency =
            this.configService.get<boolean>('appConfig.siteconfig.AllowGameCurrency');
        Games.isMultiWallet = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');
    }

    /**
     * if the parameter showMerchantsFirst true, the weight will be large, so then use this value in the filter
     * and place games with providers who have the same id as the games first
     */
    private filterGamesCallback(
        merchantsIds: number[],
        item: Game,
        showMerchantsFirst: boolean,
    ): number {
        let weight: number = 0;

        if (merchantsIds.length) {
            _each(merchantsIds, (id: number): void => {
                if (id === item.subMerchantID || id === item.merchantID) {
                    weight += showMerchantsFirst ? 10 : 1;
                }
            });
        }

        return weight;
    }
}
