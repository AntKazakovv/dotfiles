import {
    ICategorySettings,
    CategoryViewType,
    ICategoryBlock,
} from 'wlc-engine/modules/core/system/interfaces/categories.interface';
import {
    ICategory,
    IGameBlock,
    IGamesSortSetting,
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

import _assign from 'lodash-es/assign';
import _includes from 'lodash-es/includes';
import _toNumber from 'lodash-es/toNumber';
import _has from 'lodash-es/has';
import _forEach from 'lodash-es/forEach';
import _find from 'lodash-es/find';
import _isNil from 'lodash-es/isNil';

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

    private static currentLanguage: string;

    private ready = new Deferred<void>();
    private gamesList: Game[] = [];
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
        return this.data.CustomSort?.Lang?.[CategoryModel.currentLanguage];
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

    public get games(): Game[] {
        return this.gamesList;
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
        this.sortGames();
        this.updateMerchants = true;
    }

    public addGame(game: Game, sortGames: boolean = false): void {
        this.gamesList.push(game);
        if (sortGames) {
            this.sortGames();
        }
        this.updateMerchants = true;
    }

    public static get language(): string {
        return CategoryModel.currentLanguage;
    }

    public static set language(language: string) {
        CategoryModel.currentLanguage = language;
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
        if (this.gamesList.length) {

            const perLangDirection = this.sortSetting.direction?.sortPerLanguage || 'asc';
            const perCatDirection = this.sortSetting.direction?.sortPerCategory || 'asc';
            const baseDirection = this.sortSetting.direction?.baseSort || 'desc';

            const lang = CategoryModel.currentLanguage;

            this.gamesList
                .sort((a, b) => {
                    const perLangA = _isNil(a.sortPerLanguage[lang] || null);
                    const perLangB = _isNil(b.sortPerLanguage[lang] || null);

                    if (perLangA && !perLangB) {
                        return 1;
                    } else if (!perLangA && perLangB) {
                        return -1;
                    } else if (!perLangA && !perLangB && b.sortPerLanguage[lang] !== a.sortPerLanguage[lang]) {
                        return directions[perLangDirection] * (b.sortPerLanguage[lang] - a.sortPerLanguage[lang]);
                    }

                    const perCatA = _isNil(a.sortPerCategory[this.id] || null);
                    const perCatB = _isNil(b.sortPerCategory[this.id] || null);

                    if (perCatA && !perCatB) {
                        return 1;
                    } else if (!perCatA && perCatB) {
                        return -1;
                    } else if (!perCatA && !perCatB && a.sortPerCategory[this.id] !== b.sortPerCategory[this.id]) {
                        return directions[perCatDirection]
                            * (b.sortPerCategory[this.id] - a.sortPerCategory[this.id]);
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
        this.defaultSort = _toNumber(this.data.CSubSort) || 0;
        try {
            this.tagsData = JSON.parse(this.data.Tags.join(','));
            this.usedMenu = this.tagsData.menu || '';
        } catch (err) {
        }
    }

    protected setAvailableMerchants(): void {
        this.merchantsList = [];

        let merchantIds: IIndexing<boolean> = {};
        _forEach(this.gamesList, (game) => {
            merchantIds[game.merchantID] = true;
        });

        _forEach(GamesHelper.availableMerchants, (merchant: MerchantModel) => {
            if (merchantIds[merchant.id]) {
                this.merchantsList.push(merchant);
            }
        });
    }
}
