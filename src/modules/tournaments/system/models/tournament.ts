import {
    IIndexing,
    AbstractModel,
    ConfigService,
    CachingService,
} from 'wlc-engine/modules/core';
import {
    ITournament,
} from '../interfaces/tournaments.interface';
import {TournamentsService} from '../services';
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
} from 'lodash-es';

export class Tournament extends AbstractModel<ITournament> {
    protected userCurrency: string;

    constructor(
        data: ITournament,
        protected ConfigService: ConfigService,
        protected cachingService: CachingService,
        protected tournamentsService: TournamentsService,
    ) {
        super();
        this.data = data;
        this.userCurrency = this.ConfigService.get<string>('appConfig.user.currency') || 'EUR';
    }

    public set data(data: ITournament) {
        super.data = data;
    }

    public get data(): ITournament {
        return super.data;
    }

    // default
    public get currentTime(): number {
        return this.data.CurrentTime;
    }

    public get description(): string {
        return this.data.Description;
    }

    public get ends(): string {
        return this.data.Ends;
    }

    public get feeType(): string {
        return this.data.FeeType || null;
    }

    public get id(): number {
        return this.data.ID;
    }

    public get image(): string {
        return this.data.Image;
    }

    public get imagePromo(): string {
        return this.data.Image_promo.length ? this.data.Image_promo : this.data.Image;
    }

    public get imageDashboard(): string {
        return this.data.Image_dashboard.length ? this.data.Image_dashboard : this.data.Image;
    }

    public get imageDescription(): string {
        return this.data.Image_description.length ? this.data.Image_description : this.data.Image;
    }

    public get imageOther(): string {
        return this.data.Image_other;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get pointsLimit(): number {
        return _toNumber(this.data.PointsLimit);
    }

    public get pointsLimitMin(): number {
        return _toNumber(this.data.PointsLimitMin);
    }

    public get pointsTotal(): number {
        return _toNumber(this.data.PointsTotal);
    }

    public get qualification(): number {
        return _toNumber(this.data.Qualification);
    }

    public get qualified(): number {
        return this.data.Qualified;
    }

    public get remainingTime(): number {
        return this.data.RemainingTime;
    }

    public get repeat(): string {
        return this.data.Repeat;
    }

    public get selected(): number {
        return this.data.Selected;
    }

    public get series(): string {
        return this.data.Series;
    }

    public get starts(): string {
        return this.data.Starts;
    }

    public get status(): number {
        return _toNumber(this.data.Status);
    }

    public get target(): string {
        return this.data.Target;
    }

    public get terms(): string {
        return this.data.Terms;
    }

    public get type(): string {
        return this.data.Type;
    }

    public get value(): number {
        return _toNumber(this.data.Value);
    }

    public get winnerBy(): string {
        return this.data.WinnerBy;
    }

    // additional
    /**
     * @returns {boolean} is tournaments selected
     */
    public get isSelected(): boolean {
        return !!this.data.Selected;
    }

    /**
     * @returns {boolean} is tournaments Qualified
     */
    public get isQualified(): boolean {
        return !!this.data.Qualified;
    }

    /**
     * @returns {number} tournament max Bet
     */
    public get maxBet(): number{
        return _toNumber(this.data.BetMax?.Currency) ||
            _toNumber(this.data.BetMax[this.userCurrency]) ||
            _toNumber(this.data.BetMax?.EUR);
    }

    /**
     * @returns {number} tournament min Bet
     */
    public get minBet(): number {
        return _toNumber(this.data.BetMin?.Currency) ||
            _toNumber(this.data.BetMin[this.userCurrency]) ||
            _toNumber(this.data.BetMin?.EUR);
    }

    /**
     * @returns {number} tournament fee amout
     */
    public get feeAmount(): number {
        if (this.feeType === 'loyalty') {
            return _toNumber(this.data.FeeAmount) || 0;
        } else {
            return _toNumber(this.data.FeeAmount['Currency']) ||
                _toNumber(this.data.FeeAmount[this.userCurrency]) ||
                _toNumber(this.data.FeeAmount['EUR']);
        }
    }

    /**
     * @returns {string} tournament fee cuurency
     */
    public get feeCurrency(): string {
        return (this.feeType === 'loyalty') ? 'LP' : this.userCurrency;
    }

    /**
     * @returns {string} tournament target cuurency
     */
    public get targetCurrency(): string {
        return (this.target === 'loyalty') ? 'LP' : this.userCurrency;
    }

    /**
     * @returns {number} tournament total founds
     */
    public get totalFounds(): number {
        return _toNumber(this.data.TotalFounds?.Currency) ||
            _toNumber(this.data.TotalFounds[this.userCurrency]) ||
            _toNumber(this.data.TotalFounds?.EUR);
    }

    /**
     * @returns {number[]} tournament winningSpread
     */
    public get winningSpread(): number[] {
        const winningsArr = this.data.WinningSpread?.Currency ||
            this.data.WinningSpread[this.userCurrency] ||
            this.data.WinningSpread?.EUR;
        return _map(winningsArr, (item: string) => _toNumber(item));
    }

    /**
     * @returns {number} tournament total founds
     */
    public get winningSpreadCount(): number {
        return this.data.WinningSpread.Percent.length;
    }

    /**
     * @returns {number[]} tournament winningSpread by percent
     */
    public get winningSpreadByPercent(): number[] {
        const winningsArr = this.data.WinningSpread.Percent;
        return _map(winningsArr, (item: string) => _toNumber(item));
    }

    /**
     * @returns {DateTime} tournament start time in luxon format
     */
    public get startsLuxon(): DateTime {
        const defaultTime = DateTime.fromSQL(this.data.Starts);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    /**
     * @returns {DateTime} tournament end time in luxon format
     */
    public get endsLuxon(): DateTime {
        const defaultTime = DateTime.fromSQL(this.data.Ends);
        return defaultTime.plus({minutes: defaultTime.offset});
    }

    /**
     * @returns {boolean} is tournament start
     */
    public get isTournamentStarts(): boolean {
        const timeDifference = this.startsLuxon.toMillis() - DateTime.local().toMillis();
        return timeDifference <= 0;
    }

    /**
     * @returns {boolean} is tournament end
     */
    public get isTournamentEnds(): boolean {
        const timeDifference = this.endsLuxon.toMillis() - DateTime.local().toMillis();
        return timeDifference < 0;
    }

    /**
     * Formatted tournament starts time
     *
     * @param {string} format date format by luxon plugin
     * @returns {string} formatted date
     */
    public startsTime(format: string = 'D T'): string {
        const defaultTime = DateTime.fromSQL(this.data.Starts);
        return this.startsLuxon.setLocale(defaultTime.locale).toFormat(format);
    }

    /**
     * Formatted tournament end time
     *
     * @param {string} format date format by luxon plugin
     * @returns {string} formatted date
     */
    public endsTime(format: string = 'D T'): string {
        const defaultTime = DateTime.fromSQL(this.data.Ends);
        return this.endsLuxon.setLocale(defaultTime.locale).toFormat(format);
    }
}
