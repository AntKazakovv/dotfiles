import _assign from 'lodash-es/assign';
import _includes from 'lodash-es/includes';
import _toNumber from 'lodash-es/toNumber';
import _has from 'lodash-es/has';
import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import _isNil from 'lodash-es/isNil';
import _intersectionBy from 'lodash-es/intersectionBy';

import {
    ICategorySettings,
    CategoryViewType,
    ICategoryBlock,
} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {
    ICategory,
    IGameBlock,
    IGamesSortSetting,
    TGameSortFeature,
    TSortDirection,
} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {
    IFromLog,
} from 'wlc-engine/modules/core/system/services/log/log.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {Deferred} from 'wlc-engine/modules/core/system/classes/deferred.class';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {MerchantModel} from 'wlc-engine/modules/games/system/models/merchant.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';

const directions = {
    asc: -1,
    desc: 1,
};

const specialCategories = [
    'casino',
    'lastplayed',
    'favourites',
    'last-played',
];

const defaultParentsCategories = [
    'new',
    'popular',
];

export class CategoryModel extends AbstractModel<ICategory> {

    /**
     * Hidden category or not. Hidden categories used for seaching games, but not show in user interface
     */
    public isHidden: boolean;

    private static currentLanguage: string;
    private static _country: string;

    private ready = new Deferred<void>();
    private gamesList: Game[] = [];
    private availableGames: Game[] = [];
    private parent: CategoryModel;
    private childs: CategoryModel[] = [];

    private useAsParent: boolean = false;
    private usedMenu: string;
    private tagsData: IIndexing<string> = {};
    private merchantsList: MerchantModel[];
    private updateMerchants: boolean = false;
    private defaultSort: number = 0;
    private _slug: string;
    private _gameBlocks: IGameBlock[] = [];

    constructor(
        from: IFromLog,
        data: ICategory,
        private settings: ICategorySettings,
        private sortSetting: IGamesSortSetting,
    ) {
        super({from: _assign({model: 'CategoryModel'}, from)});
        this.init(data);
    }

    public get isReady(): Promise<void> {
        return this.ready.promise;
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get parentCategory(): CategoryModel {
        return this.parent;
    }

    public get childCategories(): CategoryModel[] {
        return this.childs || [];
    }

    public get isLastPlayed(): boolean {
        return this.slug === 'lastplayed';
    }

    public get isFavourites(): boolean {
        return this.slug === 'favourites';
    }

    public get isPopular(): boolean {
        return this.slug === 'popular';
    }

    public get isNew(): boolean {
        return this.slug === 'new';
    }

    public get isJackpots(): boolean {
        return this.slug === 'jackpots';
    }

    public get isSpecial(): boolean {
        return _includes(specialCategories, this.slug);
    }

    public get isParent(): boolean {
        return !this.parent && (
            this.useAsParent
            || this.menu === 'main-menu'
            || _includes(specialCategories, this.slug)
            || _includes(defaultParentsCategories, this.slug)
        );
    }

    public get parentId(): number {
        return _toNumber(this.tagsData.parentid);
    }

    public get title(): IIndexing<string> {
        return this.data.Trans;
    }

    public get view(): CategoryViewType {
        return this.settings?.view;
    }

    /**
     * Required user authentication for show category or not
     */
    public get authRequired(): boolean {
        return this.isLastPlayed || this.isFavourites;
    }

    /**
     * @deprecated
     */
    public get name(): string {
        return this.slug;
    }

    /**
     * Value of sort by default
     *
     * @returns {number} Value of sort
     */
    public get sort(): number {
        return this.defaultSort;
    }

    /**
     * Value of sort by currently used language
     *
     * @returns {number} Value of sort
     */
    public get sortByLang(): number {
        return !Array.isArray(this.data.CustomSort)
            ? this.data.CustomSort?.Lang?.[CategoryModel.currentLanguage]
            : undefined;
    }

    public get tags(): string[] {
        return this.data.Tags;
    }

    public get slug(): string {
        return this._slug;
    }

    public get menuId(): string {
        return this.data.menuId;
    }

    public get menu(): string {
        return this.usedMenu;
    }

    public get initedWithMenu(): boolean {
        return _has(this.tagsData, 'menu');
    }

    public get initedWithDefaultSort(): boolean {
        return !!+this.data.CSubSort;
    }

    public get icon(): string {
        return this.slug.toLowerCase();
    }

    /**
     * Get games list of current category
     *
     * @returns {Game[]}
     */
    public get games(): Game[] {
        return this.availableGames;
    }

    public get gameBlocks(): IGameBlock[] {
        return this._gameBlocks;
    }

    public get merchants(): MerchantModel[] {
        this.checkMerchants();
        return this.merchantsList;
    }

    public getBlockSettings(slug: string): ICategoryBlock {
        return this.settings?.[slug];
    }

    public setGameBlocks(gameBlocks: IGameBlock[]): void {
        this._gameBlocks = gameBlocks;
    }

    public setGames(games: Game[]): void {
        this.gamesList = games || [];
        this.availableGames = this.gamesList;
        this.sortGames();
        this.updateMerchants = true;
    }

    public addGame(game: Game, sortGames: boolean = false): void {
        this.gamesList.push(game);
        this.availableGames = this.gamesList;
        if (sortGames) {
            this.sortGames();
        }
        this.updateMerchants = true;
    }

    /**
     * Update available games for current category
     *
     * @param {Game[]} projectAvailableGames Project available for show games
     */
    public updateAvailableGames(projectAvailableGames: Game[]): void {
        this.availableGames = _intersectionBy(this.gamesList, projectAvailableGames, 'ID');
        this.sortGames();
    }

    public static get language(): string {
        return CategoryModel.currentLanguage;
    }

    public static set language(language: string) {
        CategoryModel.currentLanguage = language;
    }

    /**
     * Sets static field _country.
     * @param {string} value - The country code
     */
    public static set country(value: string) {
        CategoryModel._country = value;
    }

    /**
     * Mark category as parent category
     */
    public setAsParent(): void {
        this.parent = null;
        this.useAsParent = true;
    }

    /**
     * Set for this category parent category
     *
     * @param {CategoryModel} category Parent category
     */
    public setParentCategory(category: CategoryModel): void {
        this.parent = category;
        this.useAsParent = false;
    }

    /**
     * Set for this category child categories
     *
     * @param {CategoryModel[]} categories Child categories
     */
    public setChildCategories(categories: CategoryModel[]): void {
        this.childs = categories;
    }

    /**
     * Set used menu for this category
     *
     * @param {string} menu
     */
    public setMenu(menu: string): void {
        this.usedMenu = menu;
    }

    public hasSomeMerchant(merchants: MerchantModel[]): boolean {
        this.checkMerchants();
        for (const merchant of merchants) {
            const findedMerchant = _find(this.merchantsList, (item: MerchantModel) => {
                return item.id === merchant.id;
            });
            if (findedMerchant) {
                return true;
            }
        }
        return false;
    }

    public setDefaultSort(sort: number): void {
        this.defaultSort = sort;
    }

    public setReady(): void {
        this.ready.resolve();
    }

    public sortGames(): void {
        if (this.availableGames.length) {

            const perCountryDirection = this.sortSetting.direction?.sortPerCountry || 'asc';
            const perLangDirection = this.sortSetting.direction?.sortPerLanguage || 'asc';
            const perCatDirection = this.sortSetting.direction?.sortPerCategory || 'asc';
            const baseDirection = this.sortSetting.direction?.baseSort || 'desc';

            this.availableGames
                .sort((a, b) => {
                    const byCountry = this.compareGamesByFeature(
                        a,
                        b,
                        'sortPerCountry',
                        CategoryModel._country,
                        perCountryDirection,
                    );

                    if (!_isNil(byCountry)) {
                        return byCountry;
                    }

                    const byLang = this.compareGamesByFeature(
                        a,
                        b,
                        'sortPerLanguage',
                        CategoryModel.currentLanguage,
                        perLangDirection,
                    );

                    if (!_isNil(byLang)) {
                        return byLang;
                    }

                    const perCat = this.compareGamesByFeature(a, b, 'sortPerCategory', this.id, perCatDirection);

                    if (!_isNil(perCat)) {
                        return perCat;
                    }

                    return directions[baseDirection] * ((b.sort || 0) - (a.sort || 0));
                });
        }
    }

    protected checkMerchants(): void {
        if (!this.merchantsList || this.updateMerchants) {
            this.setAvailableMerchants();
        }
    }

    protected init(data: ICategory): void {
        this.data = data;
        this._slug = (this.data.Slug.toLowerCase() || this.data.menuId.toLowerCase())
            .replace(/\./g, '-');
        this.defaultSort = +this.data.CSubSort || +this.data.CSort || 0;
        try {
            this.tagsData = JSON.parse(this.data.Tags.join(','));
            this.usedMenu = this.tagsData.menu || '';
        } catch (err) {
        }
    }

    protected setAvailableMerchants(): void {
        this.merchantsList = [];

        let merchantIds: IIndexing<boolean> = {};

        _forEach(this.availableGames, (game: Game): void => {
            merchantIds[game.merchantID] = true;

            if (game.subMerchantID) {
                merchantIds[game.subMerchantID] = true;
            }
        });

        _forEach(GamesHelper.availableMerchants, (merchant: MerchantModel) => {
            if (merchantIds[merchant.id]) {
                this.merchantsList.push(merchant);
            }
        });
    }

    /**
     * Sorting method that compares two games by a specific feature.
     * @param {Game} a - game a
     * @param {Game} b - game b
     * @param {TGameSortFeature} feature - sorting feature
     * @param {string | number} suffix - specified field in feature
     * @param {TSortDirection} direction - sort direction
     * @returns {number | null} - sorting results
     */
    protected compareGamesByFeature(
        a: Game,
        b: Game,
        feature: TGameSortFeature,
        suffix: string | number,
        direction: TSortDirection,
    ): number | null {
        const perA = _isNil(a[feature]?.[suffix] || null);
        const perB = _isNil(b[feature]?.[suffix] || null);
        if (perA && !perB) {
            return 1;
        } else if (!perA && perB) {
            return -1;
        } else if (!perA && !perB && b[feature][suffix] !== a[feature][suffix]) {
            return directions[direction] * (b[feature][suffix] - a[feature][suffix]);
        }
        return null;
    };
}
