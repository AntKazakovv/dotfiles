import {DateTime} from 'luxon';
import {Subject} from 'rxjs';
import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _keys from 'lodash-es/keys';
import _size from 'lodash-es/size';
import _remove from 'lodash-es/remove';
import _unset from 'lodash-es/unset';
import _includes from 'lodash-es/includes';
import _each from 'lodash-es/each';
import _floor from 'lodash-es/floor';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _toString from 'lodash-es/toString';
import _isString from 'lodash-es/isString';
import _isNumber from 'lodash-es/isNumber';
import _toNumber from 'lodash-es/toNumber';

import {
    IIndexing,
    AbstractModel,
    ConfigService,
    CachingService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    IBonus,
    IBonusConditions,
    ActionType,
    TBonusEvent,
    IBonusesModule,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses.interface';

const disabledReasons = {
    // Apply to deposit bonuses which paySystems array isn't empty and
    // don't contains current payment system
    1: gettext('This bonus is not available for '
        + 'the selected payment method.'),
    // Apply to all deposit bonuses in case if
    // user already has active bonus with `allowStack = false`
    2: gettext('You currently have an active bonus. '
        + 'The bonus does not allow stacking. '
        + 'You have to wager active bonus first or '
        + 'cancel it to claim new bonus.'),
    // Apply to deposit bonuses with `allowStack = false` in case if
    // user already has active bonus with `allowStack = true`
    3: gettext('Blocked by an active bonus. '
        + 'You have to wager active bonus first '
        + 'or cancel it to claim new bonus.'),
};

export class Bonus extends AbstractModel<IBonus> {
    public isReady: boolean = true;
    public onChooseChange: Subject<boolean> = new Subject<boolean>();
    public icon: string;
    public disabledBy: null | keyof typeof disabledReasons = null;

    protected static $bonuses: IBonusesModule;
    protected _userCurrency: string;
    protected _isChoose: boolean = false;
    protected $descriptionClean: string;

    private regEvents = ['deposit first', 'registration', 'verification'];
    private depEvents = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
    private welcomeEvents = ['registration', 'deposit first'];
    private $isReg: boolean;
    private $isDep: boolean;
    private readonly _tag: string;
    private _fallBackIconPath: string = '';

    constructor(
        from: IFromLog,
        data: IBonus,
        protected configService: ConfigService,
        protected cachingService: CachingService,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});
        this.data = this.modifyData(data);

        if (!Bonus.$bonuses) {
            Bonus.$bonuses = this.configService.get<IBonusesModule>('$bonuses');
        }

        this.userCurrency = this.configService.get<string>('appConfig.user.currency')
            || this.configService.get<string>('$base.defaultCurrency');
        this._tag = this.getTag();
        this.$descriptionClean = this.data.Description.replace(/<[^>]*>/g, '');

        if (Bonus.$bonuses.useNewImageSources && this.data.Image_other) {
            this.icon = this.data.Image_other;
        } else if (this.viewTarget) {
            this.icon = Bonus.$bonuses.defaultIconPath + this.viewTarget + '.svg';
        }

        this._fallBackIconPath = this.configService.get<string>('$bonuses.fallBackIconPath');
    }

    public set data(data: IBonus) {
        super.data = data;
        this.$isDep = this.depEvents.indexOf(this.data.Event) !== -1;
        this.$isReg = this.regEvents.indexOf(this.data.Event) !== -1;
    }

    public get data(): IBonus {
        return super.data;
    }

    public get disabledReason(): string {
        if (this.disabledBy) {
            return disabledReasons[this.disabledBy];
        }
    }

    public set isChoose(value: boolean) {
        this._isChoose = value;
        this.onChooseChange.next(value);
    }

    public get isChoose(): boolean {
        return this._isChoose;
    }

    public set userCurrency(value: string) {
        this._userCurrency = value;
    }

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

    public get balance(): number | string {
        return this.data.Balance;
    }

    public get block(): number {
        return _toNumber(this.data.Block);
    }

    /**
     * @returns {number | IBonus} is bonus id or object IBonus
     */
    public get bonus(): number | IBonus {
        return _isObject(this.data.Bonus) ? this.data.Bonus : _toNumber(this.data.Bonus);
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

    public get descriptionClean(): string {
        return this.$descriptionClean;
    }

    public get disableCancel(): boolean {
        return !!_toNumber(this.data.DisableCancel);
    }

    public get date(): string {
        return this.data.Date;
    }

    public get event(): TBonusEvent {
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
        if (this.hasPromoCode) {
            return gettext('Promocode');
        }
        if (this.$isReg) {
            return gettext('Welcome bonus');
        }
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
        return this.data.Image || Bonus.$bonuses.defaultImages?.image;
    }

    public get imageProfileFirst(): string {
        return this.data.Image || Bonus.$bonuses.defaultImages?.imageProfileFirst;
    }

    public get imageOther(): string {
        return this.data.Image_other || Bonus.$bonuses.defaultImages?.imageOther;
    }

    public get imagePromo(): string {
        return this.data.Image_promo || Bonus.$bonuses.defaultImages?.imagePromo || this.image;
    }

    public get imageReg(): string {
        return this.data.Image_reg || Bonus.$bonuses.defaultImages?.imageReg || this.image;
    }

    // TODO: add image path to config and logic to BonusItemComponent.bonusBg, when imageStore be ready
    public get imageStore(): string {
        return this.data.Image_store || Bonus.$bonuses.defaultImages?.imageStore || this.image;
    }

    public get imagePromoHome(): string {
        if (Bonus.$bonuses.useNewImageSources) {
            return this.data.Image_main || Bonus.$bonuses.defaultImages?.imagePromoHome;
        } else {
            return Bonus.$bonuses.defaultImages?.imagePromoHome;
        }
    }

    public get imageDescription(): string {
        return this.data.Image_description || Bonus.$bonuses.defaultImages?.imageDescription;
    }

    public get inventoried(): boolean {
        return !!this.data.Inventoried;
    }

    public get isInventory(): boolean {
        return !!_toNumber(this.data.IsInventory);
    }

    /**
     * Returns weight of the bonus
     */
    public get weight(): number {
        return _toNumber(this.data.Weight);
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

    public get maxBet(): number {
        return _toNumber(this.data.MaxBet?.[this._userCurrency]) ||
            _toNumber(this.data.MaxBet?.EUR) ||
            _toNumber(this.data.Conditions?.MaxBet?.Currency) ||
            _toNumber(this.data.Conditions?.MaxBet?.EUR) || 0;
    }

    public get minBet(): number {
        return _toNumber(this.data.MinBet?.[this._userCurrency]) ||
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
        return _isNumber(this.data.PromoCode) ? !!this.data.PromoCode : !!this.data.PromoCode?.length;
    }

    public get paySystems(): number[] {
        let result: number[] = [];
        if (this.data.PaySystems?.[0] !== 'all') {
            result = _map(this.data.PaySystems, Number);
        }
        return result;
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
        return this.status !== 0 && this.active;
    }

    /**
    * @returns {boolean} is bonus expire
    */
    public get isExpired(): boolean {
        return this.status === -99 && this.active;
    }

    /**
     * @returns {boolean} is bonus deposit
     */
    public get isDeposit(): boolean {
        return this.$isDep;
    }

    /**
     * @returns {boolean} whether bonus has welcome events
     */
    public get isWelcomeBonus(): boolean {
        return _includes(this.welcomeEvents, this.data.Event);
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
     * @returns {boolean} is bonus disabled
     */
    public get isDisabled(): boolean {
        return this.status === -99;
    }

    /**
     * @returns {boolean} is bonus lootbox
     */
    public get isLootbox(): boolean {
        return this.bonusType === 'lootbox';
    }

    /**
     * @returns {number} bonus min deposit
     */
    public get minDeposit(): number {
        return _toNumber(this.amountMin?.[this._userCurrency]) ||
            _toNumber(this.amountMin?.EUR) ||
            _toNumber(this.conditions?.AmountMin?.Currency) ||
            _toNumber(this.conditions?.AmountMin?.EUR) || 0;
    }

    /**
     * @returns {number} bonus max deposit
     */
    public get maxDeposit(): number {
        return _toNumber(this.amountMax?.[this._userCurrency]) ||
            _toNumber(this.amountMax?.EUR) ||
            _toNumber(this.conditions?.AmountMax?.Currency) ||
            _toNumber(this.conditions?.AmountMax?.EUR) || 0;
    }

    /**
     * @returns {number} multiplier for relative bonus
     */
    public get multiplier(): number {
        if (this.results?.[this.target]?.Type === 'relative') {
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
        if (this.results?.[this.target].Type === 'relative') {
            return _toNumber(this.results?.bonus?.LimitValue[this._userCurrency]) ||
                _toNumber(this.results[this.target].LimitValue?.EUR) || 0;
        }
    }

    /**
     * @returns {boolean} is bonus limit in EUR (need for experience and loyalty bonuses)
     */
    public get isLimitAmountEUR(): boolean {
        return !this.results?.balance?.LimitValue[this._userCurrency] && !!this.results?.balance?.LimitValue?.EUR;
    }

    /**
     * @returns {number} bonus wager value
     */
    public get wager(): number {
        const resultsTarget = this.results?.[this.target];
        if (this.target === 'balance') {
            return _toNumber(this.results?.balance?.ReleaseWagering) || 0;
        } else {
            return _toNumber(resultsTarget?.AwardWagering?.COEF)
                || _toNumber(resultsTarget?.AwardWagering[this._userCurrency])
                || _toNumber(resultsTarget?.AwardWagering?.EUR)
                || 0;
        }
    }

    /**
     * @returns {boolean} bonus wagering type is absolute
     */
    public get isWagerAbsolute(): boolean {
        return this.target !== 'balance' && this.results?.[this.target]?.WageringType === 'absolute';
    }

    /**
     * @returns {boolean} is bonus wager in EUR (need for experience and loyalty bonuses)
     */
    public get isWagerEUR(): boolean {
        const resultsTarget = this.results?.[this.target];
        if (this.isWagerAbsolute) {
            return !resultsTarget?.AwardWagering[this._userCurrency] && !!resultsTarget?.AwardWagering?.EUR;
        }
    }

    /**
     * @returns {number | number[]} bonus value
     */
    public get value(): number | number[] {
        const resultsTarget = this.results?.[this.target];
        
        if (!resultsTarget) {
            return 0;
        }

        switch (this.target) {
            case 'loyalty' || 'experience':
                return resultsTarget.Type === 'relative'
                    ? _toNumber(resultsTarget.Value)
                    : _toNumber(resultsTarget.Value?.EUR);
            case 'lootbox':
                return resultsTarget.Value;
            default:
                return _toNumber(resultsTarget.Value[this._userCurrency])
                    || _toNumber(resultsTarget.Value?.Currency)
                    || _toNumber(resultsTarget.Value?.EUR)
                    || _toNumber(resultsTarget.Value);
        }
    }


    /**
     * @returns {string} fallback bonus icon path
     */
    public get fallBackIconPath(): string {
        return this._fallBackIconPath;
    }

    /**
     * @returns {string} bonus limitation text ('Winnings + Deposit', 'Winnings', 'Full lock', 'No lock')
     */
    public get limitationText(): string {

        let str: string = '';
        switch (this.limitation) {
            case 'winevent':
                str = gettext('Winnings + Deposit');
                break;
            case 'win':
                str = gettext('Winnings');
                break;
            case 'all':
                str = gettext('Full lock');
                break;
            default:
                str = gettext('No lock');
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
        if (!this.id) {
            return;
        }

        const resultsTarget = this.results?.[this.target];
        if (!resultsTarget) {
            return 'default';
        }

        if (resultsTarget?.Type === 'relative') {
            return 'relative';
        } else {
            return this.target;
        }
    }

    /**
     * @returns {DateTime} bonus expiration time in luxon format
     */
    public get expirationTimeLuxon(): DateTime {
        const defaultTime = DateTime.fromSQL(this.data.Expire);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    /**
     * @returns {string} bonus tag
     */
    public get tag(): string {
        return this._tag;
    }

    /**
     * Get bonus wagering progress in percent
     *
     * @param {boolean} rounded - (no required) round result
     * @returns {number} bonus wagering progress (0 - 100)
     */
    public getProgress(rounded?: boolean): number {
        let progress: number;

        if (!this.wageringTotal) {
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
     * Add bonus to cache
     *
     * @param type action type ('inventory' | 'cancel' | 'expired' | 'subscribe' | 'unsubscribe')
     */
    public async addToCache(type: ActionType): Promise<void> {
        const target = this.results?.[this.target];
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
            ls = await this.cachingService.get('bonuses') || {};
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
        if (type === 'expired' && ls) {
            this.cachingService.set<IIndexing<number[]>>('expired-bonuses', ls, true, 300000);
        } else {
            this.cachingService.set<IIndexing<number[]>>('bonuses', ls, true, Number.MAX_SAFE_INTEGER);
        }
    }

    /**
     * Set bonus action type to local storage
     */
    public async setFromCache(): Promise<void> {
        let ls: IIndexing<number[]>;

        try {
            ls = await this.cachingService.get('bonuses') || {};
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
                        if (this.selected || (this.inventoried && this.event === 'sign up')) {
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
            await this.cachingService.set<IIndexing<number[]>>('bonuses', ls, true, Number.MAX_SAFE_INTEGER);
        } else {
            await this.cachingService.clear('bonuses');
        }
    }

    /**
     * Set expired bonus to local storage
     */
    public async setExpiredFromCache(): Promise<void> {
        let expBonuses: IIndexing<number[]>;

        try {
            expBonuses = await this.cachingService.get('expired-bonuses') || {};
        } catch {
            expBonuses = {};
        }

        _each(expBonuses, (list, key) => {
            if (!_isArray(list) || list.length === 0) {
                _unset(expBonuses, key);
                return;
            }
            if (_includes(list, this.id) && key === 'expired') {
                if (!this.active) {
                    _remove(list, (n: number): boolean => n === this.id);
                } else {
                    this.data.Active = 1;
                    this.data.Status = -99;
                }
            }
        });
        if (expBonuses.expired && _size(expBonuses) === 0) {
            await this.cachingService.clear('expired-bonuses');
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
            _each(bonusTargetsOrder, (value: string) => {
                if (bonus.Target.indexOf(value) !== -1) {
                    bonus.Target = value;
                }
            });
        }

        bonus.ExpireDays = bonus.ExpireDays || bonus.Expire;
        return bonus;
    }

    /**
     * Compute bonus tag
     *
     * @returns {string} bonus tag
     */
    protected getTag(): string {

        if (this.isActive) {
            return gettext('Active');
        }

        if (this.isSubscribed) {
            return gettext('Subscribed');
        }

        if (this.isLootbox) {
            return gettext('Lootbox');
        }

        if (this.inventoried) {
            return gettext('Inventoried');
        }

        if (this.hasPromoCode) {
            return gettext('Promo code');
        }

        if (this.isWelcomeBonus) {
            return gettext('Welcome');
        }

        return '';
    }
}
