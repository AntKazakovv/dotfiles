import {
    ICategory,
    IGameBlock,
} from 'wlc-engine/modules/games';
import {
    ICategorySettings,
    CategoryViewType,
    ICategoryBlock,
    IFromLog,
} from 'wlc-engine/modules/core';
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
import _orderBy from 'lodash-es/orderBy';

export class CategoryModel extends AbstractModel<ICategory> {

    private ready = new Deferred<void>();
    private gamesList: Game[] = [];
    private parent: CategoryModel;
    private childs: CategoryModel[] = [];
    private specialCategories = ['casino', 'lastplayed', 'favourites', 'last-played'];
    private defaultParents = ['new', 'popular'];
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
        return _includes(this.specialCategories, this.slug);
    }

    public get isParent(): boolean {
        return !this.parent && (this.menu === 'main-menu'
                || _includes(this.specialCategories, this.slug)
                || _includes(this.defaultParents, this.slug));
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
     * @deprecated
     */
    public get name(): string {
        return this.slug;
    }

    public get sort(): number {
        return this.defaultSort;
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

    public setParentCategory(category: CategoryModel): void {
        this.parent = category;
    }

    public setChildCategories(categories: CategoryModel[]): void {
        this.childs = categories;
    }

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
            this.gamesList = _orderBy(this.gamesList, (game: Game) => game.sortPerCategory[this.id] || game.sort, 'desc');
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
