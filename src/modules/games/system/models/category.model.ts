import {ICategory, IGames, IMerchant} from 'wlc-engine/modules/games/system/interfaces/games.interfaces';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';

import {
    toNumber as _toNumber,
} from 'lodash';

export class CategoryModel extends AbstractModel<ICategory> {

    constructor(
        data: ICategory,
    ) {
        super();
        this.init(data);
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get parentId(): number {
        // TODO Delete after improve fundist
        let data: IIndexing<any>;
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

    protected init(data: ICategory): void {
        this.data = data;
    }
}
