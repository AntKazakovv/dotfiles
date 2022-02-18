import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';

import {
    AbstractModel,
    IFromLog,
} from 'wlc-engine/modules/core';
import {IStoreCategory} from 'wlc-engine/modules/store/system/interfaces/store.interface';

export class StoreCategory extends AbstractModel<IStoreCategory> {

    constructor(
        from: IFromLog,
        data: IStoreCategory,
    ) {
        super({from: _assign({model: 'StoreCategory'}, from)});
        this.data = data;
    }

    /**
     * Category id
     *
     * @returns {number}
     */
    public get id(): number {
        return _toNumber(this.data.ID);
    };

    /**
     * Category name
     *
     * @returns {string}
     */
    public get name(): string {
        return this.data.Name;
    };

    /**
     * Store category order
     *
     * @returns {string}
     */
    public get order(): number {
        return _toNumber(this.data.Order);
    };

    /**
     * Enabled or not store category.
     *
     * @returns {boolean} If true category enabled
     */
    public get isEnabled(): boolean {
        return this.data.Status === '1';
    };

    /**
     * Check is "all goods" category
     *
     * @returns {boolean}
     */
    public get isAllGoods(): boolean {
        return this.id === 0;
    }
}
