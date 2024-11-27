import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
    inject,
} from '@angular/core';
import {
    AbstractComponent,
    IModalConfig,
    ITooltipCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {League} from 'wlc-engine/modules/tournaments/system/models/league.model';
import {
    ITournamentLeaderboardCParams,
// eslint-disable-next-line max-len
} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-leaderboard/tournament-leaderboard.params';

import * as Params from './league-info.params';

@Component({
    selector: '[wlc-league-info]',
    templateUrl: './league-info.component.html',
    styleUrls: ['./styles/league-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeagueInfoComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ILeagueInfoCParams;

    public override $params: Params.ILeagueInfoCParams;
    public headerImage!: string;

    protected modalService: ModalService = inject(ModalService);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILeagueInfoCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.headerImage = this.league.imageDescription || this.$params.defaultImagePath;
    }

    public openInfoModal(): void {
        const isShowJoinBtn: boolean = this.league.canJoin;

        const modalParams: IModalConfig = {
            ...this.$params.modalParams,
            rejectBtnVisibility: !isShowJoinBtn,
            showConfirmBtn: isShowJoinBtn,
            onConfirm: this.$params.joinCallback,
        };

        const modalComponentParams: Params.ILeagueInfoCParams = {
            ...this.$params,
            isModal: true,
        };

        this.modalService.showModal<Params.ILeagueInfoCParams>(modalParams, modalComponentParams);
    }

    public get league(): League {
        return this.$params.league;
    }

    public get leagueName(): string {
        return this.league.name;
    }

    public get leagueDescription(): string {
        return this.league.description;
    }

    public get isModal(): boolean {
        return this.$params.isModal;
    }

    public get fallbackImagePath(): string {
        return this.$params.fallbackImagePath;
    }

    public get leaderboardTitle(): string {
        return this.$params.leaderboardTitle;
    }

    public get leaderboardParams(): ITournamentLeaderboardCParams {
        return this.$params.leaderboardParams;
    }

    public get tooltipParams(): ITooltipCParams {
        return this.$params.tooltipParams;
    }
}
