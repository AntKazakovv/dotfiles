import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';

import _findIndex from 'lodash-es/findIndex';
import _forEach from 'lodash-es/forEach';
import _isEmpty from 'lodash-es/isEmpty';
import _isNumber from 'lodash-es/isNumber';
import _toNumber from 'lodash-es/toNumber';
import _union from 'lodash-es/union';

import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
    ConfigService,
    ModalService,
    InjectionService,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TCurrency,
    ITournamentPlace,
    ITopTournamentUsers,
    ITournamentLeaderboardCParams,
    ITournamentPrize,
} from 'wlc-engine/modules/tournaments';
import {HistoryService} from 'wlc-engine/modules/history/system/services/history.service';
import {TournamentHistory} from 'wlc-engine/modules/history/system/models/tournament-history/tournament-history.model';

import * as Params from './tournament-leaderboard.params';

@Component({
    selector: '[wlc-tournament-leaderboard]',
    templateUrl: './tournament-leaderboard.component.html',
    styleUrls: ['./styles/tournament-leaderboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentLeaderboardComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ITournamentLeaderboardCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament | TournamentHistory;
    @Input() public limit: number;
    @Input() public showAllBtn: boolean;
    @Input() public useUserLogin: boolean;
    @Input() public useListHead: boolean;

    public override $params: Params.ITournamentLeaderboardCParams;
    public isAuth: boolean;
    public wins: ITournamentPlace[];
    public winsTop: ITournamentPlace[];
    public winsRest: ITournamentPlace[];
    public userId: string;
    public isReady: boolean;
    public currency: string = 'EUR';
    public pointsTitle: string = gettext('Points');
    public isMaxWinBetRatio: boolean = false;
    public isHistory: boolean = false;
    public isTargetBonus: boolean = false;

    protected restLimit: number;
    protected historyService: HistoryService;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentLeaderboardCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected modalService: ModalService,
        protected injectionService: InjectionService,
    ) {
        super(
            <IMixedParams<Params.ITournamentLeaderboardCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'limit', 'showAllBtn', 'useListHead']));
        this.prepareModifiers();
        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        if (this.$params.common?.limit) {
            this.limit = this.$params.common.limit;
        }
        this.restLimit = this.limit - 3 || 0;

        if (this.$params.common?.tournament && !this.tournament) {
            this.tournament = this.$params.common.tournament;
        }

        if (this.tournament.target === 'loyalty') {
            this.currency = 'LP';
        } else if (!this.$params.common.useMainCurrency) {
            this.currency = this.tournament.targetDefaultCurrency;
        }

        if (this.tournament.winnerBy === 'max_app_winbet_ratio') {
            this.isMaxWinBetRatio = true;
            this.pointsTitle = gettext('Coefficient');
        }

        if (this.paramInclude('themeMod', 'history')) {
            this.isHistory = true;
        }

        if (this.$params.common?.tournament.target === 'bonus') {
            this.isTargetBonus = true;
        }

        this.historyService ??= await this.injectionService.getService('history.history-service');

        this.isReady = false;
        this.tournament?.getWinnersSubscribe(
            {
                next: (result) => {
                    if (result) {
                        this.getWins(result);
                        this.isReady = true;
                        this.cdr.markForCheck();
                    }
                },
            },
            {
                until: this.$destroy,
                limit: 0,
            },
        );
    }

    public get needShowBtn(): boolean {
        return this.$params.common?.showAllBtn && this.wins.length > this.$params.common?.limit;
    }

    public showAllWins(): void {
        this.modalService.showModal({
            id: 'tournament-wins-all',
            modifier: 'info',
            modalTitle: this.tournament.name,
            component: TournamentLeaderboardComponent,
            componentParams: <ITournamentLeaderboardCParams>{
                common: {
                    tournament: this.tournament,
                },
            },
            scrollable: this.wins.length > 14,
            wlcElement: 'tournament_wins_all_modal',
        });
    }

    /**
     * return user login or id by displayPlayerName option
     * @param {ITournamentPlace} winner
     * @returns string
     */
    public getPlayerName(winner: ITournamentPlace): string {
        return this.$params.displayPlayerName === 'id' ? winner.IDUser : winner.UserLogin;
    }

    public getWinPoints(win: ITournamentPlace): number {
        return this.isMaxWinBetRatio
            ? Number(win.BestWinToBetRatio)
            : win.points;
    }

    public getCurrencyValue(win: ITournamentPlace): ITournamentPrize[] {
        const wins: TCurrency = (win.Target === 'bonus' && !_isEmpty(win.TotalWins.Currency))
            ? win.TotalWins.Currency
            : this.totalWins(win);
        return this.historyService.transformWins(wins, this.currency);
    }

    protected totalWins(win: ITournamentPlace): number | string {
        return _toNumber(this.currency === 'EUR' ? win.WinEUR : win.Win);
    }

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customMod) {
            modifiers = _union(modifiers, this.$params.common.customMod.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected getRestLimit(userIndex?: number): void {
        if (this.winsRest.length > this.restLimit) {
            const dIndex = this.winsRest.length - this.restLimit;
            if (userIndex === -1 || (userIndex + 3) <= this.restLimit || !_isNumber(userIndex)) {
                this.winsRest = this.winsRest.slice(0, this.restLimit);
            } else {
                if (userIndex === this.winsRest.length - 1 || userIndex === this.winsRest.length - 2) {
                    this.winsRest = this.winsRest.slice(dIndex, this.winsRest.length);
                }
                else {
                    this.winsRest = this.winsRest.slice(userIndex + 3 - this.restLimit, userIndex + 3);
                }
            }
        }
    }

    protected getWins(result: ITopTournamentUsers): void {
        this.wins = this.tournament.getTopArray(result);

        if (this.isHistory) {
            _forEach(this.wins, (win, i) => {
                let winLB = this.getCurrencyValue(win);
                this.wins[i].TotalWinsLB = winLB;
            });
        }

        if (this.wins?.length) {
            this.winsTop = this.wins.slice(0, 3);
            this.winsRest = this.wins.slice(3) || [];
            if (this.isAuth && result?.user) {
                this.userId = result.user.IDUser;
                if (this.restLimit) {
                    this.getRestLimit(_findIndex(this.winsRest, ['IDUser', this.userId]));
                }
            }
            if (!result?.user && this.restLimit) {
                this.getRestLimit();
            }
        }
    }
}
