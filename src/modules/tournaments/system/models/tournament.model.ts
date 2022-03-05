import {DateTime} from 'luxon';

import _assign from 'lodash-es/assign';
import _toNumber from 'lodash-es/toNumber';
import _map from 'lodash-es/map';

import {
    ConfigService,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    ITournament,
    ITournamentGames,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {TournamentsService} from 'wlc-engine/modules/tournaments/system/services/tournaments/tournaments.service';
import {AbstractTournamentModel} from 'wlc-engine/modules/tournaments/system/models/abstract-tournament.model';

export class Tournament extends AbstractTournamentModel<ITournament> {
    public hasGames: boolean = false;

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

    public get fallbackImagePromo(): string {
        return this.configService.get('$tournaments.defaultImages.imagePromo');
    }

    public get fallbackImageDashboard(): string {
        return this.configService.get('$tournaments.defaultImages.imageDashboard');
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
        return (this.feeType === 'loyalty') ? 'LP' : this.userCurrency;
    }

    /**
     * @returns {number} tournament total founds
     */
    public get totalFounds(): number {
        return _toNumber(this.data.TotalFounds?.EUR);
    }

    /**
     * @returns {number[]} tournament winningSpread
     */
    public get winningSpread(): number[] {
        const winningsArr = this.data.WinningSpread?.EUR;
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
    }
}
