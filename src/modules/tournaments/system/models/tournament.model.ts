import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';
import _reduce from 'lodash-es/reduce';
import _isNil from 'lodash-es/isNil';
import _isObject from 'lodash-es/isObject';

import {
    ConfigService,
    IFromLog,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {TFreeRoundGames} from 'wlc-engine/modules/core/system/interfaces/fundist.interface';
import {
    IAdditionalFreeSpins,
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
    public static selectedTournaments: boolean = false;
    public static hasAllowStack: boolean = false;

    private _id: number;
    private static _serverTimeUTC: number = null;

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
        if (this.isSelected) {
            Tournament.selectedTournaments = true;

            if (this.allowStack !== '0') {
                Tournament.hasAllowStack = true;
            }
        }
    }

    public static set serverTime(time: number) {
        if (!_isNil(time)) {
            Tournament._serverTimeUTC = time;
        }
    }

    public override set data(data: ITournament) {
        super.data = data;
        this.setAvailabilityGames();

        this.configService.ready.then(() => {
            this.preparePrizePool();
            this.preparePrizeTable();
        });
    }

    public override get data(): ITournament {
        return super.data;
    }

    public get canJoin(): boolean {
        if (Tournament.selectedTournaments) {
            if (Tournament.hasAllowStack) {
                return !this.isSelected && this.allowStack !== '0' && this.isTournamentStarts;
            } else {
                return false;
            }
        }
        return this.isTournamentStarts;
    }

    public get onlyForLevels(): string[] {
        if (!!this.data.ShowOnly) {
            return this.data.OnlyForLevels;
        }
    }

    // default
    public get currentTime(): number {
        return this.data.CurrentTime;
    }

    public get allowStack(): string {
        return this.data.AllowStack;
    }

    public get ends(): string {
        return this.data.Ends;
    }

    public override get feeType(): string {
        return this.data.FeeType || null;
    }

    public override get id(): number {
        return this._id;
    }

    public override get image(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image || this.configService.get('$tournaments.defaultImages.image'));
    }

    public override get imagePromo(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_promo || this.configService.get('$tournaments.defaultImages.imagePromo'));
    }

    public override get imageDashboard(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_dashboard || this.configService.get('$tournaments.defaultImages.imageDashboard'));
    }

    public override get imageDescription(): string {
        return GlobalHelper.proxyUrl(
            this.data.Image_description || this.configService.get('$tournaments.defaultImages.imageDescription'));
    }

    /** Tournament default imageOther shall be displayed only if neither background nor decor image is set in Fundist */
    public override get imageOther(): string {
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

    public get timerText(): string {
        return this.isTournamentStarts
            ? this.configService.get<string>('$tournaments.timerTextAfterStart')
            : this.configService.get<string>('$tournaments.timerTextBeforeStart');
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
        const realCurrency: string = AbstractTournamentModel.useUsersCurrency ? this.userCurrency : 'EUR';
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
     * @returns {number[]} tournament winningSpread by percent
     */
    public get winningSpreadByPercent(): number[] {
        const winningsArr = this.data.WinningSpread.Percent;
        return _map(winningsArr, (item: string) => _toNumber(item));
    }

    /**
     * @returns {Dayjs} tournament start time in Dayjs format
     */
    public get startsFormat(): Dayjs {
        const defaultTime: Dayjs = dayjs(this.data.Starts, 'YYYY-MM-DD HH:mm:ss');
        return defaultTime.add(dayjs().utcOffset(), 'minute');
    }

    /**
     * @returns {Dayjs} tournament end time in Dayjs format
     */
    public get endsFormat(): Dayjs {
        const defaultTime: Dayjs = dayjs(this.data.Ends, 'YYYY-MM-DD HH:mm:ss');
        return defaultTime.add(dayjs().utcOffset(), 'minute');
    }

    /**
     * @returns {boolean} is tournament start
     */
    public get isTournamentStarts(): boolean {
        const timeDifference = this.startsFormat.unix() - dayjs().unix();
        return timeDifference <= 0;
    }

    /**
     * @returns {Dayjs} returns the date for the tournament based on its state
     */
    public get stateDateTournament(): Dayjs {
        return this.isTournamentStarts ? this.endsFormat : this.startsFormat;
    }

    /**
     * @returns {boolean} is tournament end
     */
    public get isTournamentEnds(): boolean {
        const timeDifference = this.endsFormat.unix() - dayjs().unix();
        return timeDifference < 0;
    }

    public get gamesFilterData(): ITournamentGames {
        return this.data.Games;
    }

    public get freeRoundGames(): TFreeRoundGames {
        return this.data.FreeroundGames;
    }

    /**
     * @returns {string} tournament tag
     */

    public get tag(): string {
        switch (true) {
            case this.isSelected:
                return 'Active';
            case !this.isTournamentStarts:
                return 'Coming soon';
            case !!this.onlyForLevels:
                return 'Unavailable';
            default:
                return 'Available';
        }
    }

    public get serverTime(): number | null {
        return Tournament._serverTimeUTC;
    }

    public get freeRounds(): IAdditionalFreeSpins {
        return this.data.AdditionalFreerounds;
    }

    public get LTID(): number {
        return this.data.LTID;
    }

    public get merchant(): string {
        return _isObject(this.data.FreeroundGames) ? Object.keys(this.data.FreeroundGames)[0]
            : this.data.FreeroundGames;
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
        const tournamentCurrency: string = this.targetDefaultCurrency;
        const conversionCoefficient: number = (AbstractTournamentModel.useUsersCurrency
            ? this.tournamentsService.walletsService?.coefficientOriginalCurrencyConversion
            : this.tournamentsService.walletsService?.coefficientConversionEUR)
            || 1;

        if (typeof rawPrizeRow === 'object') {
            const moneyPrize: number = Number(rawPrizeRow[tournamentCurrency]);
            const specialCurrencies: ReadonlySet<String> = CurrenciesInfo.specialCurrencies;
            const specialPrizes: ITournamentPrize[] = _reduce(Array.from(specialCurrencies),
                (result: ITournamentPrize[], currency: string) => {
                    if (rawPrizeRow[currency]) {
                        const value: number = currency === 'FB'
                            ? Number(rawPrizeRow[currency][tournamentCurrency])
                            : Number(rawPrizeRow[currency]);

                        if (value) {
                            result.push({currency, value});
                        }
                    }
                    return result;
                }, []);

            if (moneyPrize) {
                prizes.push({
                    currency: this.tournamentsService.walletsService?.conversionCurrency ?? tournamentCurrency,
                    value: moneyPrize * conversionCoefficient,
                });
            }

            prizes.push(...specialPrizes);
        } else {
            prizes.push({
                currency: this.tournamentsService.walletsService?.conversionCurrency ?? tournamentCurrency,
                value: Number(rawPrizeRow) * conversionCoefficient,
            });
        }
        return prizes;
    }
}
