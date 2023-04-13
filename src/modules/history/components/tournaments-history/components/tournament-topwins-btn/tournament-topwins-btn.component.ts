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

import * as Params from './tournament-topwins-btn.params';
import {
    ITournamentLeaderboardCParams,
    // eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-tournament-topwins-btn]',
    templateUrl: './tournament-topwins-btn.component.html',
    styleUrls: ['./styles/tournament-topwins-btn.component.scss'],
})
export class TournamentTopwinsBtnComponent extends AbstractComponent implements OnInit {
    @HostBinding('class.profile-first') protected profileFirst: boolean;
    public override $params: Params.ITournamentTopwinsBtnParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITournamentTopwinsBtnParams,
        protected modalService: ModalService,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ITournamentTopwinsBtnParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
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
                    useMainCurrency: true,
                },
            },
            closeBtnText: gettext('Ok'),
            scrollable: false,
            wlcElement: 'tournament_wins_history',
        });
    }
}
