import {ICategory, IGames, IMerchant} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';

import {
    toNumber as _toNumber,
    includes as _includes,
} from 'lodash-es';

export class CategoryModel extends AbstractModel<ICategory> {

    private gamesList: Game[] = [];
    private parent: CategoryModel;
    private childs: CategoryModel[] = [];
    private specialCategories = ['casino', 'lastplayed', 'favourites', 'last-played'];

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

    public get isParent(): boolean {
        return !this.parent && (this.menu === 'main-menu' || _includes(this.specialCategories, this.slug));
    }

    public get parentId(): number {
        // TODO Delete after improve fundist
        let data: IIndexing<string | number>;
        try {
            data = JSON.parse(this.data.Tags.join(','));
        } catch (err) {
            return;
        }
        return _toNumber(data.parentid);
    }

    public get title(): IIndexing<string> {
        return this.data.Trans;
    }

    public get name(): string {
        return this.slug || this.data.menuId;
    }

    public get sort(): number {
        return _toNumber(this.data.CSubSort);
    }

    public get tags(): string[] {
        return this.data.Tags;
    }

    public get slug(): string {
        return this.data.Slug;
    }

    public get menuId(): string {
        return this.data.menuId;
    }

    public get menu(): string {
        // TODO Delete after improve fundist
        let data: IIndexing<string | number>;
        try {
            data = JSON.parse(this.data.Tags.join(','));
        } catch (err) {
            return '';
        }
        return data.menu as string;
    }

    public get icon(): string {
        return `category-${this.slug}`;
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

    protected init(data: ICategory): void {
        this.data = data;
    }
}
