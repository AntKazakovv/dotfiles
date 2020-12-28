import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {
    IBonus,
    IBonusConditions,
    IBonusImageType,
    ActionType,
} from '../interfaces/bonuses.interface';
import {BonusesService} from '../../system/services';
import {DateTime} from 'luxon';

import {
    get as _get,
    toNumber as _toNumber,
    isNumber as _isNumber,
    isString as _isString,
    toString as _toString,
    isObject as _isObject,
    isArray as _isArray,
    floor as _floor,
    each as _each,
    filter as _filter,
    includes as _includes,
    extend as _extend,
    unset as _unset,
    remove as _remove,
    size as _size,
    keys as _keys,
    map as _map,
} from 'lodash';

export class Bonus extends AbstractModel<IBonus> {
    public isReady: Boolean = true;
    public isChoose: Boolean = false;
    protected userCurrency: string;

    constructor(
        data: IBonus,
        protected ConfigService: ConfigService,
        protected bonusesService: BonusesService,
    ) {
        super();
        this.data = this.modifyData(data);
        this.userCurrency = this.ConfigService.get<string>('appConfig.user.currency') || 'EUR';
    }

    // default
    public get active(): boolean {
        return !!this.data.Active;
    }

    public get affiliateSystem(): string {
        return this.data.AffiliateSystem;
    }

    public get affiliateUrl(): string {
        return this.data.AffiliateUrl;
    }

    public get allowCatalog(): boolean {
        return !!_toNumber(this.data.AllowCatalog);
    }

    public get allowStack(): boolean {
        return !!_toNumber(this.data.AllowStack);
    }

    public get awardWageringTotal(): number {
        return this.data.AwardWageringTotal;
    }

    public get amountMax(): IIndexing<string> {
        return this.data.AmountMax;
    }

    public get amountMin(): IIndexing<string> {
        return this.data.AmountMin;
    }

    public get balance(): number {
        return this.data.Balance;
    }

    public get block(): number {
        return _toNumber(this.data.Block);
    }

    public get bonus(): number {
        return _toNumber(this.data.Bonus);
    }

    public get bonusAwarded(): number {
        return _toNumber(this.data.BonusAwarded);
    }

    public get bonusBalance(): number {
        return _toNumber(this.data.BonusBalance);
    }

    public get bonusType(): string {
        return this.data.BonusType;
    }

    public get bonusWinning(): number {
        return _toNumber(this.data.BonusWinning);
    }

    public get currency(): string {
        return this.data.Currency;
    }

    public get description(): string {
        return this.data.Description;
    }

    public get disableCancel(): boolean {
        return !!_toNumber(this.data.DisableCancel);
    }

    public get date(): string {
        return this.data.Date;
    }

    public get event(): string {
        return this.data.Event;
    }

    public get eventAmount(): number {
        return _toNumber(this.data.EventAmount);
    }

    public get experienceAction(): string {
        return this.data.ExperienceAction;
    }

    public get experiencePoints(): number {
        return _toNumber(this.data.ExperiencePoints);
    }

    public get expire(): string {
        return this.data.Expire;
    }

    public get expireDate(): string {
        return this.data.ExpireDate;
    }

    public get expireDays(): number {
        return _toNumber(this.data.ExpireDays);
    }

    public get expireAction(): string {
        return this.data.ExpireAction;
    }

    public get end(): string {
        return this.data.End;
    }

    public get ends(): string {
        return this.data.Ends;
    }

    public get freeroundComplete(): number {
        return _toNumber(this.data.FreeroundComplete);
    }

    public get freeroundCount(): number {
        return _toNumber(this.data.FreeroundCount);
    }

    public get freeRoundWagering(): number {
        return _toNumber(this.data.FreeRoundWagering);
    }

    public get freeroundWinning(): number {
        return _toNumber(this.data.FreeroundWinning);
    }

    public get group(): string {
        return this.data.Group;
    }

    public get id(): number {
        return _toNumber(this.data.ID);
    }

    public get idActivator(): string {
        return this.data.IDActivator;
    }

    public get idPiFilter(): string {
        return this.data.IDPiFilter;
    }

    public get image(): string {
        return this.data.Image;
    }

    public get imageOther(): string {
        return this.data.Image_other;
    }

    public get imagePromo(): string {
        return this.data.Image_promo;
    }

    public get imageReg(): string {
        return this.data.Image_reg;
    }

    public get imageStore(): string {
        return this.data.Image_store;
    }

    public get inventoried(): boolean {
        return !!this.data.Inventoried;
    }

    public get isInventory(): boolean {
        return !!_toNumber(this.data.IsInventory);
    }

    public get LBID(): string {
        return this.data.LBID;
    }

    public get limitation(): string {
        return this.data.Limitation;
    }

    public get loyaltyPoints(): number {
        return _toNumber(this.data.LoyaltyPoints);
    }

    public get maxBet(): number{
        return _toNumber(this.data.MaxBet[this.userCurrency]) ||
            _toNumber(this.data.MaxBet?.EUR) ||
            _toNumber(this.data.Conditions?.MaxBet?.Currency) ||
            _toNumber(this.data.Conditions?.MaxBet?.EUR) || 0;
    }

    public get minBet(): number {
        return _toNumber(this.data.MinBet[this.userCurrency]) ||
            _toNumber(this.data.MinBet?.EUR) ||
            _toNumber(this.data.Conditions?.MinBet?.Currency) ||
            _toNumber(this.data.Conditions?.MinBet?.EUR) || 0;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get promoCode(): string {
        return _isNumber(this.data.PromoCode) ? '' : this.data.PromoCode;
    }

    public get hasPromoCode(): boolean {
        return _isNumber(this.data.PromoCode) ? !!this.data.PromoCode : !!this.data.PromoCode.length;
    }

    public get promoCodeUsed(): string {
        return this.data.PromoCodeUsed;
    }

    public get realWinning(): number {
        return _toNumber(this.data.RealWinning);
    }

    public get releaseWageringTotal(): number {
        return this.data.ReleaseWageringTotal;
    }

    public get results(): any {
        return this.data.Results;
    }

    public get selected(): boolean {
        return !!this.data.Selected;
    }

    public get sportSettings(): string {
        return this.data.SportSettings;
    }

    public get status(): number {
        return _toNumber(this.data.Status);
    }

    public get starts(): string {
        return this.data.Starts;
    }

    public get target(): string {
        return this.data.Target;
    }

    public get terms(): string {
        return this.data.Terms;
    }

    public get totalWinning(): number {
        return _toNumber(this.data.TotalWinning);
    }

    public get type(): string {
        return this.data.Type;
    }

    public get wagering(): number {
        return _toNumber(this.data.Wagering);
    }

    public get wageringLeft(): number {
        return _toNumber(this.data.WageringLeft);
    }

    public get wageringTo(): string {
        return this.data.WageringTo;
    }

    public get wageringTotal(): number {
        return _toNumber(this.data.WageringTotal);
    }

    public get wageringType(): string {
        return this.data.WageringType;
    }

    public get conditions(): IBonusConditions {
        return this.data.Conditions || {};
    }

    // additional
    /**
     * @returns {boolean} is bonus active
     */
    public get isActive(): boolean {
        return this.status == 1 && this.active;
    }

    /**
     * @returns {boolean} is bonus subscribed
     */
    public get isSubscribed(): boolean {
        return this.status == 1 && this.selected && !this.active;
    }

    /**
     * @returns {boolean} is can subscribe bonus
     */
    public get canSubscribe(): boolean {
        return this.status == 1 && !this.selected && !this.active && !this.inventoried;
    }

    /**
     * @returns {boolean} is can unsubscribe bonus
     */
    public get canUnsubscribe(): boolean {
        return this.isSubscribed || this.inventoried;
    }

    /**
     * @returns {number} bonus min deposit
     */
    public get minDeposit(): number {
        return _toNumber(this.amountMin[this.userCurrency]) ||
            _toNumber(this.amountMin?.EUR) ||
            _toNumber(this.conditions?.AmountMin?.Currency) ||
            _toNumber(this.conditions?.AmountMin?.EUR) || 0;
    }

    /**
     * @returns {number} bonus max deposit
     */
    public get maxDeposit(): number {
        return _toNumber(this.amountMax[this.userCurrency]) ||
            _toNumber(this.amountMax?.EUR) ||
            _toNumber(this.conditions?.AmountMax?.Currency) ||
            _toNumber(this.conditions?.AmountMax?.EUR) || 0;
    }

    /**
     * @returns {number} multiplier for relative bonus
     */
    public get multiplier(): number {
        if (this.results[this.target]?.Type === 'relative') {
            return _toNumber(this.results[this.target]?.Value) / 100;
        }
    }

    /**
     * @returns {number} bonus max win value
     */
    public get maxWin(): number {
        return _toNumber(this.conditions?.MaxBonusWin?.Currency) ||
            _toNumber(this.conditions?.MaxBonusWin?.EUR) ||
            _toNumber(this.conditions?.MaxBonusWinCoef) || 0;
    }

    /**
     * @returns {boolean} is bonus max win relative
     */
    public get isMaxWinRelative(): boolean {
        return !this.conditions?.MaxBonusWin?.EUR && !!this.conditions?.MaxBonusWinCoef;
    }

    /**
     * @returns {number} bonus limit value
     */
    public get limitAmount(): number {
        if (this.results[this.target].Type === 'relative') {
            return _toNumber(this.results?.bonus?.LimitValue[this.userCurrency]) ||
                _toNumber(this.results[this.target].LimitValue?.EUR) || 0;
        }
    }

    /**
     * @returns {boolean} is bonus limit in EUR (need for experience and loyalty bonuses)
     */
    public get isLimitAmountEUR(): boolean {
        return !this.results?.balance?.LimitValue[this.userCurrency] && !! this.results?.balance?.LimitValue?.EUR;
    }

    /**
     * @returns {number} bonus wager value
     */
    public get wager(): number {
        const resultsTarget = this.results[this.target];
        if (this.target === 'balance') {
            return _toNumber(this.results?.balance?.ReleaseWagering) || 0;
        } else {
            return _toNumber(resultsTarget?.AwardWagering?.COEF) || _toNumber(resultsTarget?.AwardWagering[this.userCurrency]) ||
                _toNumber(resultsTarget?.AwardWagering?.EUR) || 0;
        }
    }

    /**
     * @returns {boolean} bonus wagering type is absolute
     */
    public get isWagerAbsolute(): boolean {
        return this.target !== 'balance' && this.results[this.target]?.WageringType === 'absolute';
    }

    /**
     * @returns {boolean} is bonus wager in EUR (need for experience and loyalty bonuses)
     */
    public get isWagerEUR(): boolean {
        const resultsTarget = this.results[this.target];
        if (this.isWagerAbsolute) {
            return !resultsTarget?.AwardWagering[this.userCurrency] && !!resultsTarget?.AwardWagering?.EUR;
        }
    }

    /**
     * @returns {number} bonus value
     */
    public get value(): number {
        const resultsTarget = this.results[this.target];
        if(!resultsTarget) {
            return 0;
        }
        if (this.target === 'loyalty' || this.target === 'experience') {
            return resultsTarget?.Type === 'relative' ? _toNumber(resultsTarget?.Value) : _toNumber(resultsTarget?.Value?.EUR);
        } else {
            return _toNumber(resultsTarget?.Value[this.userCurrency]) || _toNumber(resultsTarget?.Value?.Currency) ||
                _toNumber(resultsTarget?.Value?.EUR) || _toNumber(resultsTarget?.Value);
        }
    }

    /**
     * @returns {string} bonus limitation text ('Winnings + Deposit', 'Winnings', 'Full lock', 'No lock')
     */
    public get limitationText(): string {

        let str: string = '';
        switch (this.limitation) {
            case 'winevent':
                str = 'Winnings + Deposit';
                break;
            case 'win':
                str = 'Winnings';
                break;
            case 'all':
                str = 'Full lock';
                break;
            default:
                str = 'No lock';
                break;
        }
        return str;
    }

    /**
     * @returns {string} bonus stacking text (Allowed or Restricted)
     */
    public get stackingText(): string {
        return this.allowStack ? 'Allowed' : 'Restricted';
    }

    /**
     * @returns {string} bonus status text
     */
    public get statusText(): string {
        if (this.isActive) {
            return 'Active';
        } else if (this.isSubscribed) {
            return 'Subscribe';
        } else if (this.inventoried) {
            return 'Inventory';
        }
        return '';
    }

    /**
     * @returns {string} bonus target name
     */
    public get viewTarget(): string {
        const resultsTarget = this.results[this.target];
        if(!resultsTarget) {
            return 'default';
        }

        if (resultsTarget?.Type === 'relative') {
            return 'relative';
        } else {
            return this.target;
        }
    }

    /**
     * Get bonus image url by type
     *
     * @param type image type ('default' | 'reg' | 'deposit' | 'promo' | 'store' | 'other')
     * @returns {string} bonus image url
     */
    public getImageByType(type: IBonusImageType = 'default'): string {
        switch (type) {
            case 'reg':
                return this.imageReg;
            case 'store':
                return this.imageStore;
            case 'promo':
                return this.imagePromo;
            case 'other':
                return this.imageOther;
        }
        return this.image;
    }

    /**
     * Get bonus wagering progress in percent
     *
     * @param {boolean} rounded - (no required) round result
     * @returns {number} bonus wagering progress (0 - 100)
     */
    public getProgress(rounded?: boolean): number {
        let progress: number;

        if (!this.wageringTotal)  {
            progress = !this.wagering ? 100 : 0;
        } else {
            progress = this.wagering / this.wageringTotal * 100;
        }

        return rounded ? _floor(progress) : progress;
    }

    /**
     * Formatted bonus expiration time
     *
     * @param {string} format date format by luxon plugin
     * @returns {string} formatted date
     */
    public expirationTime(format: string = 'D T'): string {
        const defaultTime = DateTime.fromSQL(this.data.Expire);
        const offsetTime = defaultTime.plus({minutes: defaultTime.offset});
        return offsetTime.setLocale(defaultTime.locale).toFormat(format);
    }

    /**
     * Add bonus to local storage
     *
     * @param type action type ('inventory' | 'cancel' | 'subscribe' | 'unsubscribe')
     */
    public addToLocalStorage(type: ActionType): void {
        const target = this.results[this.target];
        if (this.event === 'sign up'
            && type === 'subscribe'
            && ((this.target === 'balance' && _toString(target?.ReleaseWagering) === '0')
                || (this.target !== 'balance'
                    && ((_toString(target?.AwardWagering?.COEF) === '0')
                        || (_toString(target?.AwardWagering?.EUR) === '0'))
                )
            )) {
            return;
        }

        let ls: IIndexing<number[]>;

        try {
            ls = JSON.parse(localStorage.getItem('wlc.bonuses') || '{}');
        } catch {
            ls = {};
        }
        if (ls.hasOwnProperty(type) && _isArray(ls[type]) && !_includes(ls[type], this.id)) {
            ls[type].push(this.id);
        } else {
            ls[type] = [this.id];
        }
        _each(ls, (list, key) => {
            if (key === type) {
                return;
            }
            if (!_isArray(ls[key])) {
                _unset(ls, key);
            } else {
                _remove(list, (n) => n === this.id);
            }
        });
        localStorage.setItem('wlc.bonuses', JSON.stringify(ls));
    }

    /**
     * Set bonus action type to local storage
     */
    public setFromLocalStorage(): void {
        let ls: IIndexing<number[]>;

        try {
            ls = JSON.parse(localStorage.getItem('wlc.bonuses') || '{}');
        } catch {
            ls = {};
        }

        _each(ls, (list, key) => {
            if (!_isArray(list) || list.length === 0) {
                _unset(ls, key);
                return;
            }
            if (_includes(list, this.id)) {
                switch (key) {
                    case 'cancel':
                        if (!this.active) {
                            _remove(list, (n) => n === this.id);
                        } else {
                            this.data.Active = 0;
                            this.data.Status = -99;
                        }
                        break;
                    case 'subscribe':
                        if (this.selected) {
                            _remove(list, (n) => n === this.id);
                        } else {
                            this.data.Selected = 1;
                            this.data.Status = -99;
                        }
                        break;
                    case 'unsubscribe':
                        if (!this.selected) {
                            _remove(list, (n) => n === this.id);
                        } else {
                            this.data.Selected = 0;
                            this.data.Status = -99;
                        }
                        break;
                    case 'inventory':
                        if (!this.inventoried) {
                            _remove(list, (n) => n === this.id);
                        } else {
                            this.data.Inventoried = 0;
                            this.data.Status = -99;
                        }
                        break;
                }
            }
        });
        if (_size(ls) !== 0) {
            localStorage.setItem('wlc.bonuses', JSON.stringify(ls));
        } else {
            localStorage.removeItem('wlc.bonuses');
        }
    }

    /**
     * Games list
     *
     * @param {boolean} whiteList
     * @returns {number[]}
     */
    public gamesList(whiteList: boolean): number[] {
        const restrictType = whiteList ? '1' : '0';
        return this.data.GamesRestrictType === restrictType
            ? _map(_keys(this.data.IDGames), (id: string) => {
                return _toNumber(id);
            })
            : [];
    }

    /**
     * Categories list
     *
     * @param {boolean} whiteList
     * @returns {number[]}
     */
    public categoriesList(whiteList: boolean): number[] {
        const restrictType = whiteList ? '1' : '0';
        return this.data.CategoriesRestrictType === restrictType
            ? _map(_keys(this.data.IDCategories), (id: string) => {
                return _toNumber(id);
            })
            : [];
    }

    protected modifyData(bonus: IBonus): IBonus {
        // TODO: This is array orders of wagering from fundist, need automatically.
        const bonusTargetsOrder = ['balance', 'freerounds', 'loyalty', 'experience'];
        if (!bonus.Target && _isObject(bonus.Results)) {
            bonus.Target = '';
            _each(bonus.Results, (value: any, key: any) => {
                bonus.Target += key;
                bonus.Target += ' ';
            });
        }

        if (bonus.Target && _isString(bonus.Target)) {
            _each(bonusTargetsOrder, (value: any) => {
                if (bonus.Target.indexOf(value) !== -1) {
                    bonus.Target = value;
                    return;
                }
            });
        }

        bonus.ExpireDays = bonus.ExpireDays || bonus.Expire;

        return bonus;
    }
}
