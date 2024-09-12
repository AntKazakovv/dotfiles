import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

import {BehaviorSubject} from 'rxjs';
import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _includes from 'lodash-es/includes';
import _map from 'lodash-es/map';
import _has from 'lodash-es/has';

import {
    AbstractModel,
    ConfigService,
    IFromLog,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {
    IDisabledItemInfo,
    IStoreItem,
    IStoreItemPriceMoney,
} from '../interfaces/store.interface';
import {StoreService} from '../services';
import {Bonus} from 'wlc-engine/modules/bonuses';
import {UserProfile} from 'wlc-engine/modules/user';
import {IAmount} from 'wlc-engine/modules/multi-wallet';

export class StoreItem extends AbstractModel<IStoreItem> {
    public bonus: Bonus;
    protected userCurrency: string;
    protected useConversionInFiat: boolean;
    private $availableForLevels: number[] = [];

    constructor(
        from: IFromLog,
        data: IStoreItem,
        protected ConfigService: ConfigService,
        protected storeService: StoreService,
    ) {
        super({from: _assign({model: 'StoreItem'}, from)});
        this.userCurrency = this.ConfigService.get<string>('appConfig.user.currency')
            || this.ConfigService.get<string>('$base.defaultCurrency');
        this.data = data;

        const userProfile: UserProfile
            = this.ConfigService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue();

        if (userProfile) {
            this.useConversionInFiat = userProfile.isConversionInFiat;
        }
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

    /**
     * Check whether user has access by his level
     *
     * @param {number} userLevel User level
     * @returns {boolean}
     */
    public hasUserAccessByLevel(userLevel: number): boolean {
        return _includes(this.availableForLevels, userLevel);
    }

    /**
     * @returns {string} Disabled message for info modal
     */
    public getItemDisabledInfo(userLevel: number): IDisabledItemInfo {
        if (!this.isAvailable) {
            return {
                messageText: gettext('This item will become available for purchase when you ' +
                    'have no active bonuses left'),
                btnText: gettext('Unavailable'),
            };
        }

        if (!this.hasUserAccessByLevel(userLevel)) {
            return {
                messageText: gettext('This item is not available to you at the current level'),
                btnText: gettext('Unavailable for current level'),
            };
        }

        if (this.nextDateAvailable) {
            return {
                messageText: gettext('The item is temporarily unavailable for a repeated purchase. ' +
                    'Please try again later'),
                btnText: gettext('Temporarily unavailable'),
            };
        }

        return {};
    }

    public isItemDisabled(userLevel: number): boolean {
        return !this.isAvailable
            || !this.hasUserAccessByLevel(userLevel)
            || this.nextDateAvailable;
    }

    public override set data(data: IStoreItem) {
        super.data = data;
        this.$availableForLevels = _map(this.data.AvailableForLevels.split(','), (item: string) => _toNumber(item));
    }

    public override get data(): IStoreItem {
        return super.data;
    }

    public get timerValue(): Dayjs {
        const defaultTime: Dayjs = dayjs(this.data.NextDateAvailable, 'YYYY-MM-DD HH:mm:ss');
        return defaultTime.add(dayjs().utcOffset(), 'minute');
    }

    public get nextDateAvailable(): boolean {
        return this.data.NextDateAvailable ? this.timerValue.unix() > dayjs().unix() : false;
    }

    public get availableForLevels(): number[] {
        return this.$availableForLevels;
    }

    public get creditTournamentPoints(): number {
        return _toNumber(this.data.CreditTournamentPoints);
    }

    public get description(): string {
        return this.data.Description.replace('storeItem.Price.LOYALTY', 'data.storeItem.priceLoyalty');
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get image(): string {
        return GlobalHelper.proxyUrl(this.data.Image);
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

    public get priceMoney(): IStoreItemPriceMoney {
        return this.data.PriceMoney;
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

        switch (this.data.Type) {
            case 'MoneyBonus':
                return gettext('Money + Bonus');
            case 'TournamentPoints':
                return gettext('Tournament points');
            default:
                return this.data.Type;
        }
    }

    /**
    * @returns {number} is available
    */
    public get isAvailable(): number {
        return _toNumber(this.data.IsItemAvailable);
    }

    public get type(): string {
        return this.data.Type;
    }

    /** Returns store-item price */
    public getPriceAmount(currency: string): IAmount[] {
        const amount: IAmount[] = [];

        if (this.priceLoyalty) {
            amount.push({
                value: this.priceLoyalty,
                currency: 'LP',
            });
        }

        if (this.priceExp) {
            amount.push({
                value: this.priceExp,
                currency: 'EP',
            });
        }

        if (this.type === 'Bonus' && this.priceMoney) {
            const moneyAmount = this.getMoneyPriceAmount(currency);

            if (moneyAmount.value) {
                amount.push(moneyAmount);
            }
        }

        return amount;
    }

    /** Returns store-item value */
    public getValueAmount(currency: string): IAmount[] {
        const amount: IAmount[] = [];

        let value: number = Number(this.data.Price[currency.toUpperCase()]);
        let conversionCurrency: string = null;

        if (!value) {
            value = Number(this.data.Price['EUR']);
            conversionCurrency = 'EUR';
        }

        if (this.useConversionInFiat) {
            value = Number(this.data.Price[this.storeService.walletsService?.conversionCurrency.toUpperCase()]);

            if (!value) {
                value = Number(this.data.Price['EUR']) * this.storeService.walletsService?.coefficientConversionEUR;
            }

            conversionCurrency = this.storeService.walletsService?.conversionCurrency;
        }

        amount.push({
            value: value,
            currency: currency,
            conversionCurrency,
        });

        return amount;
    }

    protected getMoneyPriceAmount(currency: string): IAmount {
        let moneyPrice: number = Number(this.priceMoney[currency.toUpperCase()]);
        let conversionCurrency: string = null;

        if (!moneyPrice) {
            moneyPrice = Number(this.priceMoney['EUR']);
            conversionCurrency = 'EUR';
        }

        if (moneyPrice) {

            if (this.useConversionInFiat) {
                const originalPrice: string =
                    this.priceMoney[this.storeService.walletsService?.conversionCurrency.toUpperCase()];

                moneyPrice = Number(originalPrice)
                    || Number(this.priceMoney['EUR']) * this.storeService.walletsService?.coefficientConversionEUR;
                conversionCurrency = this.storeService.walletsService?.conversionCurrency.toLowerCase();
            }

            return {
                value: Number(moneyPrice),
                currency,
                conversionCurrency,
            };
        }
    }
}
