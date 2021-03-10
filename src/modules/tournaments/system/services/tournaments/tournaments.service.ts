import {Injectable} from '@angular/core';
import {Tournament} from '../../models/tournament';
import {
    IData,
    ConfigService,
    EventService,
    LogService,
    DataService,
    CachingService,
    IIndexing,
    IForbidBanned,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {
    ITournament,
    RestType,
    IGetSubscribeParams,
    IQueryParams,
} from '../../interfaces/tournaments.interface';
import {
    BehaviorSubject,
    Subscription,
    Observable,
    pipe,
    interval as rxInterval,
} from 'rxjs';
import {
    takeUntil,
    filter as rxFilter,
    tap as rxTap,
    skip as rxSkip,
} from 'rxjs/operators';

import {
    filter as _filter,
    includes as _includes,
    extend as _extend,
    each as _each,
    isObject as _isObject,
    get as _get,
    isArray as _isArray,
    map as _map,
    size as _size,
    unset as _unset,
    sortBy as _sortBy,
} from 'lodash-es';

interface ITournamentData extends IData {
    data?: ITournament;
}

@Injectable({
    providedIn: 'root',
})
export class TournamentsService {
    public tournaments: Tournament[] = [];

    private subjects: { [key: string]: BehaviorSubject<Tournament[]> } = {
        tournaments$: new BehaviorSubject(null),
        active$: new BehaviorSubject(null),
        history$: new BehaviorSubject(null),
    };

    private winnersSubjects: BehaviorSubject<number>[] = [];

    private profile = this.userService.userProfile;
    private useForbidUserFields = this.configService.get<boolean>('$loyalty.useForbidUserFields');
    private winLimit = this.configService.get<number>('$tournaments.winLimit') || -1;
    private winnersLimit: IIndexing<number> = {};

    constructor(
        private cachingService: CachingService,
        private dataService: DataService,
        private eventService: EventService,
        private configService: ConfigService,
        private userService: UserService,
        private logService: LogService,
    ) {
        this.registerMethods();
        this.setSubscribers();

        //TODO TO DELETE
        // HELP FOR COMPONENT /////////////////////////////////////////////
        // this.getSubscribe({
        //     useQuery: true,
        //     observer: {
        //         next: (tournaments: Tournament[]) => {
        //             if (tournaments) {
        //                 console.log('ALL', tournaments);
        //             }
        //         },
        //     },
        // });

        // this.getSubscribe({
        //     useQuery: true,
        //     observer: {
        //         next: (tournaments: Tournament[]) => {
        //             if (tournaments) {
        //                 console.log('ACTIVE', tournaments);
        //             }
        //         },
        //     },
        //     type: 'active',
        // });

        // this.getSubscribe({
        //     useQuery: true,
        //     observer: {
        //         next: (tournaments: Tournament[]) => {
        //             if (tournaments) {
        //                 console.log('HISTORY', tournaments);
        //             }
        //         },
        //     },
        //     type: 'history',
        // });
        // end HELP FOR COMPONENT ////////////////////////////////////////////
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
    public getObserver(type?: RestType): Observable<Tournament[]> {
        let flow$: BehaviorSubject<Tournament[]>;

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

        return flow$.asObservable();
    }

    public getWinnersSubjects(tournamentID: number, limit?: number, interval: number = 15000): BehaviorSubject<any> {

        if (limit !== undefined) {
            if (limit === 0) {
                this.winnersLimit['' + tournamentID] = 0;
            } else if (this.winnersLimit['' + tournamentID] !== 0 && limit > this.winnersLimit['' + tournamentID]) {
                this.winnersLimit['' + tournamentID] = limit;
            }
        }

        // if (!this.winnersSubjects[tournamentID]) {
        //     this.winnersSubjects[tournamentID] = new BehaviorSubject(null);

        //     const winnersInterval = rxInterval(interval).pipe(
        //         rxFilter(() => this.winnersSubjects[tournamentID].observers.length > 0)
        //     ).pipe(rxTap(() => this.getTournamentTop(tournamentID, this.winnersLimit['' + tournamentID]) ));

        //     winnersInterval.subscribe({next: () => {}});
        // }
        return this.winnersSubjects[tournamentID];
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
                const tournament: Tournament = new Tournament(data.data, this.configService, this.cachingService, this);
                return tournament;
            } else {
                //this.logService.sendLog({code: '10.0.1', data: data.data});
            }
        } catch (error) {
            //this.logService.sendLog({code: '10.0.1', data: error});
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
            const response: IData = await this.dataService.request({
                name: 'tournamentSubscribe',
                system: 'tournaments',
                url: `/tournament/${tournament.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareTournamentActionData(res, tournament),
                events: {
                    success: 'TOURNAMENT_JOIN_SUCCEEDED',
                    fail: 'TOURNAMENT_JOIN_FAILED',
                },
            }, params);
            this.showSuccess(gettext('Tournament join success'));
            return response.data;
        } catch (error) {
            this.showError(gettext('Tournament join failed'), error?.errors);
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
                url: `/tournament/${tournament.id}`,
                type: 'POST',
                mapFunc: async (res) => await this.prepareTournamentActionData(res, tournament),
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
    public async queryTournaments(publicSubject: boolean, type?: RestType): Promise<Tournament[]> {
        let tournaments: Tournament[] = [];
        const queryParams: IQueryParams = {};
        if (type === 'active' || type === 'history') {
            queryParams.type = type;
        }
        try {
            const res: IData = await this.dataService.request('tournaments/tournaments', queryParams);
            let result = this.modifyTournaments(res.data);
            tournaments = this.checkForbid(result, queryParams);

            switch (type) {
                case 'active':
                    publicSubject ? this.subjects.active$.next(tournaments) : null;
                    break;
                case 'history':
                    publicSubject ? this.subjects.history$.next(tournaments) : null;
                    break;
                default:
                    publicSubject ? this.subjects.tournaments$.next(tournaments) : null;
                    this.tournaments = tournaments;
                    break;
            }
            return tournaments;
        } catch (error) {
            // this.logService.sendLog({code: '10.0.0', data: error});
            this.eventService.emit({
                name: 'TOURNAMENTS_FETCH_FAILED',
                data: error,
            });
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'tournaments',
            system: 'tournaments',
            url: '/tournaments',
            type: 'GET',
        });
    }

    private checkForbid(tournaments: Tournament[], queryParams: IQueryParams): Tournament[] {
        const userCategory: string = _get(this.profile, 'info.category', '').toLowerCase();
        const forbiddenCategories = this.configService.get<IIndexing<IForbidBanned>>('$loyalty.forbidBanned');

        if (
            this.useForbidUserFields &&
            (
                _get(this.profile, 'info.loyalty.ForbidTournaments') === '1' ||
                _get(forbiddenCategories, `${userCategory}.ForbidTournaments`, false)
            ) &&
            queryParams.type !== 'history' &&
            queryParams.type !== 'active'
        ) {
            tournaments = _filter(tournaments, (item: Tournament) => item.isSelected);
        }
        return tournaments;
    }

    private modifyTournaments(data: ITournament[]): Tournament[] {
        const queryTournaments: Tournament[] = [];

        if (data?.length) {
            for (const tournamentData of data) {
                const tournament: Tournament = new Tournament(tournamentData, this.configService, this.cachingService, this);
                queryTournaments.push(tournament);
            }
        }
        return  _filter(queryTournaments, (item: Tournament) => item.status !== -1);;
    }

    private setSubscribers() {
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
            next: (tournaments: Tournament[]) => {
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
                wlcElement: 'notifiсation_tournament-error',
            },
        });
    }

    private showSuccess(title: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'success',
                title,
                wlcElement: 'notifiсation_tournament-success',
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

    private async prepareTournamentActionData(res: unknown, tournament: Tournament): Promise<Tournament> {
        _extend(tournament.data, res);
        return tournament;
    }
}
