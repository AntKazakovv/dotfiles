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
import _some from 'lodash-es/some';
import _isNil from 'lodash-es/isNil';
import _map from 'lodash-es/map';

import {Tournament} from '../../models/tournament.model';
import {TournamentHistory} from 'wlc-engine/modules/tournaments/system/models/tournament-history.model';
import {ITournamentHistory} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
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
} from 'wlc-engine/modules/core';
import {
    ITournament,
    RestType,
    IGetSubscribeParams,
    IQueryParams,
    ITournamentUserStats,
    ITopTournamentUsers,
    ITournamentUser,
} from '../../interfaces/tournaments.interface';
import {UserProfile} from 'wlc-engine/modules/user';

interface ITournamentData extends IData {
    data?: ITournament;
}

@Injectable({
    providedIn: 'root',
})
export class TournamentsService {
    public tournaments: Tournament[] = [];
    public isProcessed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public updateData: boolean = true;

    private subjects = {
        tournaments$: new BehaviorSubject<Tournament[]>(null),
        active$: new BehaviorSubject<Tournament[]>(null),
        history$: new BehaviorSubject<TournamentHistory[]>(null),
    };

    private winnersSubjects: IIndexing<BehaviorSubject<ITopTournamentUsers>> = {};

    private profile: UserProfile = {} as UserProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private winLimit = this.configService.get<number>('$tournaments.winLimit') || 10;
    private winnersLimit: IIndexing<number> = {};

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private logService: LogService,
    ) {
        this.registerMethods();
        this.setSubscribers();
    }

    public get isTournamentSelected(): boolean {
        return _some(this.tournaments, tournament => tournament.isSelected);
    }

    public get hasTournaments(): boolean {
        return !!this.tournaments.length;
    }

    /**
     * Get subscribtion from tournament observer
     *
     * @param {IGetSubscribeParams} params params for subscribtion
     * @returns {Subscription} subsctibtion
     */
    public getSubscribe(params: IGetSubscribeParams): Subscription {
        if (params.useQuery) {
            this.queryTournaments(true, params?.type);
        }

        return this.getObserver(params?.type).pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(params.observer);
    }

    /**
     * Get tournaments observer from tournaments subjects by rest type
     *
     * @param {RestType} type bonuses rest type ('active' | 'history' | 'any')
     * @returns {Observable<Tournament[]>} Observable
     */
    public getObserver<T extends Tournament[] | TournamentHistory[]>(type?: RestType): Observable<T> {
        let flow$: BehaviorSubject<Tournament[] | TournamentHistory[]>;

        switch (type) {
            case 'active':
                flow$ = this.subjects.active$;
                break;
            case 'history':
                flow$ = this.subjects.history$;
                break;
            default:
                flow$ = this.subjects.tournaments$;
                break;
        }

        return (flow$ as BehaviorSubject<T>).asObservable();
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
     * @param {Tournament} tournament Tournament object
     * @returns {Tournament} Tournament object
     */
    public async joinTournament(tournament: Tournament): Promise<Tournament> {
        const params = {ID: tournament.id, Selected: 1};

        try {
            this.isProcessed$.next(true);
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
            this.showSuccess(gettext('Tournament join success'));
            return response.data;
        } catch (error) {
            this.showError(gettext('Tournament join failed'), error?.errors);
        } finally {
            this.isProcessed$.next(false);
        }
    }

    /**
     * Leave tournament
     *
     * @param {Tournament} tournament Tournament object
     * @returns {Tournament} Tournament object
     */
    public async leaveTournament(tournament: Tournament): Promise<Tournament> {
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
     * @param {boolean} publicSubject is public rxjs subject from query
     * @param {RestType} type bonuses rest type ('active' | 'history' | 'any') (no required)
     * @returns {Tournament[]} bonuses array
     */
    public async queryTournaments(
        publicSubject: boolean,
        type?: RestType,
    ): Promise<Tournament[] | TournamentHistory[]> {
        let tournaments: Tournament[] | TournamentHistory[] = [];
        const queryParams: IQueryParams = {};

        if (type === 'active' || type === 'history') {
            queryParams.type = type;
        }

        try {
            const res: IData<ITournament[] | ITournamentHistory[]> = await this.dataService.request(
                'tournaments/tournaments', queryParams,
            );
            const result = this.modifyTournaments(res.data, type);
            tournaments = this.checkForbid(result, type);

            switch (type) {
                case 'active':
                    publicSubject ? this.subjects.active$.next(tournaments as Tournament[]) : null;
                    break;
                case 'history':
                    publicSubject ? this.subjects.history$.next(tournaments as TournamentHistory[]) : null;
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

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'tournaments',
            system: 'tournaments',
            url: '/tournaments',
            type: 'GET',
        });
    }

    private checkForbid(
        tournaments: Tournament[] | TournamentHistory[],
        type: RestType,
    ): Tournament[] | TournamentHistory[] {
        const userCategory: string = _get(this.profile, 'info.category', '').toLowerCase();
        const forbiddenCategories = this.configService.get<IIndexing<IForbidBanned>>('$loyalty.forbidBanned');

        if (
            this.useForbidUserFields &&
            (
                _get(this.profile, 'info.loyalty.ForbidTournaments') === '1' ||
                _get(forbiddenCategories, `${userCategory}.ForbidTournaments`, false)
            ) &&
            type !== 'history' && type !== 'active'
        ) {
            tournaments = _filter(tournaments as Tournament[], (item: Tournament) => item.isSelected);
        }

        return tournaments;
    }

    private modifyTournaments(
        data: ITournament[] | ITournamentHistory[],
        type: RestType,
    ): TournamentHistory[] | Tournament[] {
        if (data?.length) {

            if (type === 'history') {
                const queryTournaments = _map<ITournamentHistory, TournamentHistory>(
                    data as ITournamentHistory[],
                    (item: ITournamentHistory) => {
                        return new TournamentHistory(
                            {service: 'TournamentsService', method: 'modifyTournaments'},
                            item,
                            this.configService,
                            this,
                        );
                    });

                return _filter(
                    queryTournaments,
                    (item: TournamentHistory) => item.status !== -1,
                );
            } else {
                const queryTournaments = _map<ITournament, Tournament>(
                    data as ITournament[],
                    (item: ITournament) => {
                        return new Tournament(
                            {service: 'TournamentsService', method: 'modifyTournaments'},
                            item,
                            this.configService,
                            this,
                        );
                    });

                return _filter(
                    queryTournaments,
                    (item: Tournament) => item.status !== -1,
                );
            }
        }
    }

    private setSubscribers() {

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .subscribe((userProfile) => {
                this.profile = userProfile;
            });

        this.subjects.tournaments$.subscribe({
            next: (tournaments: Tournament[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_SUCCEEDED',
                    data: tournaments,
                });
            },
        });

        this.subjects.active$.subscribe({
            next: (tournaments: Tournament[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_ACTIVE_SUCCESS',
                    data: tournaments,
                });
            },
        });

        this.subjects.history$.subscribe({
            next: (tournaments: TournamentHistory[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_HISTORY_SUCCESS',
                    data: tournaments,
                });
            },
        });

        this.eventService.subscribe([
            {name: 'LOGIN'},
            {name: 'LOGOUT'},
            {name: 'PROFILE_UPDATE'},
            {name: 'TOURNAMENT_JOIN_SUCCEEDED'},
            {name: 'TOURNAMENT_LEAVE_SUCCEEDED'},
        ], () => {
            this.updateSubscribers();
        });
    }

    private showError(title: string, errors: string[]): void {
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
        if (this.subjects.active$.observers.length > 1) {
            this.queryTournaments(true, 'active');
        }
        if (this.subjects.tournaments$.observers.length > 1) {
            this.queryTournaments(true);
        }
        if (this.subjects.history$.observers.length > 1) {
            this.queryTournaments(true, 'history');
        }
    }

    private prepareTournamentActionData(res: unknown, tournament: Tournament): Tournament {
        _extend(tournament.data, res);
        return tournament;
    }
}
