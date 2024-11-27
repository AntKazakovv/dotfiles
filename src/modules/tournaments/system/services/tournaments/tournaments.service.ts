import {Injectable} from '@angular/core';

import {
    BehaviorSubject,
    Subscription,
    Observable,
    pipe,
    interval,
} from 'rxjs';
import {
    takeUntil,
    filter,
    tap,
} from 'rxjs/operators';

import _filter from 'lodash-es/filter';
import _extend from 'lodash-es/extend';
import _isObject from 'lodash-es/isObject';
import _get from 'lodash-es/get';
import _isNil from 'lodash-es/isNil';
import _map from 'lodash-es/map';

import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';
import {Marathon} from 'wlc-engine/modules/tournaments/system/models/marathon.model';
import {
    IData,
    ConfigService,
    EventService,
    LogService,
    DataService,
    IIndexing,
    IForbidBanned,
    IPushMessageParams,
    NotificationEvents,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    RestType,
    IGetSubscribeParams,
    IQueryParams,
    ITournamentUserStats,
    ITopTournamentUsers,
    ITournamentUser,
    IJoinTournamentParams,
    TournamentEvents,
    IBuyFreeSpinsParams,
    TTournamentType,
    TTournamentModel,
    TTournamentInterface,
    IMarathon,
    ILeague,
    ITournament,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {UserProfile} from 'wlc-engine/modules/user';
import {MultiWalletEvents} from 'wlc-engine/modules/multi-wallet';
import {WalletsService} from 'wlc-engine/modules/multi-wallet/system/services/wallets.service';

interface ITournamentData extends IData {
    data?: TTournamentInterface;
}

/**
 * @param {boolean} publicSubject is public rxjs subject from query
 * @param {RestType} type bonuses rest type ('active' | 'any')
 * @param {TTournamentType} tournamentType type of tournaments ('general' | 'marathon' | 'league')
 * @param {string} promoCode promo code
 */
export interface IQueryTournamentsParams {
    publicSubject?: boolean,
    type?: RestType,
    tournamentType?: TTournamentType,
    promoCode?: string,
}

@Injectable({
    providedIn: 'root',
})
export class TournamentsService {
    public tournaments: Tournament[] = [];
    public isProcessed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public profile: UserProfile = {} as UserProfile;
    public walletsService: WalletsService;

    private subjects = {
        tournaments$: new BehaviorSubject<Tournament[]>(null),
        activeTournaments$: new BehaviorSubject<Tournament[]>(null),
        marathons$: new BehaviorSubject<Marathon[]>(null),
        leagues$: new BehaviorSubject<League[]>(null),
    };

    private winnersSubjects: IIndexing<BehaviorSubject<ITopTournamentUsers>> = {};

    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private winLimit = this.configService.get<number>('$tournaments.winLimit') || 10;
    private winnersLimit: IIndexing<number> = {};

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
        private injectionService: InjectionService,
    ) {
        this.setMultiWallet();
        this.registerMethods();
        this.setSubscribers();
    }

    /**
     * Get subscribtion from tournament observer
     *
     * @param {IGetSubscribeParams} params params for subscribtion
     * @returns {Subscription} subsctibtion
     */
    public getSubscribe<T extends TTournamentModel>(params: IGetSubscribeParams): Subscription {
        if (params.useQuery) {
            this.queryTournaments<T>({
                publicSubject: true,
                type: params?.type,
                tournamentType: params?.tournamentType,
            });
        }

        return this.getObserver(params?.type, params?.tournamentType).pipe(
            params.pipes ?? pipe(),
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(params.observer);
    }

    /**
     * Get tournaments observer from tournaments subjects by rest type
     *
     * @param {RestType} type bonuses rest type ('active' | 'any')
     * @param {TTournamentType} tournamentType type of tournaments ('general' | 'marathon' | 'league')
     * @returns {Observable<TTournamentModel[]>} Observable
     */
    public getObserver<T extends TTournamentModel>(
        type: RestType = 'any',
        tournamentType: TTournamentType = 'general',
    ): Observable<T[]> {
        let flow$: BehaviorSubject<TTournamentModel[]>;

        switch (true) {
            case tournamentType === 'marathon':
                flow$ = this.subjects.marathons$;
                break;
            case tournamentType === 'league':
                flow$ = this.subjects.leagues$;
                break;
            case tournamentType === 'general' && type === 'active':
                flow$ = this.subjects.activeTournaments$;
                break;
            default:
                flow$ = this.subjects.tournaments$;
                break;
        }

        return (flow$ as BehaviorSubject<T[]>).asObservable();
    }

    /**
     * Get winners subjects
     *
     * @param {number} tournamentID tournament id
     * @param {Observable<unknown>} until until observable
     * @param {number} limit limit of tops
     * @param {number} intervalValue get top interval
     * @returns {BehaviorSubject<ITopTournamentUsers>} tournament winners subjects
     */
    public getWinnersSubjects(
        tournamentID: number,
        until?: Observable<unknown>,
        limit?: number,
        intervalValue: number = 15000,
    ): BehaviorSubject<ITopTournamentUsers> {

        if (!_isNil(limit)) {
            if (limit === 0) {
                this.winnersLimit[tournamentID] = 0;
            } else if (!!this.winnersLimit[tournamentID] && limit > this.winnersLimit[tournamentID]) {
                this.winnersLimit[tournamentID] = limit;
            }
        }

        if (!this.winnersSubjects[tournamentID]) {
            this.winnersSubjects[tournamentID] = new BehaviorSubject(null);
        }

        const winnersInterval = interval(intervalValue)
            .pipe((until) ? takeUntil(until) : pipe())
            .pipe(filter(() => !!this.winnersSubjects[tournamentID].observers.length))
            .pipe(tap(() => this.getTournamentTop(tournamentID, this.winnersLimit[tournamentID])));

        winnersInterval.subscribe();

        return this.winnersSubjects[tournamentID];
    }

    /**
     * Get tournament top
     *
     * @param {number} id tournament id
     * @param {number} limit limit of tops
     * @param {number} start tops from place
     * @returns {Promise<ITopTournamentUsers>} tournament top users promise
     */
    public async getTournamentTop(id: number, limit: number = -1, start: number = 0): Promise<ITopTournamentUsers> {

        if (!start && limit === -1) {
            limit = this.winLimit;
        }

        const params = {
            limit: limit,
            start: start,
        };

        if (limit === 0) {
            delete params.limit;
        }

        try {
            const response: IData = await this.dataService.request({
                name: 'tournamentTop',
                system: 'tournaments',
                url: `/tournaments/${id}/top`,
                type: 'GET',
                events: {
                    success: 'TOURNAMENT_TOP_SUCCEEDED',
                    fail: 'TOURNAMENT_TOP_FAILED',
                },
            }, params);
            if (!this.winnersSubjects[id]) {
                this.getWinnersSubjects(id);
            }
            this.winnersSubjects[id].next(response.data);

            return response.data as ITopTournamentUsers;
        } catch (error) {
            this.logService.sendLog({code: '13.0.2', data: error});
        }
    }

    /**
     * Get tournament by id
     *
     * @param {number} id tournament id
     * @returns {Tournament} tournament object
     */
    public async getTournament(id: number): Promise<Tournament | void> {
        try {
            const data: ITournamentData = await this.dataService.request({
                name: 'tournamentById',
                system: 'tournaments',
                url: `/tournaments/${id}`,
                type: 'GET',
            });
            if (_isObject(data.data)) {
                return new Tournament(
                    {service: 'TournamentsService', method: 'getTournament'},
                    data.data,
                    this.configService,
                    this,
                );
            } else {
                this.logService.sendLog({code: '13.0.1', data: data.data});
            }
        } catch (error) {
            this.logService.sendLog({code: '13.0.1', data: error});
        }
    }

    /**
     * Join tournament
     *
     * @param {TTournamentModel} tournament TTournamentModel object
     * @returns {TTournamentModel} TTournamentModel object
     */
    public async joinTournament<T extends TTournamentModel>(tournament: T, walletId?: number): Promise<T | never> {
        const params: IJoinTournamentParams = {ID: tournament.id, Selected: 1};
        try {
            this.isProcessed$.next(true);

            const isMultiWallet: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

            if (isMultiWallet) {
                params.wallet = walletId || this.profile.extProfile.currentWallet.walletId;
            }

            const response: IData = await this.dataService.request({
                name: 'tournamentSubscribe',
                system: 'tournaments',
                url: `/tournaments/${tournament.id}`,
                type: 'POST',
                mapFunc: (res) => this.prepareTournamentActionData(res, tournament),
                events: {
                    success: 'TOURNAMENT_JOIN_SUCCEEDED',
                    fail: 'TOURNAMENT_JOIN_FAILED',
                },
            }, params);

            if (tournament.tournamentType === 'league') {
                this.showSuccess(gettext('You have successfully joined the league'));
            } else {
                this.showSuccess(gettext('Tournament join success'));
            }

            return response.data;
        } catch (error) {
            if (tournament.tournamentType === 'league') {
                this.showError(gettext('An error has occurred when joining the league'), error?.errors);
            } else {
                this.showError(gettext('Tournament join failed'), error?.errors);
            }

            this.logService.sendLog({code: '13.0.5', data: error});
        } finally {
            this.isProcessed$.next(false);
        }
    }

    /**
     * Leave tournament
     *
     * @param {TTournamentModel} tournament TTournamentModel object
     * @returns {TTournamentModel} TTournamentModel object
     */
    public async leaveTournament<T extends TTournamentModel>(tournament: T): Promise<T> {
        const params = {ID: tournament.id, Selected: 0};

        try {
            const response: IData = await this.dataService.request({
                name: 'tournamentleave',
                system: 'tournaments',
                url: `/tournaments/${tournament.id}`,
                type: 'POST',
                mapFunc: (res) => this.prepareTournamentActionData(res, tournament),
                events: {
                    success: 'TOURNAMENT_LEAVE_SUCCEEDED',
                    fail: 'TOURNAMENT_LEAVE_FAILED',
                },
            }, params);
            this.showSuccess(gettext('Tournament leave success'));
            return response.data;
        } catch (error) {
            this.showError(gettext('Tournament leave failed'), error?.errors);
        }
    }

    /**
     * Get tournaments
     *
     * @param {IQueryTournamentsParams} params method params
     * @returns {TTournamentModel[]} bonuses array
     */
    public async queryTournaments<T extends TTournamentModel>(params: IQueryTournamentsParams): Promise<T[]> {
        let tournaments: T[] = [];
        const {publicSubject, tournamentType, type, promoCode} = params;
        const queryParams: IQueryParams = {};

        if (type && type !== 'any') {
            queryParams.type = type;
        }

        if (tournamentType && tournamentType !== 'general') {
            queryParams.TournamentType = tournamentType;
        }

        if (promoCode) {
            queryParams.PromoCode = promoCode;
        }

        if (this.configService.get<string>('$base.defaultCurrency') != 'EUR'
            && !this.configService.get('$user.isAuthenticated')) {
            queryParams.currency = this.configService.get<string>('$base.defaultCurrency');
        }

        try {
            const res: IData<TTournamentInterface[]> = await this.dataService.request(
                'tournaments/tournaments', queryParams,
            );

            if (res.data?.length) {
                Tournament.selectedTournaments = false;
                Tournament.hasAllowStack = false;

                const result: T[] = this.modifyTournaments<T>(res.data, Date.parse(res.headers.get('Date')));
                tournaments = this.checkForbid<T>(result, type);
            }

            switch (true) {
                case tournamentType === 'marathon':
                    publicSubject ? this.subjects.marathons$.next(tournaments as Marathon[]) : null;
                    break;
                case tournamentType === 'league':
                    publicSubject ? this.subjects.leagues$.next(tournaments as League[]) : null;
                    break;
                case tournamentType === 'general' && type === 'active':
                    publicSubject ? this.subjects.activeTournaments$.next(tournaments as Tournament[]) : null;
                    break;
                default:
                    publicSubject ? this.subjects.tournaments$.next(tournaments as Tournament[]) : null;
                    this.tournaments = tournaments as Tournament[];
                    break;
            }

            return tournaments;
        } catch (error) {
            this.logService.sendLog({code: '13.0.0', data: error});
            this.eventService.emit({
                name: 'TOURNAMENTS_FETCH_FAILED',
                data: error,
            });
        }
    }

    public async buyFreeRoundsPackage(tournamentId: number, params: IBuyFreeSpinsParams): Promise<void>  {
        try {
            const isMultiWallet: boolean = this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet');

            if (isMultiWallet) {
                params.wallet = this.profile.extProfile.currentWallet.walletId;
            }
            const response: IData = await this.dataService.request({
                name: 'buyFreeRoundsPackage',
                system: 'tournaments',
                url: `/tournaments/${tournamentId}`,
                type: 'POST',
                events: {
                    success: TournamentEvents.buyFreeSpins,
                },
            }, params);
            return response.data;
        } catch (error) {
            this.showError(gettext('Free spins'), error?.errors);
        }
    }
    /**
     * Get user stats
     *
     * @returns {Promise<ITournamentUserStats>} tournament user stats
     */
    public async getUserStats(): Promise<ITournamentUserStats> {
        try {
            const res: IData = await this.dataService.request('tournaments/tournaments', {type: 'userstats'});
            return res.data as ITournamentUserStats;
        } catch (error) {
            this.logService.sendLog({code: '13.0.3', data: error});
        }
    }

    /**
     * Get tournament user
     *
     * @param {number} id tournament id
     * @returns {Promise<ITournamentUser>} tournament user data promise
     */
    public async getTournamentUser(id: number): Promise<ITournamentUser> {
        try {
            const response: IData = await this.dataService.request({
                name: 'tournamentUser',
                system: 'tournaments',
                url: `/tournaments/${id}/user`,
                type: 'GET',
                events: {
                    success: 'TOURNAMENT_USER_SUCCEEDED',
                    fail: 'TOURNAMENT_USER_FAILED',
                },
            });
            if (response.data?.result) {
                return response.data.result as ITournamentUser;
            }
        } catch (error) {
            this.logService.sendLog({code: '13.0.4', data: error});
        }
    }

    /**
     * Update tournament list
     */
    public updateTournaments(): void {
        this.updateSubscribers();
    }

    public showError(title: string, errors: string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message: errors,
                wlcElement: 'notification_tournament-error',
            },
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'tournaments',
            system: 'tournaments',
            url: '/tournaments',
            type: 'GET',
        });
    }

    private checkForbid<T extends TTournamentModel>(
        tournaments: T[],
        type: RestType,
    ): T[] {
        const userCategory: string = _get(this.profile, 'info.category', '').toLowerCase();
        const forbiddenCategories = this.configService.get<IIndexing<IForbidBanned>>('$loyalty.forbidBanned');

        if (
            this.useForbidUserFields &&
            (
                _get(this.profile, 'info.loyalty.ForbidTournaments') === '1' ||
                _get(forbiddenCategories, `${userCategory}.ForbidTournaments`, false)
            ) && type !== 'active'
        ) {
            tournaments = _filter(tournaments, (item: T) => item.isSelected);
        }

        return tournaments;
    }

    private modifyTournaments<T extends TTournamentModel>(
        data: TTournamentInterface[],
        tournamentsServerTime: number,
    ): T[] {
        Tournament.serverTime = tournamentsServerTime;
        const queryTournaments: T[] = _map(
            data,
            (item: TTournamentInterface): T => {
                switch (item.TournamentType) {
                    case 'marathon':
                        return new Marathon(
                            {service: 'TournamentsService', method: 'modifyTournaments'},
                            item as IMarathon,
                            this.configService,
                            this,
                        ) as T;
                    case 'league':
                        return new League(
                            {service: 'TournamentsService', method: 'modifyTournaments'},
                            item as ILeague,
                            this.configService,
                            this,
                        ) as T;
                    case 'general':
                    default:
                        return new Tournament(
                            {service: 'TournamentsService', method: 'modifyTournaments'},
                            item as ITournament,
                            this.configService,
                            this,
                        ) as T;
                }
            });

        return _filter(
            queryTournaments,
            (item: T) => item.status !== -1,
        );

    }

    private setSubscribers(): void {

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .subscribe((userProfile) => {
                this.profile = userProfile;
            });

        this.eventService.subscribe([
            {name: MultiWalletEvents.CurrencyConversionChanged},
        ], () => {
            this.updateTournaments();
        });

        this.subjects.tournaments$.subscribe({
            next: (tournaments: Tournament[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_SUCCEEDED',
                    data: tournaments,
                });
            },
        });

        this.subjects.activeTournaments$.subscribe({
            next: (tournaments: Tournament[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_ACTIVE_SUCCESS',
                    data: tournaments,
                });
            },
        });

        this.subjects.marathons$.subscribe({
            next: (marathons: Marathon[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_MARATHONS_SUCCESS',
                    data: marathons,
                });
            },
        });

        this.subjects.leagues$.subscribe({
            next: (leagues: League[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_LEAGUES_SUCCESS',
                    data: leagues,
                });
            },
        });

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
            {name: 'PROFILE_UPDATE'},
            {name: 'TOURNAMENT_JOIN_SUCCEEDED'},
            {name: 'TOURNAMENT_LEAVE_SUCCEEDED'},
            {name: MultiWalletEvents.CurrencyConversionChanged},
            {name: TournamentEvents.buyFreeSpins},
        ], () => {
            this.updateSubscribers();
        });
    }

    private showSuccess(title: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title,
                message: '',
                wlcElement: 'notification_tournament-success',
            },
        });
    }

    private updateSubscribers(): void {
        if (this.subjects.marathons$.observers.length > 1) {
            this.queryTournaments({publicSubject: true, tournamentType: 'marathon'});
        }

        if (this.subjects.leagues$.observers.length > 1) {
            this.queryTournaments({publicSubject: true, tournamentType: 'league'});
        }

        if (this.subjects.tournaments$.observers.length > 1) {
            this.queryTournaments({publicSubject: true, tournamentType: 'general'});
        }

        if (this.subjects.activeTournaments$.observers.length > 1) {
            this.queryTournaments({publicSubject: true, type: 'active', tournamentType: 'general'});
        }
    }

    private prepareTournamentActionData<T extends TTournamentModel>(res: unknown, tournament: T): T {
        _extend(tournament.data, res);
        return tournament;
    }

    private async setMultiWallet(): Promise<void> {
        if (this.configService.get<boolean>('appConfig.siteconfig.isMultiWallet')) {
            this.walletsService = await this.injectionService.getService<WalletsService>('multi-wallet.wallet-service');
        }
    }
}
