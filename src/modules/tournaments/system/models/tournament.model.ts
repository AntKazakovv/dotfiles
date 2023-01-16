import {DateTime} from 'luxon';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';
import _reduce from 'lodash-es/reduce';

import {
    ConfigService,
    IFromLog,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {TFreeRoundGames} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {
    IPrizeRow,
    ITournament,
    ITournamentGames,
    ITournamentPrize,
    TCurrency,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {AbstractTournamentModel} from 'wlc-engine/modules/tournaments/system/models/abstract-tournament.model';
import {CurrenciesInfo} from 'wlc-engine/modules/core/constants/currencies-info.constants';

export class Tournament extends AbstractTournamentModel<ITournament> {
    public hasGames: boolean = false;
    public prizePool: ITournamentPrize[];
    public prizeTable: IPrizeRow[];

    private _id: number;

    constructor(
        from: IFromLog,
        data: ITournament,
        configService: ConfigService,
        tournamentsService: TournamentsService,
    ) {
        super(
            {from: _assign({model: 'Tournament'}, from)},
            data,
            configService,
            tournamentsService,
        );
    }

    public set data(data: ITournament) {
        super.data = data;
        this.setAvailabilityGames();

        this.preparePrizePool();
        this.preparePrizeTable();
    }

    public get data(): ITournament {
        return super.data;
    }

    // default
    public get currentTime(): number {
        return this.data.CurrentTime;
    }

    public get ends(): string {
        return this.data.Ends;
    }

    public get feeType(): string {
        return this.data.FeeType || null;
    }

    public get id(): number {
        return this._id;
    }

    public get image(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image || this.configService.get('$tournaments.defaultImages.image'));
    }

    public get imagePromo(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_promo || this.configService.get('$tournaments.defaultImages.imagePromo'));
    }

    public get imageDashboard(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_dashboard || this.configService.get('$tournaments.defaultImages.imageDashboard'));
    }

    public get imageDescription(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_description || this.configService.get('$tournaments.defaultImages.imageDescription'));
    }

    /** Tournament default imageOther shall be displayed only if neither background nor decor image is set in Fundist */
    public get imageOther(): string {
        if (this.data.Image || this.data.Image_other) {
            return GlobalHelper.proxyUrl(this.data.Image_other);
        } else {
            return GlobalHelper.proxyUrl(this.configService.get('$tournaments.defaultImages.imageOther'));
        }
    }

    public get fallbackImagePromo(): string {
        return GlobalHelper.proxyUrl(this.configService.get('$tournaments.defaultImages.imagePromo'));
    }

    public get fallbackImageDashboard(): string {
        return GlobalHelper.proxyUrl(this.configService.get('$tournaments.defaultImages.imageDashboard'));
    }

    public get pointsLimit(): number {
        return _toNumber(this.data.PointsLimit);
    }

    public get pointsLimitMin(): number {
        return _toNumber(this.data.PointsLimitMin);
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

    public get starts(): string {
        return this.data.Starts;
    }

    public get type(): string {
        return this.data.Type;
    }

    public get value(): number {
        return _toNumber(this.data.Value);
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
     * @returns {string} tournament fee currency
     */
    public get feeCurrency(): string {
        const  realCurrency: string = this.useUsersCurrency ? this.userCurrency : 'EUR';
        return (this.feeType === 'loyalty') ? 'LP' : realCurrency;
    }

    /**
     * @returns {number} tournament total founds
     */
    public get totalFounds(): number {
        return _toNumber(this.targetDefaultCurrency === 'EUR'
            ? this.data.TotalFounds?.EUR
            : this.data.TotalFounds?.Currency,
        );
    }

    /**
     * @returns {number[]} tournament winningSpread
     */
    public get winningSpread(): number[] {
        const winningsArr = this.targetDefaultCurrency === 'EUR'
            ? this.data.WinningSpread?.EUR
            : this.data.WinningSpread?.Currency;
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
     * @returns {DateTime} returns the date for the tournament based on its state
     */
    public get stateDateTournament(): DateTime {
        return this.isTournamentStarts ? this.endsLuxon : this.startsLuxon;
    }

    /**
     * @returns {boolean} is tournament end
     */
    public get isTournamentEnds(): boolean {
        const timeDifference = this.endsLuxon.toMillis() - DateTime.local().toMillis();
        return timeDifference < 0;
    }

    public get gamesFilterData(): ITournamentGames {
        return this.data.Games;
    }

    public get freeRoundGames(): TFreeRoundGames {
        return this.data.FreeroundGames;
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

    /**
     * @returns {string} tournament tag
     */

    public get tag(): string {
        return this.isSelected
            ? 'Active'
            : this.isTournamentStarts
                ? 'Available'
                : 'Coming soon';
    }

    protected setAvailabilityGames(): void {
        const {Games = [], Categories = [], Merchants = []} = this.data.Games ?? {};
        this.hasGames = !!(Games.length || Categories.length || Merchants.length);
        this._id = _toNumber(this.data.ID);
    }

    protected preparePrizePool(): void {
        const prizes: TCurrency = this.target === 'bonus'
            ? this.data.TotalFounds.Currency
            : this.totalFounds;
        this.prizePool = this.transformPrizes(prizes);
    }

    protected preparePrizeTable(): void {
        const currency: string = this.targetDefaultCurrency;
        const winningsArr: TCurrency[] = (this.target === 'bonus' || currency !== 'EUR')
            ? this.data.WinningSpread?.Currency
            : this.data.WinningSpread?.EUR;

        this.prizeTable = _reduce(winningsArr, (res: IPrizeRow[], item: TCurrency, index: number) => {
            res.push({
                place: index + 1,
                prize: this.transformPrizes(item),
            });
            return res;
        }, []);
    }

    private transformPrizes(rawPrizeRow: TCurrency): ITournamentPrize[] {
        const prizes: ITournamentPrize[] = [];
        const currency: string = this.targetDefaultCurrency;

        if (typeof rawPrizeRow === 'object') {
            const moneyPrize: number = _toNumber(rawPrizeRow[currency]);
            const specialCurrencies: ReadonlySet<String> = CurrenciesInfo.specialCurrencies;
            const specialPrizes: ITournamentPrize[] = _reduce(Array.from(specialCurrencies),
                (result: ITournamentPrize[], currency: string) => {
                    const value: number = _toNumber(rawPrizeRow[currency]);
                    if (value) {
                        result.push({currency, value});
                    }
                    return result;
                }, []);

            if (moneyPrize) {
                prizes.push({
                    currency,
                    value: moneyPrize,
                });
            }

            prizes.push(...specialPrizes);
        } else {
            prizes.push({
                currency,
                value: _toNumber(rawPrizeRow),
            });
        }
        return prizes;
    }
}
