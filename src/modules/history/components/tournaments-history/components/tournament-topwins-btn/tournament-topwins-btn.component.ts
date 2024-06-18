import {
    Component,
    OnInit,
    Inject,
    HostBinding,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';

import * as Params from './tournament-topwins-btn.params';
import {
    ITournamentLeaderboardCParams,
    // eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.params';

@Component({
    selector: '[wlc-tournament-topwins-btn]',
    templateUrl: './tournament-topwins-btn.component.html',
    styleUrls: ['./styles/tournament-topwins-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentTopwinsBtnComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    public override $params: Params.ITournamentTopwinsBtnParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentTopwinsBtnParams,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.ITournamentTopwinsBtnParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
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
            componentName: 'tournaments.wlc-tournament-leaderboard',
            componentParams: <ITournamentLeaderboardCParams>{
                themeMod: 'history',
                common: {
                    tournament: this.$params.tournament,
                    limit: this.$params.limit,
                    useListHead: true,
                },
            },
            closeBtnText: gettext('OK'),
            scrollable: false,
            wlcElement: 'tournament_wins_history',
            size: this.$params.tournament.target === 'bonus' ? 'md-extra' : 'md',
        });
    }
}
