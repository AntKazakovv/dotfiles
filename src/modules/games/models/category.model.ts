import {ICategory} from 'wlc-engine/modules/games/interfaces/games.interfaces';
import {IIndexing} from 'wlc-engine/interfaces';

import {
    toNumber as _toNumber,
} from 'lodash';

export class CategoryModel {

    constructor(
        protected data: ICategory,
    ) {
    }

    public get id(): string {
        return this.data.ID;
    }

    public get parentId(): string {
        // TODO Delete after improve fundist
        let data: IIndexing<any>;
        try {
            data = JSON.parse(this.data.Tags.join(','));
        } catch (err) {
            return '';
        }
        return data.parentid;
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
        let data: IIndexing<any>;
        try {
            data = JSON.parse(this.data.Tags.join(','));
        } catch (err) {
            return '';
        }
        return data.menu;
    }

    public get icon(): string {
        // TODO Delete after improve fundist
        let data: IIndexing<any>;
        try {
            data = JSON.parse(this.data.Tags.join(','));
        } catch (err) {
            return '';
        }
        return data.icon;
    }
}
