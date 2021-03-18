import {
    ChangeDetectionStrategy,
    Component, Inject,
    Input,
    OnInit,
    ChangeDetectorRef,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    ITournamentPlace,
    ITopTournamentUsers,
} from 'wlc-engine/modules/tournaments';
import {ITournamentLeaderboardCParams} from './tournament-leaderboard.params';
import * as Params from './tournament-leaderboard.params';

import {
    findIndex as _findIndex,
    isNumber as _isNumber,
    union as _union,
} from 'lodash-es';

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
    @Input() public tournament: Tournament;
    @Input() public limit: number;
    @Input() public showAllBtn: boolean;

    public $params: Params.ITournamentLeaderboardCParams;
    public isAuth: boolean;
    public wins: ITournamentPlace[];
    public winsTop: ITournamentPlace[];
    public winsRest: ITournamentPlace[];
    public userId: string;
    public isReady: boolean;

    protected restLimit: number;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentLeaderboardCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.ITournamentLeaderboardCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'limit', 'showAllBtn']));
        this.prepareModifiers();
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.restLimit = this.limit - 3 || 0;

        if (this.$params?.common?.tournament && !this.tournament) {
            this.tournament = this.$params?.common?.tournament;
        }
        this.isReady = false;
        this.tournament?.getWinnersSubscribe({
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
        });
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

    protected prepareModifiers(): void {
        let modifiers: Params.Modifiers[] = [];
        if (this.$params.common?.customMod) {
            modifiers = _union(modifiers, this.$params.common.customMod.split(' '));
        }
        this.addModifiers(modifiers);
    }

    protected getRestLimit(userIndex?: number) {
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
