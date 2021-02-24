import {ICategory, IGames, IMerchant} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

import {
    toNumber as _toNumber,
    includes as _includes,
    has as _has,
} from 'lodash-es';

export class CategoryModel extends AbstractModel<ICategory> {

    private gamesList: Game[] = [];
    private parent: CategoryModel;
    private childs: CategoryModel[] = [];
    private specialCategories = ['casino', 'lastplayed', 'favourites', 'last-played'];
    private usedMenu: string;
    private tagsData: IIndexing<string> = {};
    private defaultSort: number = 0;

    constructor(
        data: ICategory,
    ) {
        super();
        this.init(data);
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

    public get isSpecial(): boolean {
        return _includes(this.specialCategories, this.slug);
    }

    public get isParent(): boolean {
        return !this.parent && (this.menu === 'main-menu' || _includes(this.specialCategories, this.slug));
    }

    public get parentId(): number {
        return _toNumber(this.tagsData.parentid);
    }

    public get title(): IIndexing<string> {
        return this.data.Trans;
    }

    public get name(): string {
        return this.slug || this.data.menuId;
    }

    public get sort(): number {
        return this.defaultSort;
    }

    public get tags(): string[] {
        return this.data.Tags;
    }

    public get slug(): string {
        return this.data.Slug.toLowerCase();
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
        return !!this.data.CSubSort;
    }

    public get icon(): string {
        return this.slug.toLowerCase();
    }

    public get games(): Game[] {
        return this.gamesList;
    }

    public setGames(games: Game[]): void {
        this.gamesList = games || [];
    }

    public addGame(game: Game): void {
        this.gamesList.push(game);
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

    public setDefaultSort(sort: number): void {
        this.defaultSort = sort;
    }

    protected init(data: ICategory): void {
        this.data = data;
        this.defaultSort = _toNumber(this.data.CSubSort) || 0;
        try {
            this.tagsData = JSON.parse(this.data.Tags.join(','));
            this.usedMenu = this.tagsData.menu || '';
        } catch (err) {
        }
    }
}
