import {formatDate} from '@angular/common';
import {AbstractModel} from 'wlc-engine/modules/core/models/abstract.model';
import {IBonus, IBonusConditions} from '../interfaces/bonuses.interface';
import {IIndexing} from 'wlc-engine/interfaces/global.interface';
import {ConfigService} from 'wlc-engine/modules/core/services';

import {
    toNumber as _toNumber,
    isNumber as _isNumber,
    isString as _isString,
    isObject as _isObject,
    floor as _floor,
    each as _each,
} from 'lodash';

export class Bonus extends AbstractModel<IBonus> {
    protected userCurrency: string;
    protected isAuth: boolean;

    constructor(
        data: IBonus,
        protected ConfigService: ConfigService,
    ) {
        super();
        this.data = this.modifyData(data);
        this.userCurrency = 'EUR' // TODO get user currency
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
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
    public get isActive(): boolean {
        return this.status == 1 && this.active;
    }

    public get isSubscribed(): boolean {
        return this.status == 1 && this.selected && !this.active;
    }

    public get canSubscribe(): boolean {
        return this.status == 1 && !this.selected && !this.active;
    }

    public get minDeposit(): number {
        return _toNumber(this.amountMin[this.userCurrency]) ||
            _toNumber(this.amountMin?.EUR) ||
            _toNumber(this.conditions?.AmountMin?.Currency) ||
            _toNumber(this.conditions?.AmountMin?.EUR) || 0;
    }

    public get maxDeposit(): number {
        return _toNumber(this.amountMax[this.userCurrency]) ||
            _toNumber(this.amountMax?.EUR) ||
            _toNumber(this.conditions?.AmountMax?.Currency) ||
            _toNumber(this.conditions?.AmountMax?.EUR) || 0;
    }

    public get multiplier(): number {
        if (this.results[this.target]?.Type === 'relative') {
            return _toNumber(this.results[this.target]?.Value) / 100;
        }
    }

    public get maxWin(): number {
        return _toNumber(this.conditions?.MaxBonusWin?.Currency) ||
            _toNumber(this.conditions?.MaxBonusWin?.EUR) ||
            _toNumber(this.conditions?.MaxBonusWinCoef) || 0;
    }

    public get isMaxWinRelative(): boolean {
        return !this.conditions?.MaxBonusWin?.EUR && !!this.conditions?.MaxBonusWinCoef;
    }

    public get limitAmount(): number {
        if (this.results[this.target].Type === 'relative') {
            return _toNumber(this.results?.bonus?.LimitValue[this.userCurrency]) ||
                _toNumber(this.results[this.target].LimitValue?.EUR) || 0;
        }
    }

    public get isLimitAmountEUR(): boolean {
        return !this.results?.balance?.LimitValue[this.userCurrency] && !! this.results?.balance?.LimitValue?.EUR;
    }

    public get wager(): number {
        const resultsTarget = this.results[this.target];
        if (this.target === 'balance') {
            return _toNumber(this.results?.balance?.ReleaseWagering) || 0;
        } else {
            return _toNumber(resultsTarget?.AwardWagering?.COEF) || _toNumber(resultsTarget?.AwardWagering[this.userCurrency]) ||
                _toNumber(resultsTarget?.AwardWagering?.EUR) || 0;
        }
    }

    public get isWagerAbsolute(): boolean {
        return this.target !== 'balance' && this.results[this.target]?.WageringType === 'absolute';
    }

    public get isWagerEUR(): boolean {
        const resultsTarget = this.results[this.target];
        if (this.isWagerAbsolute) {
            return !resultsTarget?.AwardWagering[this.userCurrency] && !!resultsTarget?.AwardWagering?.EUR;
        }
    }

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

    public get stackingText(): string {
        return this.allowStack ? 'Allowed' : 'Restricted';
    }

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

    public getProgress(rounded?: boolean): number {
        let progress: number;

        if (!this.wageringTotal)  {
            progress = !this.wagering ? 100 : 0;
        } else {
            progress = this.wagering / this.wageringTotal * 100;
        }

        return rounded ? _floor(progress) : progress;
    }

    public expirationTime(format: string = 'L LT'): string {
        // TODO add moment (window as any).moment.utc(this.data.Expire).local().format(format);
        return formatDate(this.data.Expire, format, 'en-US');
    }

    public getInventory(): void {
        // TODO
    }

    public join(): void {
        // TODO
    }

    public leave(): void {
        // TODO
    }

    public unsubscribe(): void {
        //TODO
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
