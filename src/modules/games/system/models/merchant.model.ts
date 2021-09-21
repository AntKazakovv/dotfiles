import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IMerchant} from 'wlc-engine/modules/games';
import {
    IFromLog,
    IIndexing,
} from 'wlc-engine/modules/core';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

export class MerchantModel extends AbstractModel<IMerchant> {

    constructor(
        from: IFromLog,
        data: IMerchant,
    ) {
        super({from: _assign({model: 'MerchantModel'}, from)});
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

    /**
     * return merchant setting
     */
    public get settings(): IIndexing<any> {
        return this.data.Settings;
    }

    /**
     * return DGA_URL for PragmaticPlayLive merchant
     */
    public get dgaUrl(): string {
        return this.settings?.DGA_URL;
    }

    /**
     * return CASINO_ID for PragmaticPlayLive merchant
     */
    public get casinoID(): string {
        return this.settings?.CASINO_ID;
    }

    protected init(data: IMerchant): void {
        this.data = data;
    }
}
