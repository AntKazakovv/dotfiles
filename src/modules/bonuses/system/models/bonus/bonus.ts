import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {
    BehaviorSubject,
    Subject,
} from 'rxjs';
import _assign from 'lodash-es/assign';
import _map from 'lodash-es/map';
import _keys from 'lodash-es/keys';
import _includes from 'lodash-es/includes';
import _each from 'lodash-es/each';
import _floor from 'lodash-es/floor';
import _isObject from 'lodash-es/isObject';
import _isString from 'lodash-es/isString';
import _isNil from 'lodash-es/isNil';
import _isNumber from 'lodash-es/isNumber';
import _toNumber from 'lodash-es/toNumber';
import _reduce from 'lodash-es/reduce';

import {AbstractModel} from 'wlc-engine/modules/core/system/models/abstract.model';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {IFromLog} from 'wlc-engine/modules/core/system/services/log/log.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';

import {
    IBonus,
    IBonusConditions,
    TBonusEvent,
    IBonusesModule,
    IBonusResults,
    TBonusTarget,
    IBonusResultValueLootbox,
    IBonusResultValueDefault,
    IBonusResultValue,
    IBonusWagerGamesFilter,
    TBonusTagKey,
    IBonusResultValueFreerounds,
    IFreeroundsRangeRelative,
} from 'wlc-engine/modules/bonuses/system/interfaces/bonuses/bonuses.interface';
import {IAmount} from 'wlc-engine/modules/multi-wallet';
import {LootboxPrizeModel} from 'wlc-engine/modules/bonuses/system/models/lootbox-prize/lootbox-prize.model';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';
import {UserProfile} from 'wlc-engine/modules/user';

export const disabledReasons = {
    // Apply to deposit bonuses which paySystems array isn't empty and
    // don't contains current payment system
    1: gettext('This bonus is not available for '
        + 'the selected payment method.'),
    // Apply to all deposit bonuses in case if
    // user already has active bonus with `allowStack = false`
    2: gettext('You currently have an active bonus. '
        + 'The bonus does not allow stacking. '
        + 'You have to wager the active bonus first or '
        + 'cancel it to claim a new bonus'),
    // Apply to deposit bonuses with `allowStack = false` in case if
    // user already has active bonus with `allowStack = true`
    3: gettext('Blocked by an active bonus. '
        + 'You have to wager active bonus first '
        + 'or cancel it to claim new bonus.'),
    // Apply if user entered promo code on deposit page
    4: gettext('Blocked by a promo code bonus. '
        + 'You must cancel the promo code bonus in order to receive a new bonus'),
};

export class Bonus extends AbstractModel<IBonus> {
    public onChooseChange: Subject<boolean> = new Subject<boolean>();
    public icon: string;
    public showOnlyIcon: string;
    public disabledBy: null | keyof typeof disabledReasons = null;
    public lootBoxRewards: LootboxPrizeModel[];
    public static readonly regEvents: TBonusEvent[] = ['deposit first', 'registration', 'verification'];
    public static readonly depEvents: TBonusEvent[] = ['deposit', 'deposit first', 'deposit repeated', 'deposit sum'];
    public static readonly welcomeEvents: TBonusEvent[] = ['registration', 'deposit first'];
    public static userCurrency: string;
    public static depositCurrency: string;
    public readonly descriptionClean: string;
    public readonly termsClean: string;
    public readonly nameClean: string;
    public readonly allowPromotions: boolean;
    public readonly hidePromotionsForUnauthorized: boolean;
    public timerEnd: Dayjs;

    // TODO: This is array orders of wagering from fundist, need automatically.
    private static bonusTargetsOrder = ['balance', 'freerounds', 'loyalty', 'experience'];
    private static bonusesConfig: IBonusesModule;
    private static _existActiveBonus: boolean = false;
    private static _stackIsLocked: boolean = false;
    private static _serverTimeUTC: number = null;
    private _isChoose: boolean = false;
    private _isReg: boolean;
    private _isDep: boolean;
    private _fallBackIconPath: string = '';
    private _expirationTime: Dayjs;

    constructor(
        from: IFromLog,
        data: IBonus,
        protected readonly walletsService: WalletsService,
        protected readonly configService: ConfigService,
    ) {
        super({from: _assign({model: 'Bonus'}, from)});

        this.data = this.modifyData(data);

        if (this.data.Active && !Bonus.stackIsLocked) {

            if (!Bonus.existActiveBonus) {
                Bonus.existActiveBonus = true;
            }

            if (!_toNumber(this.data.AllowStack)) {
                Bonus.stackIsLocked = true;
            }
        }

        if (!Bonus.bonusesConfig) {
            Bonus.bonusesConfig = this.configService.get<IBonusesModule>('$bonuses');
        }

        this.descriptionClean = GlobalHelper.deleteHTMLTags(this.data.Description);
        this.termsClean = GlobalHelper.deleteHTMLTags(this.data.Terms);
        this.nameClean = GlobalHelper.deleteHTMLTags(this.data.Name);
        this.allowPromotions = !!_toNumber(this.data.AllowPromotions);
        this.hidePromotionsForUnauthorized = !!_toNumber(this.data.HidePromotionsForUnauthorized);

        if (this.showOnly) {
            this.showOnlyIcon = GlobalHelper.proxyUrl(Bonus.bonusesConfig.showOnlyIconPath);
        }

        if (Bonus.bonusesConfig?.useNewImageSources && this.data.Image_other) {
            this.icon = GlobalHelper.proxyUrl(this.data.Image_other);
        } else if (this.viewTarget) {
            this.icon = GlobalHelper.proxyUrl(Bonus.bonusesConfig?.defaultIconPath + this.viewTarget + '.'
                + Bonus.bonusesConfig?.defaultIconExtension);
        }

        this._fallBackIconPath = this.configService.get<string>('$bonuses.fallBackIconPath');

        if (this.event === 'cashback') {
            this.timerEnd = (
                +this.availabilityTimeLuxon < +this.endsTimeLuxon
                    ? this.availabilityTimeLuxon
                    : this.endsTimeLuxon
            );
        } else {
            this.timerEnd = this.endsTimeLuxon;
        }
    }

    public static set serverTime(time: number) {
        if (!_isNil(time)) {
            Bonus._serverTimeUTC = time;
        }
    }

    public static get existActiveBonus(): boolean {
        return Bonus._existActiveBonus;
    }

    public static set existActiveBonus(value: boolean) {
        Bonus._existActiveBonus = value;
    }

    public static get stackIsLocked(): boolean {
        return Bonus._stackIsLocked;
    }

    public static set stackIsLocked(value: boolean) {
        Bonus._stackIsLocked = value;
    }

    public override set data(data: IBonus) {
        super.data = data;
        this._isDep = Bonus.depEvents.indexOf(this.data.Event) !== -1;
        this._isReg = Bonus.regEvents.indexOf(this.data.Event) !== -1;
    }

    public override get data(): IBonus {
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

    public get stackIsUnavailable(): boolean {
        return Bonus.stackIsLocked || (Bonus.existActiveBonus && !_toNumber(this.data.AllowStack));
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

    public get availabilityDate(): string {
        return this.data.AvailabilityDate;
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
            return gettext('Promo code');
        }
        if (this._isReg) {
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
        return GlobalHelper.proxyUrl(
            this.data.Image
            || Bonus.bonusesConfig.defaultImages?.image,
        );
    }

    public get imageProfileFirst(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image
            || Bonus.bonusesConfig.defaultImages?.imageProfileFirst,
        );
    }

    public get imageOther(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_other
            || Bonus.bonusesConfig.defaultImages?.imageOther,
        );
    }

    public get imagePromo(): string {
        return GlobalHelper.proxyUrl(this.data.Image_promo
            || Bonus.bonusesConfig.defaultImages?.imagePromo
            || this.image);
    }

    public get imageReg(): string {
        return GlobalHelper.proxyUrl(this.data.Image_reg
            || Bonus.bonusesConfig.defaultImages?.imageReg
            || this.image);
    }

    // TODO: add image path to config and logic to BonusItemComponent.bonusBg, when imageStore be ready
    public get imageStore(): string {
        return GlobalHelper.proxyUrl(this.data.Image_store
            || Bonus.bonusesConfig.defaultImages?.imageStore
            || this.image);
    }

    public get imagePromoHome(): string {
        if (Bonus.bonusesConfig.useNewImageSources) {
            return GlobalHelper.proxyUrl(
                this.data.Image_main
                || Bonus.bonusesConfig.defaultImages?.imagePromoHome,
            );
        } else {
            return GlobalHelper.proxyUrl(Bonus.bonusesConfig.defaultImages?.imagePromoHome);
        }
    }

    public get imageDescription(): string {
        return this.data.Image_description || Bonus.bonusesConfig.defaultImages?.imageDescription;
    }

    public get imageDeposit(): string {
        return GlobalHelper.proxyUrl(this.data.Image_deposit || Bonus.bonusesConfig.defaultImages?.imageDeposit);
    }
    /**
     * Whether the bonus is in the player's inventory
     * @returns {boolean}
     */
    public get inventoried(): boolean {
        return !!this.data.Inventoried;
    }

    /**
     * The flag indicates whether the bonus will go into inventory when activated. Lootbox bonus is always true.
     * @returns {boolean}
     */
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
        return _toNumber(this.data.MaxBet?.[Bonus.userCurrency]) ||
            _toNumber(this.data.MaxBet?.EUR) ||
            _toNumber(this.data.Conditions?.MaxBet?.Currency) ||
            _toNumber(this.data.Conditions?.MaxBet?.EUR) || 0;
    }

    public get minBet(): number {
        return _toNumber(this.data.MinBet?.[Bonus.userCurrency]) ||
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

    public get results(): IBonusResults {
        return this.data.Results || {};
    }

    /**
     * @returns {string} Type balance
     */
    public get typeBalance(): string {
        return this.results?.balance?.Type;
    }

    /**
     * @returns {string} Type freebets
     */
    public get typeFreebets(): string {
        return this.results?.freebets?.Type;
    }

    /**
     * @returns {boolean} condition for displaying the currency icon
     */
    public get currencyIcon(): boolean {
        return ((this.target === 'balance' && this.typeBalance === 'absolute')
            || (this.bonusType === 'sport' && this.typeFreebets === 'absolute'));
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

    public get target(): TBonusTarget {
        return this.data.Target;
    }

    public get terms(): string {
        return this.data.Terms;
    }

    public get isBonusTimerActive(): boolean {
        return this.data.Timer;
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

    public get showOnly(): boolean {
        return !!this.data?.showOnly;
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
        return this._isDep;
    }

    /**
     * @returns {boolean} whether bonus has welcome events
     */
    public get isWelcomeBonus(): boolean {
        return _includes(Bonus.welcomeEvents, this.data.Event);
    }

    /**
     * @returns {boolean} is bonus unavailable for activation
     */
    public get isUnavailableForActivation(): boolean {
        return this.status == 1 &&
            (this.selected || this.inventoried) &&
            !this.active &&
            this.stackIsUnavailable;
    }

    /**
     * @returns {boolean} is bonus subscribed
     */
    public get isSubscribed(): boolean {
        return this.status == 1 && this.selected && !this.active;
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
     * @returns {boolean} - Does bonus equal 'store'
     */
    public get isStoreEvent(): boolean {
        return this.event === 'store';
    }

    /**
     * @returns {number} bonus min deposit
     */
    public get minDeposit(): number {
        return _toNumber(this.amountMin?.[Bonus.depositCurrency ?? Bonus.userCurrency]) ||
            _toNumber(this.amountMin?.EUR) ||
            _toNumber(this.conditions?.AmountMin?.Currency) ||
            _toNumber(this.conditions?.AmountMin?.EUR) || 0;
    }

    /**
     * @returns {number} bonus max deposit
     */
    public get maxDeposit(): number {
        return _toNumber(this.amountMax?.[Bonus.depositCurrency ?? Bonus.userCurrency]) ||
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
        return !this.conditions.MaxBonusWin?.EUR && !!this.conditions.MaxBonusWinCoef;
    }

    /**
     * @returns {number} bonus limit value
     */
    public get limitAmount(): number {
        if (this.results?.[this.target].Type === 'relative') {
            return _toNumber(this.results[this.target].LimitValue[Bonus.userCurrency]) ||
                _toNumber(this.results[this.target].LimitValue?.EUR) || 0;
        }
    }

    /**
     * @returns {boolean} is bonus limit in EUR (need for experience and loyalty bonuses)
     */
    public get isLimitAmountEUR(): boolean {
        return !this.results?.balance?.LimitValue[Bonus.userCurrency] && !!this.results?.balance?.LimitValue?.EUR;
    }

    /**
     * @returns {number} bonus wager value
     */
    public get wager(): number {
        const resultsTarget = this.results[this.target];

        if (!resultsTarget) {
            return 0;
        }

        if (this.target === 'balance') {
            return _toNumber(resultsTarget.ReleaseWagering) || 0;
        } else {
            return _toNumber(resultsTarget?.AwardWagering?.COEF)
                || _toNumber(resultsTarget?.AwardWagering
                    [Bonus.userCurrency as (keyof IBonusResultValue['AwardWagering'])])
                || _toNumber(resultsTarget?.AwardWagering?.EUR)
                || 0;
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
            return !resultsTarget?.AwardWagering
                [Bonus.userCurrency as keyof IBonusResultValue['AwardWagering']]
            && !!resultsTarget?.AwardWagering?.EUR;
        }
    }

    /**
     * @returns {number | number[] | string} bonus value
     */
    public get value(): number | number[] | string {
        const resultsTarget = this.results[this.target];

        if (!resultsTarget) {
            return 0;
        }

        switch (this.target) {
            case 'loyalty' || 'experience':
                return resultsTarget.Type === 'relative'
                    ? Math.round(Number(resultsTarget.Value))
                    : Math.round(Number((resultsTarget as IBonusResultValueDefault).Value?.EUR));
            case 'lootbox':
                return (resultsTarget as IBonusResultValueLootbox).Value;
            case 'freerounds':
                return this.produceFreeroundsValue(resultsTarget as IBonusResultValueFreerounds);
            default:
                return Math.round(Number((resultsTarget as IBonusResultValueDefault).Value[Bonus.depositCurrency
                        ?? Bonus.userCurrency]))
                    || Math.round(Number((resultsTarget as IBonusResultValueDefault).Value?.Currency))
                    * (this.walletsService?.coefficientOriginalCurrencyConversion || 1)
                    || Math.round(Number((resultsTarget as IBonusResultValueDefault).Value?.EUR))
                    * (this.walletsService?.coefficientConversionEUR || 1)
                    || Math.round(Number(resultsTarget.Value));
        }
    }

    /**
     * @returns {string} currency value
     */
    public get currencyValue(): string {
        return Bonus.depositCurrency ?? Bonus.userCurrency;
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
        return this.allowStack ? gettext('Allowed') : gettext('Restricted');
    }

    /**
     * @returns {string} bonus status text
     */
    public get statusText(): string {
        if (this.isActive) {
            return gettext('Active');
        } else if (this.isUnavailableForActivation) {
            return gettext('Unavailable');
        } else if (this.isSubscribed) {
            return gettext('Subscribe');
        } else if (this.inventoried) {
            return gettext('Inventory');
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

        const resultsTarget = this.results[this.target];
        if (!resultsTarget) {
            return 'default';
        }

        if (resultsTarget?.Type === 'relative' && this.target !== 'freerounds') {
            return 'relative';
        } else {
            return this.target;
        }
    }

    /**
     * @returns {Dayjs} bonus expiration time in DayJs format
     */
    public get expirationTimeDaysjs(): Dayjs {
        return this._expirationTime;
    }

    public get endsTimeLuxon(): Dayjs {
        return this.convertTime(this.data.Ends);
    }

    public get availabilityTimeLuxon(): Dayjs {
        return this.convertTime(this.data.AvailabilityDate);
    }

    /**
     * @returns {TBonusTagKey} bonus tag
     */
    public get tag(): TBonusTagKey {

        if (this.showOnly || this.isUnavailableForActivation) {
            return 'unavailable';
        }

        if (this.isActive) {
            return 'active';
        }

        if (this.isLootbox) {
            return 'lootbox';
        }

        if (this.inventoried) {
            return 'inventoried';
        }

        if (this.isSubscribed) {
            return 'subscribed';
        }

        if (this.hasPromoCode) {
            return 'promocode';
        }

        if (this.isWelcomeBonus) {
            return 'welcome';
        }

        if (this.isDisabled) {
            return 'processing';
        }

        return '';
    }

    public get serverTime(): number | null {
        return Bonus._serverTimeUTC;
    }

    public get idGames(): number[] {
        return _isObject(this.data.IDGames)
            ? _map(_keys(this.data.IDGames), (id: string) => _toNumber(id))
            : [];
    }

    public get idCategories(): number[] {
        return _isObject(this.data.IDCategories)
            ? _map(_keys(this.data.IDCategories), (id: string) => _toNumber(id))
            : [];
    }

    public get gamesRestrictType(): number {
        return _toNumber(this.data.GamesRestrictType);
    }

    public get categoriesRestrictType(): number {
        return _toNumber(this.data.CategoriesRestrictType);
    }

    public get idMerchants(): number[] {
        return _map(this.data.IDMerchants, (id: string) => _toNumber(id));
    }

    public get freeroundGameIds(): number[] {
        return _reduce(this.results.freerounds?.FreeroundGames, (acc: number[], current: number[]) => {
            acc.push(...current);
            return acc;
        }, []);
    }

    public getGamesFilter(): IBonusWagerGamesFilter {
        return {
            idMerchants: this.idMerchants,
            hasRestrictedGames: !this.gamesRestrictType,
            idGames: this.idGames,
            hasRestrictedCategories: !this.categoriesRestrictType,
            idCategories: this.idCategories,
        };
    }

    /**
     * @returns {boolean} can the bonus be played
     */
    public get canPlay(): boolean {
        return ((this.isSubscribed && !this.isDeposit) || this.isActive) && !this.inventoried;
    }

    /**
     * @returns {boolean} can the bonus be unsubscribed
     */
    public get canUnsubscribe(): boolean {
        return this.isSubscribed || this.inventoried;
    }

    /**
     * @returns {boolean} can the bonus be subscribed
     */
    public get canSubscribe(): boolean {
        return this.status == 1 && !this.selected && !this.active && !this.inventoried;
    }

    /**
     * @returns {boolean} can the bonus be deposited
     */
    public get canDeposit(): boolean {
        return this.isSubscribed && this.isDeposit && !this.inventoried;
    }

    /**
     * @returns {boolean} can the bonus be inventoried
     */
    public get canInventory(): boolean {
        return this.inventoried && !this.isLootbox;
    }

    /**
     * @returns {boolean} can the bonus be leaved
     */
    public get canLeave(): boolean {
        return this.isActive && !this.disableCancel;
    }

    /**
     * @returns {boolean} can the bonus be opened
     */
    public get canOpen(): boolean {
        return this.isLootbox && this.inventoried;
    }

    /**
     * Show bonus in promotions no matter of group
     *
     * @param isAuth - is user authorized
     *
     * @returns boolean - show bonus in Promotions
     */
    public showInPromotions(isAuth: boolean): boolean {
        return this.allowPromotions && (!this.hidePromotionsForUnauthorized || isAuth);
    }

    /**
     * Get bonus wagering progress in percent
     *
     * @param {boolean} rounded - (no required) round result
     * @returns {number} bonus wagering progress (0 - 100)
     */
    public getProgress(rounded?: boolean): number {
        let progress: number;

        if (this.wageringTotal) {
            progress = this.wagering / this.wageringTotal * 100;
        } else {
            progress = this.wagering ? 0 : 100;
        }

        return rounded ? _floor(progress) : progress;
    }

    /**
     * Formatted bonus expiration time
     *
     * @param {string} format date format by Dayjs plugin
     * @returns {string} formatted date
     */
    public expirationTime(format: string = 'D T'): string {
        const defaultTime: Dayjs = dayjs(this.data.Expire);
        const offsetTime: Dayjs = defaultTime.add(dayjs().utcOffset(), 'minute');
        return offsetTime.format(format);
    }

    /**
     * Games list
     *
     * @param {boolean} whiteList
     * @returns {number[]}
     */
    public gamesList(whiteList: boolean): number[] {
        return _toNumber(this.data.GamesRestrictType) === _toNumber(whiteList) ? this.idGames : [];
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
            ? this.idCategories
            : [];
    }

    public convertTime(date: string): Dayjs {
        const defaultTime: Dayjs = dayjs(date);
        return defaultTime.add(dayjs().utcOffset(), 'minute');
    }

    /** Prepare and returns data for loyalty-confirm component */
    public getBonusResults(currency: string): IAmount[] {
        const specialTargets: Partial<Record<TBonusTarget, string>> = {
            'experience': 'EP',
            'freerounds': 'FS',
            'loyalty': 'LP',
        };

        const results = _reduce(this.results, (res: IAmount[], result: IBonusResultValue, target: TBonusTarget) => {
            const curr: string = specialTargets[target];
            if (curr) {
                let value: number;
                if (target === 'loyalty' || target === 'experience') {
                    value = Number((result as IBonusResultValueDefault).Value['EUR']);
                } else if (target === 'freerounds') {
                    value = Number((result as IBonusResultValueFreerounds).Value);
                }

                if (value) {
                    res.push({
                        value,
                        currency: curr,
                    });
                }
            }
            return res;
        }, []);

        const balanceResults: IAmount = this.getBalanceResults(currency);

        if (balanceResults) {
            results.push(balanceResults);
        }

        return results;
    }

    protected getBalanceResults(currency: string): IAmount {
        const resultsData: IBonusResultValueDefault = this.results['balance'];

        if (!resultsData) {
            return;
        }

        const userProfile: UserProfile
            = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$').getValue();
        const conversionCurrency: string = userProfile?.isConversionInFiat
            ? this.walletsService.walletSettings?.currency
            : null;

        let value: string = conversionCurrency
            ? resultsData.Value[conversionCurrency]
            : resultsData.Value[currency];

        if (value) {
            return {
                value: Number(value),
                currency,
                conversionCurrency,
            };
        }
    }

    protected modifyData(bonus: IBonus): IBonus {

        if (!bonus.Target && _isObject(bonus.Results)) {
            let targets: string[] = [];

            _each(bonus.Results, (value: any, key: string): void => {
                targets.push(key);
            });

            bonus.Target = targets.join(' ') as TBonusTarget;
        }

        if (bonus.Target && _isString(bonus.Target)) {
            _each(Bonus.bonusTargetsOrder, (value: TBonusTarget) => {
                if (bonus.Target.indexOf(value) !== -1) {
                    bonus.Target = value;
                }
            });
        }

        bonus.ExpireDays = bonus.ExpireDays || bonus.Expire;

        //TODO remove it after 608920 release
        if (!isNaN(Number(bonus.Expire))) {
            bonus.Expire = bonus.Ends;
        }

        this._expirationTime = this.convertTime(bonus.Expire);

        if (bonus.Active && +this._expirationTime < +dayjs()) {
            bonus.Status = -99;
        }

        return bonus;
    }

    private produceFreeroundsValue(resultsTarget: IBonusResultValueFreerounds): string {
        if (resultsTarget.Type === 'relative') {
            const ranges: IFreeroundsRangeRelative[] = resultsTarget.Ranges;
            return ranges.length > 1
                ? `${ranges[0].Value}-${ranges[ranges.length - 1].Value}`
                : ranges[0].Value;
        }
        return resultsTarget.Value;
    }

}
