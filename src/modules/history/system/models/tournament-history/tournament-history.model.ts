import {
    Observable,
    PartialObserver,
    pipe,
    Subscription,
} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import _assign from 'lodash-es/assign';
import _each from 'lodash-es/each';
import _toNumber from 'lodash-es/toNumber';
import _toString from 'lodash-es/toString';
import _uniqBy from 'lodash-es/uniqBy';

import {
    AbstractModel,
    ConfigService,
    GlobalHelper,
    IFromLog,
} from 'wlc-engine/modules/core';
import {
    ITournamentHistory,
} from 'wlc-engine/modules/history/system/interfaces/tournament-history/tournament-history.interface';
import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {ITopTournamentUsers} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {ITournamentPlace} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';

export class TournamentHistory extends AbstractModel<ITournamentHistory> {
    protected userCurrency: string;
    protected useUsersCurrency: boolean = false;

    constructor(
        from: IFromLog,
        data: ITournamentHistory,
        protected configService: ConfigService,
        protected historyService: HistoryService,
    ) {
        super({from: _assign({model: 'TournamentHistory'}, from)});
        this.data = data;
    }

    public get place(): string | number {
        const {Place} = this.data;
        return _toNumber(Place) || (Place ?? '#');
    }

    public get start(): string {
        return GlobalHelper.toLocalTime(this.data.Start, 'SQL', 'yyyy-MM-dd HH:mm:ss');
    }

    public get end(): string {
        return GlobalHelper.toLocalTime(this.data.End, 'SQL', 'yyyy-MM-dd HH:mm:ss');
    }

    public get win(): string {
        return this.data.Win || '-';
    }

    public get betsAmount(): string {
        return this.data.BetsAmount;
    }

    public get betsCount(): string {
        return this.data.BetsCount;
    }

    public get winningSpreadCount(): number {
        return this.data.WinningSpreadCount;
    }

    public get winsAmount(): string {
        return this.data.WinsAmount;
    }

    public get winsCount(): string {
        return this.data.WinsCount;
    }

    public get winToBetRatio(): number {
        return _toNumber(this.data.WinToBetRatio);
    }

    public get statusName(): string {
        return this.data.StatusText;
    }

    public get status(): number {
        return _toNumber(this.data.Status);
    }

    public get target(): string {
        return this.data.Target;
    }

    public get name(): string {
        return this.data.Name;
    }

    public get id(): number {
        return +this.data.ID;
    }

    public get targetCurrency(): string {
        return this.checkTargetCurrency(false);
    }

    public get targetDefaultCurrency(): string {
        return this.checkTargetCurrency(!this.useUsersCurrency);
    }

    public get points(): number {
        return _toNumber(this.data.Points);
    }

    public get winnerBy(): string {
        return this.data.WinnerBy;
    }

    public getWinnersSubscribe(
        observer: PartialObserver<ITopTournamentUsers>,
        params?: {
            until?: Observable<unknown>,
            limit?: number,
            start?: number
        }): Subscription {
        const winnersSubject = this.historyService.getWinnersSubjects(this.id, params?.until, params?.limit);

        if (winnersSubject.observers.length === 0) {
            this.historyService.getTournamentTop(this.id, params?.limit, params?.start);
        }

        return winnersSubject.pipe(
            (params?.until) ? takeUntil(params?.until) : pipe(),
        ).subscribe(observer);
    }

    public getTopArray(result: ITopTournamentUsers): ITournamentPlace[] {
        const topWin = result?.results || [];
        const isBestWinToBetRatio: boolean = this.winnerBy === 'max_app_winbet_ratio';

        if (result?.user && (_toNumber(result.user.Place) > topWin.length || !result.user.Place)) {
            topWin.push({
                Email: this.configService.get<string>('appConfig.user.Email')?.substring(0, 6) + '***',
                FirstName: this.configService.get<string>('appConfig.user.first_name'),
                IDUser: result.user.IDUser,
                IDUserPlace: result.user.Place || '-',
                LastName: this.configService.get<string>('appConfig.user.last_name'),
                Login: this.configService.get<string>('appConfig.user.user_id'),
                Points: _toString(result.user.Points),
                UserLogin: this.configService.get<string>('appConfig.user.login'),
                Win: result.user.Win,
                BestWinToBetRatio: result.user.BestWinToBetRatio,
            });
        }

        _each(topWin, (item: ITournamentPlace) => {
            item.points = _toNumber(item.Points);

            if (isBestWinToBetRatio) {
                item.delta = Math.abs(this.winToBetRatio - _toNumber(item.BestWinToBetRatio));
            }

            if (!item.UserLogin?.length) {
                item.UserLogin = this.getUserLogin(item);
            }
        });

        return _uniqBy(topWin, 'IDUser');
    }

    protected checkTargetCurrency(useDefaultCurrency?: boolean): string {

        if (this.target === 'loyalty') {
            return 'LP';
        }

        return useDefaultCurrency ? 'EUR' : this.userCurrency;
    }

    protected getUserLogin(item: ITournamentPlace): string {
        if (item.FirstName?.length && item.LastName?.length) {
            return item.FirstName + ' ' + item.LastName.substring(0, 1);
        } else {
            return item.Email.substring(0, 6) + '***';
        }
    }
}
