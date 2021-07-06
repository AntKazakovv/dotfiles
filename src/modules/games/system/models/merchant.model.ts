import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IMerchant} from 'wlc-engine/modules/games';
import _toNumber from 'lodash-es/toNumber';

export class MerchantModel extends AbstractModel<IMerchant> {

    constructor(
        data: IMerchant,
    ) {
        super();
        this.init(data);
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get parentId(): number {
        return _toNumber(this.data.IDParent);
    }

    public get name(): string {
        return this.data.Name;
    }

    public get image(): string {
        return this.data.Image;
    }

    public get alias(): string {
        return this.data.Alias;
    }

    public get menuId(): string {
        return this.data.menuId;
    }

    public get wlcElement(): string {
        return 'block_merchant-' + this.alias.toLowerCase();
    }

    protected init(data: IMerchant): void {
        this.data = data;
    }
}
