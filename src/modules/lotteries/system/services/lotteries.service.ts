import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    map,
    distinctUntilChanged,
} from 'rxjs/operators';
import _find from 'lodash-es/find';
import _set from 'lodash-es/set';
import _map from 'lodash-es/map';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    InjectionService,
    LogService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {RequestParamsType} from 'wlc-engine/modules/core/system/services/data/data.service';
import {
    ILottery,
    ILotteryFetchParams,
    ILotteriesResponse,
    ILotteriesHistoryResponse,
    ILotteryBase,
} from 'wlc-engine/modules/lotteries/system/interfaces/lotteries.interface';
import {Lottery} from 'wlc-engine/modules/lotteries/system/models/lottery.model';
import {BaseLottery} from 'wlc-engine/modules/lotteries/system/models/base-lottery.model';

@Injectable({
    providedIn: 'root',
})
export class LotteriesService {
    public ready: Promise<void> = new Promise((resolve: () => void): void => {
        this.$resolve = resolve;
    });
    /** Active lottery */
    public lottery$: BehaviorSubject<Lottery> = new BehaviorSubject(null);
    public userCurrency: string;

    private $resolve: () => void;
    private lottery: Lottery;
    private isAuth: boolean;
    private isFetching$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        protected dataService: DataService,
        protected logService: LogService,
        protected injectionService: InjectionService,
        protected configService: ConfigService,
        protected eventService: EventService,
    ) {
        this.init();
    }

    public async fetchLottery(params: ILotteryFetchParams = {}): Promise<Lottery> {
        await this.ready;

        try {
            this.isFetching$.next(true);
            const response: IData<ILotteriesResponse> =
                await this.dataService.request('lotteries/lotteries', params);

            const result: Lottery[] = this.processResponse(response.data.lotteries, params);

            if (params?.alias) {
                return result[0];
            } else {
                this.lottery = result[0];
                this.lottery$.next(this.lottery);
                return this.lottery;
            }
        } catch (error) {
            this.logService.sendLog({
                code: '28.0.0',
                data: error,
            });
        }
    }

    public async fetchLotteriesHistory(params?: RequestParamsType): Promise<BaseLottery[]> {
        const queryParams: RequestParamsType = this.updateQueryParams(params);
        try {
            const response: IData<ILotteriesHistoryResponse> =
                await this.dataService.request('lotteries/history', queryParams);

            const results: BaseLottery[] = _map(response.data.lotteries, (lottery: ILotteryBase) => {
                return new BaseLottery(lottery);
            });

            return results;
        } catch (error) {
            this.logService.sendLog({
                code: '28.1.0',
                data: error,
            });
        }
    }

    protected updateQueryParams(params?: RequestParamsType): RequestParamsType {
        const queryParams: RequestParamsType = params || {};
        const usersPerPlace: number = this.configService.get<number>('$lotteries.results.usersPerPlace');

        _set(queryParams, 'usersPerPlace', usersPerPlace);

        if (this.userCurrency) {
            _set(queryParams, 'wallet', this.userCurrency);
        }

        return queryParams;
    }

    private processResponse(data: ILottery[], params?: ILotteryFetchParams): Lottery[] {
        const lotteries: Lottery[] = [];

        if (params?.alias) {
            const lottery: ILottery = _find(data, ({Alias}) => Alias === params.alias);
            if (lottery) {
                lotteries.push(new Lottery(lottery));
            }
        } else {
            lotteries.push(new Lottery(data[0]));
        }

        return lotteries;
    }

    private async init(): Promise<void> {
        await this.configService.ready;

        this.registerMethods();

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');

        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                filter((profile: UserProfile): boolean => !!profile),
                map((profile: UserProfile): string => profile.selectedCurrency),
                distinctUntilChanged(),
            )
            .subscribe((currency: string) => {
                this.userCurrency = currency.toLowerCase();
                this.$resolve();
            });

        if (!this.isAuth) {
            this.$resolve();
        }
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'lotteries',
            system: 'lotteries',
            url: '/lotteries',
            type: 'GET',
        });

        this.dataService.registerMethod({
            name: 'history',
            system: 'lotteries',
            url: '/lotteries/history',
            type: 'GET',
        });
    }
};
