import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';

import {
    AbstractModel,
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IStoreItem,
} from '../interfaces/store.interface';
import {StoreService} from '../services';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';

export class StoreItem extends AbstractModel<IStoreItem> {
    public bonus: Bonus;
    protected userCurrency: string;
    private $availableForLevels: number[] = [];

    constructor(
        from: IFromLog,
        data: IStoreItem,
        protected ConfigService: ConfigService,
        protected StoreService: StoreService,
    ) {
        super({from: _assign({model: 'StoreItem'}, from)});
        this.userCurrency = this.ConfigService.get<string>('appConfig.user.currency')
            || this.ConfigService.get<string>('$base.defaultCurrency');
        this.data = data;
    }

    /**
     * Check has storeItem current category or not
     *
     * @param {string} categoryId Category id
     * @returns {boolean}
     */
    public hasCategory(categoryId: string): boolean {
        return _includes(this.data.Categories, categoryId);
    }

    public set data(data: IStoreItem) {
        super.data = data;
        this.$availableForLevels = _map(this.data.AvailableForLevels.split(','), (item: string) => _toNumber(item));
    }

    public get data(): IStoreItem {
        return super.data;
    }

    public get availableForLevels(): number[] {
        return this.$availableForLevels;
    }

    public get creditTournamentPoints(): number {
        return _toNumber(this.data.CreditTournamentPoints);
    }

    public get description(): string {
        return this.data.Description;
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get image(): string {
        return this.data.Image;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get order(): number {
        return _toNumber(this.data.Order);
    }

    public get quantity(): number {
        return _toNumber(this.data.Quantity);
    }

    public get repeatBuyRestriction(): number {
        return _toNumber(this.data.RepeatBuyRestriction);
    }

    public get status(): number {
        return _toNumber(this.data.Status);
    }

    public get idBonus(): number {
        return _toNumber(this.data?.IDBonus);
    }

    /**
     * @returns {boolean} is can buy
     */
    public get canBuy(): boolean {
        return !!this.quantity;
    }

    /**
     * @returns {number} price in loyalty points
     */
    public get priceLoyalty(): number {
        return _toNumber(this.data.Price.LOYALTY);
    }

    /**
     * @returns {number} price in experience points
     */
    public get priceExp(): number {
        return _toNumber(this.data.Price.EXPERIENCE);
    }

    /**
     * @returns {number} money value of store item
     */
    public get moneyValue(): number {
        return !!_toNumber(this.data.Price[this.userCurrency]) ?
            _toNumber(this.data.Price[this.userCurrency]) :
            _toNumber(this.data.Price.EUR);
    }

    /**
     * @returns {boolean} is money value of store item only in EUR
     */
    public get moneyValueEUR(): boolean {
        return !_toNumber(this.data.Price[this.userCurrency]);
    }

    /**
     * @returns {boolean} is bonus
     */
    public get isBonus(): boolean {
        return _has(this.data, 'IDBonus');
    }

    /**
     * @returns {string} item type text for tag
     */
    public get itemType(): string {
        if (!this.isBonus && this.moneyValue) {
            return gettext('Money');
        }

        if (this.isBonus && !this.moneyValue) {
            return gettext('Bonus');
        }

        if (this.isBonus && this.moneyValue) {
            return gettext('Money + Bonus');
        }

        if (this.creditTournamentPoints) {
            return gettext('Tournament points');
        }

        return gettext('Real gift');
    }

    /**
    * @returns {number} is available
    */
    public get isAvailable(): number {
        return _toNumber(this.data.IsItemAvailable);
    }
}
