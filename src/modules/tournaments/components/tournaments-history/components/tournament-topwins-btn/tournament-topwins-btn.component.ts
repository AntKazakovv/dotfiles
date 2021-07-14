import {
    Component,
    OnInit,
    Inject,
    HostBinding,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {TournamentLeaderboardComponent} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.component';
import {ITournamentLeaderboardCParams} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.params';

import * as Params from './tournament-topwins-btn.params';

@Component({
    selector: '[wlc-tournament-topwins-btn]',
    templateUrl: './tournament-topwins-btn.component.html',
    styleUrls: ['./styles/tournament-topwins-btn.component.scss'],
})
export class TournamentTopwinsBtnComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    public $params: Params.ITournamentTopwinsBtnParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentTopwinsBtnParams,
        protected modalService: ModalService,
        protected configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITournamentTopwinsBtnParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.profileFirst = this.configService.get('$base.profile.type') === 'first';
    }

    /**
     * Show top wins in modal
     */
    public showTopWins(): void {
        this.modalService.showModal({
            id: 'tournament-history-wins',
            modifier: 'info',
            modalTitle: this.$params.tournament.name,
            component: TournamentLeaderboardComponent,
            componentParams: <ITournamentLeaderboardCParams>{
                themeMod: 'history',
                common: {
                    tournament: this.$params.tournament,
                    limit: this.$params.limit,
                    useListHead: true,
                },
            },
            closeBtnText: gettext('Ok'),
            scrollable: false,
            wlcElement: 'tournament_wins_history',
        });
    }
}
