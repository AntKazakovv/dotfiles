import {Injector} from '@angular/core';
import {
    AbstractModel,
    ConfigService,
    CachingService,
    LayoutService,
} from 'wlc-engine/modules/core';
import {GamesCatalogService} from 'wlc-engine/modules/games';
import {Game} from 'wlc-engine/modules/games/system/models/game.model';
import {GamesHelper} from 'wlc-engine/modules/games/system/helpers/games.helpers';
import {
    ITournament,
    ITopTournamentUsers,
    ITournamentPlace,
} from '../interfaces/tournaments.interface';
import {TournamentsService} from '../services';
import {
    PartialObserver,
    Subscription,
    pipe,
    Observable,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {DateTime} from 'luxon';

import {
    toNumber as _toNumber,
    toString as _toString,
    map as _map,
    each as _each,
    uniqBy as _uniqBy,
    remove as _remove,
    filter as _filter,
} from 'lodash-es';

export class Tournament extends AbstractModel<ITournament> {
    public topWin: ITournamentPlace[];
    protected userCurrency: string;
    protected GamesCatalogService: GamesCatalogService;

    constructor(
        data: ITournament,
        protected ConfigService: ConfigService,
        protected cachingService: CachingService,
        protected tournamentsService: TournamentsService,
        protected layoutService: LayoutService,
        protected injector: Injector,
    ) {
        super();
        this.data = data;
        this.userCurrency = this.ConfigService.get<string>('appConfig.user.currency') || 'EUR';
        this.layoutService.importModules(['games']);
        this.GamesCatalogService = this.injector.get(GamesCatalogService);
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
        return this.data.Image_promo?.length ? this.data.Image_promo : this.data.Image;
    }

    public get imageDashboard(): string {
        return this.data.Image_dashboard?.length ? this.data.Image_dashboard : this.data.Image;
    }

    public get imageDescription(): string {
        return this.data.Image_description?.length ? this.data.Image_description : this.data.Image;
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
    public get maxBet(): number {
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
     * @returns {number} tournament fee amount
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
     * @returns {string} tournament fee currency
     */
    public get feeCurrency(): string {
        return (this.feeType === 'loyalty') ? 'LP' : this.userCurrency;
    }

    /**
     * @returns {string} tournament target currency
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
     * @returns {Game[]} tournament games array
     */
    public get games(): Game[] {
        let games: Game[] = [];

        if (this.data.Games.Games?.length) {
            _each(this.data.Games.Games, (id) => {
                const game = this.GamesCatalogService.getGameById(id);
                if (game) {
                    games.push(game);
                }
            });
        } else {
            games = this.GamesCatalogService.getGameList({
                categories: _map(this.data.Games.Categories, (id: number) => GamesHelper.getCategoryNameById(id)),
                excludeCategories: _map(this.data.Games.CategoriesBL, (id: number) => GamesHelper.getCategoryNameById(id)),
                merchants: this.data.Games.Merchants || [],
                excludeMerchants: this.data.Games.MerchantsBL || [],
            });
        }

        games = _filter(games, (game: Game) => !this.data.Games.GamesBL.includes(game.ID));

        return _uniqBy(games, 'ID');
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
     * Winners subscription
     *
     * @param {PartialObserver<ITopTournamentUsers>} observer observer
     * @param {} params until?: Observable<unknown>, limit?: number, start?: number
     * @returns {Subscription} Winners subscription
     */
    public getWinnersSubscribe(
        observer: PartialObserver<ITopTournamentUsers>,
        params?: {
            until?: Observable<unknown>,
            limit?: number,
            start?: number
        }): Subscription {
        const winnersSubject = this.tournamentsService.getWinnersSubjects(this.id, params?.until, params?.limit);

        if (winnersSubject.observers.length === 0) {
            this.tournamentsService.getTournamentTop(this.id, params?.limit, params?.start);
        }

        return winnersSubject.pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(observer);
    }

    /**
     * Get tournament top array
     *
     * @param {ITopTournamentUsers} result tournament top users
     * @returns {ITournamentPlace[]} tournament top array
     */

    public getTopArray(result: ITopTournamentUsers): ITournamentPlace[] {
        const topWin = result?.results || [];

        if (result?.user) {
            if (_toNumber(result.user.Place) > topWin.length || !result.user.Place) {
                topWin.push({
                    Email: this.ConfigService.get<string>('appConfig.user.Email')?.substring(0, 6) + '***',
                    FirstName: this.ConfigService.get<string>('appConfig.user.first_name'),
                    IDUser: result.user.IDUser,
                    IDUserPlace: result.user.Place || '-',
                    LastName: this.ConfigService.get<string>('appConfig.user.last_name'),
                    Login: this.ConfigService.get<string>('appConfig.user.user_id'),
                    Points: _toString(result.user.Points),
                    UserLogin: this.ConfigService.get<string>('appConfig.user.login'),
                    Win: _toNumber(result.user.Win),
                });
            }
        }

        _each(topWin, (item: ITournamentPlace) => {
            item.points = _toNumber(item.Points);
            if (!item.UserLogin?.length) {
                item.UserLogin = this.getUserLogin(item);
            }
        });

        return _uniqBy(topWin, 'IDUser');
    }

    protected getUserLogin(item: ITournamentPlace): string {
        if (item.FirstName?.length && item.LastName?.length) {
            return item.FirstName + ' ' + item.LastName.substring(0, 1);
        } else {
            return item.Email.substring(0, 6) + '***';
        }
    }
}
