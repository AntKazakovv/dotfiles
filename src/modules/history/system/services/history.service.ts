import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {DateTime} from 'luxon';
import {
    BehaviorSubject,
    interval,
    Observable,
    pipe,
} from 'rxjs';
import {
    filter,
    takeUntil,
    tap,
} from 'rxjs/operators';
import _filter from 'lodash-es/filter';
import _isNil from 'lodash-es/isNil';
import _map from 'lodash-es/map';
import _toNumber from 'lodash-es/toNumber';
import _reduce from 'lodash-es/reduce';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    IIndexing,
    InjectionService,
    LogService,
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core';
import {CurrenciesInfo} from 'wlc-engine/modules/core/constants';
import {
    IBonusHistory,
    TBonusesHistory,
} from 'wlc-engine/modules/history/system/interfaces/bonus-history/bonus-history.interface';
import {
    BonusHistoryItemModel,
} from 'wlc-engine/modules/history/system/models/bonus-history/bonus-history-item.model';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';
import {
    ITournamentHistory,
} from 'wlc-engine/modules/history/system/interfaces/tournament-history/tournament-history.interface';
import {
    ITopTournamentUsers,
    ITournamentPrize,
    TCurrency,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {
    Transaction,
    ITransaction,
} from 'wlc-engine/modules/history/system/models/transaction-history/transaction-history.model';
import {rangeExceededMsg} from 'wlc-engine/modules/history/system/constants/history.constants';
import {WalletHelper} from 'wlc-engine/modules/multi-wallet';
import {HistoryHelper} from 'wlc-engine/modules/history/system/helpers';
import {RatesCurrencyService} from 'wlc-engine/modules/rates';

interface IBonusesData extends IData {
    data?: TBonusesHistory;
}

interface ISubjects {
    bonusesHistory$: BehaviorSubject<BonusHistoryItemModel[]>;
    tournamentsHistory$: BehaviorSubject<TournamentHistory[]>;
}

interface IQueryParams {
    type?: string;
    event?: string;
}

interface IGetTransactionsParams {
    startDate: DateTime;
    endDate: DateTime;
}
interface ITransactionRequestParams {
    startDate?: string;
    endDate?: string;
}

type RestType = 'bonusesHistory' | 'tournamentsHistory';

@Injectable({
    providedIn: 'root',
})
export class HistoryService {

    protected historyBonuses: BonusHistoryItemModel[] = [];

    private queryPromises: {
        [Property in RestType]: BehaviorSubject<boolean>;
    } = {
            bonusesHistory: new BehaviorSubject(false),
            tournamentsHistory: new BehaviorSubject(false),
        };

    private subjects: ISubjects = {
        bonusesHistory$: new BehaviorSubject(null),
        tournamentsHistory$: new BehaviorSubject(null),
    };
    private allTransactions: Transaction[] = [];
    private isFirstTransactionsRequest: boolean = true;

    private winnersSubjects: IIndexing<BehaviorSubject<ITopTournamentUsers>> = {};
    private winLimit = this.configService.get<number>('$tournaments.winLimit') || 10;
    private winnersLimit: IIndexing<number> = {};
    private ratesService: RatesCurrencyService;

    constructor(
        private injectionService: InjectionService,
        private configService: ConfigService,
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
        private translateService: TranslateService,
    ) {
        this.registerMethods();
        this.setSubscribers();
    }

    public async queryHistory<T extends BonusHistoryItemModel | TournamentHistory>(
        publicSubject: boolean,
        type: RestType,
    ): Promise<T[]> {

        this.queryPromises[type].next(true);
        const queryParams: IQueryParams = {};
        queryParams.type = 'history';

        if (type === 'bonusesHistory') {

            try {
                const res: IBonusesData = await this.dataService.request('bonuses/bonuses', queryParams);

                this.historyBonuses = _map((res as IData<TBonusesHistory>).data,
                    (bonus: IBonusHistory): BonusHistoryItemModel => {
                        return (
                            new BonusHistoryItemModel({service: 'BonusesService', method: 'queryBonuses'}, bonus)
                        );
                    });

                if (publicSubject) {
                    this.subjects.bonusesHistory$.next(this.historyBonuses);
                }

                return this.historyBonuses as T[];
            } catch (error) {
                this.logService.sendLog({code: '10.0.0', data: error});

                this.eventService.emit({
                    name: 'BONUSES_FETCH_FAILED',
                    data: error,
                });
            } finally {
                this.queryPromises[type].next(false);
            }
        }

        if (type === 'tournamentsHistory') {

            try {
                const res: IData<ITournamentHistory[]> = await this.dataService.request(
                    'tournaments/tournaments', queryParams,
                );
                //TODO нужно удалить при рефакторинге
                if (WalletHelper.conversionCurrency) {

                    this.ratesService ??=
                        await this.injectionService.getService<RatesCurrencyService>('rates.rates-currency-service');

                    WalletHelper.coefficientConversionEUR = await this.ratesService.getRate(
                        {
                            currencyFrom: 'EUR',
                            currencyTo: WalletHelper.conversionCurrency,
                        },
                    );
                }

                let tournaments = this.modifyTournaments(res.data);

                publicSubject ? this.subjects.tournamentsHistory$.next(tournaments) : null;
                return tournaments as T[];
            } catch (error) {
                this.logService.sendLog({code: '13.0.0', data: error});

                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_FAILED',
                    data: error,
                });
            }
        }
    }

    /**
     * @param {IGetTransactionsParams} params optional params for getting transactions.
     * If no params provided, wlc-core sends 100 last transactions
     * @returns {Promise<Transaction[]} list of transactions
     */
    public async getTransactionList(params?: IGetTransactionsParams, isNeedRequest?: boolean): Promise<Transaction[]> {

        if (!params && !isNeedRequest) {
            return await this.requestTransactionsList();
        }

        const startDateUTC: DateTime = params.startDate.startOf('day').toUTC();
        const endDateUTC: DateTime = params.endDate.endOf('day').toUTC();
        if (isNeedRequest || this.isFirstTransactionsRequest) {
            this.allTransactions = await this.requestTransactionsList({
                startDate: startDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
                endDate: endDateUTC.toFormat('y-LL-dd\'\T\'HH:mm:ss'),
            });

            if (this.isFirstTransactionsRequest) {
                this.isFirstTransactionsRequest = false;
            }
        }
        return this.allTransactions;
    }

    public getObserver<T extends BonusHistoryItemModel | TournamentHistory>(
        type?: RestType,
    ): Observable<T[]> {

        let flow$: BehaviorSubject<(BonusHistoryItemModel | TournamentHistory)[]>;

        if (type === 'bonusesHistory') {
            flow$ = this.subjects.bonusesHistory$;
        } else if (type === 'tournamentsHistory') {
            flow$ = this.subjects.tournamentsHistory$;
        }

        return (flow$ as BehaviorSubject<T[]>).asObservable();
    }

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

    public transformWins(rawWinRow: TCurrency, tournamentCurrency: string): ITournamentPrize[] {
        const wins: ITournamentPrize[] = [];

        if (typeof rawWinRow === 'object') {
            const moneyWin: number = _toNumber(rawWinRow[tournamentCurrency]);
            const specialWins: ITournamentPrize[] = _reduce(Array.from(CurrenciesInfo.specialCurrencies),
                (result: ITournamentPrize[], currency: string) => {
                    if (rawWinRow[currency]) {
                        const value: number = currency === 'FB'
                            ? _toNumber(rawWinRow[currency][tournamentCurrency])
                            : _toNumber(rawWinRow[currency]);

                        if (value) {
                            let prize: ITournamentPrize = {currency, value};

                            if (WalletHelper.conversionCurrency) {
                                prize = {
                                    currency: WalletHelper.conversionCurrency,
                                    value: value * WalletHelper.coefficientConversionEUR,
                                };
                            }
                            result.push(prize);
                        }
                    }
                    return result;
                }, []);

            if (moneyWin) {
                let prize: ITournamentPrize = {
                    currency: tournamentCurrency,
                    value: moneyWin,
                };

                if (WalletHelper.conversionCurrency) {
                    prize = {
                        currency: WalletHelper.conversionCurrency,
                        value: moneyWin * WalletHelper.coefficientConversionEUR,
                    };
                }

                wins.push(prize);
            }
            wins.push(...specialWins);
        } else {
            let prize: ITournamentPrize = {
                currency: tournamentCurrency,
                value: Number(rawWinRow),
            };

            if (WalletHelper.conversionCurrency) {
                prize = {
                    currency: WalletHelper.conversionCurrency,
                    value: Number(rawWinRow) * WalletHelper.coefficientConversionEUR,
                };
            }
            wins.push(prize);
        }
        return wins;
    }

    private modifyTournaments(
        data: ITournamentHistory[],
    ): TournamentHistory[] {

        if (data?.length) {

            const queryTournaments = _map<ITournamentHistory, TournamentHistory>(
                data as ITournamentHistory[],
                (item: ITournamentHistory) => {
                    return new TournamentHistory(
                        {service: 'TournamentHistoryService', method: 'modifyTournaments'},
                        item,
                        this.configService,
                        this,
                    );
                });

            return _filter(
                queryTournaments,
                (item: TournamentHistory) => item.status !== -1,
            );
        }
    }

    private async requestTransactionsList(params: ITransactionRequestParams = {}): Promise<Transaction[]> {
        try {
            const response: IData<Transaction[]> = await this.dataService
                .request<IData>('finances/transactions', params);
            const transactions: Transaction[] = await HistoryHelper
                .conversionCurrency<Transaction>(this.injectionService, response.data);
            return transactions;
        } catch (error) {
            //TODO replace compare with error string from backend by handling this in front. Will be in SCR #544298
            if (error.code === 400
                && error.errors.length === 1
                && error.errors[0] === 'Report interval is more than 90 days'
            ) {
                this.eventService.emit({
                    name: NotificationEvents.PushMessage,
                    data: <IPushMessageParams>{
                        type: 'error',
                        title: 'Error',
                        message: rangeExceededMsg,
                        wlcElement: 'notification_transaction-history',
                    },
                });
                return [];
            } else {
                this.logService.sendLog({
                    code: '17.6.0',
                    data: error,
                });
                throw error;
            }
        }
    }

    private registerMethods(): void {

        this.dataService.registerMethod({
            name: 'bonuses',
            system: 'bonuses',
            url: '/bonuses',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'tournaments',
            system: 'tournaments',
            url: '/tournaments',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'transactions',
            system: 'finances',
            url: '/transactions',
            type: 'GET',
            events: {
                success: 'TRANSACTIONS',
                fail: 'TRANSACTIONS_ERROR',
            },
            mapFunc: this.createTransaction.bind(this),
        });
    }

    private setSubscribers(): void {

        this.subjects.bonusesHistory$.subscribe({
            next: (bonuses: BonusHistoryItemModel[]) => {
                this.eventService.emit({
                    name: 'BONUSES_FETCH_HISTORY_SUCCESS',
                    data: bonuses,
                });
            },
        });

        this.translateService.onLangChange.subscribe((): void => {
            this.updateSubscribers();
        });
        this.subjects.tournamentsHistory$.subscribe({
            next: (tournaments: TournamentHistory[]) => {
                this.eventService.emit({
                    name: 'TOURNAMENTS_FETCH_HISTORY_SUCCESS',
                    data: tournaments,
                });
            },
        });
    }

    private updateSubscribers(): void {

        if (this.subjects.bonusesHistory$.observers.length > 1) {
            this.queryHistory(true, 'bonusesHistory');
        }
    }

    private createTransaction(data: ITransaction[]): Transaction[] {
        return data.map((item) => new Transaction(
            {service: 'HistoryService', method: 'createTransaction'},
            item,
        ));
    }
}
