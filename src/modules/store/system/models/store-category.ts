import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _isObject from 'lodash-es/isObject';

import {
    AbstractModel,
    IFromLog,
    IIndexing,
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

    /**
     * Category name
     *
     * @param {string} lang Language for get category name
     * @returns {string} Category name
     */
    public name(lang?: string): string {
        return _isObject(this.data.Name) ? this.data.Name[lang] || this.data.Name['en'] : this.data.Name;
    };

    /**
     * Category name with translations on different languages
     *
     * @returns {IIndexing<string>} Category name translations
     */
    public nameTranslations(): IIndexing<string> {
        return _isObject(this.data.Name) ? this.data.Name : {};
    };
}
