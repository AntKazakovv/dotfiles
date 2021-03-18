import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams, ModalService,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TournamentsService,
} from 'wlc-engine/modules/tournaments';

import {TournamentPrizesComponent} from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes/tournament-prizes.component';
import {
    ITournamentPrizesCParams,
    PRIMARY_ROW_LIMIT,
} from '../tournament-prizes/tournament-prizes.params';


import * as Params
    from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-promo/tournament-promo.params';

@Component({
    selector: '[wlc-tournament-promo]',
    templateUrl: './tournament-promo.component.html',
    styleUrls: ['./styles/tournament-promo.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentPromoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ITournamentPromoCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;

    public $params: Params.ITournamentPromoCParams;
    public isTournamentSelected: boolean;
    public rowLimit: number = PRIMARY_ROW_LIMIT;
    public pending: boolean = false;
    protected isAuth: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPromoCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected modalService: ModalService,
        protected tournamentsService: TournamentsService,
    ) {
        super(
            <IMixedParams<Params.ITournamentPromoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod']));

        this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
    }

    public setTag(): string {
        return this.tournament.selected ? 'Active' : this.tournament.isTournamentStarts ? 'Available' : 'Coming soon';
    }

    public setDecorImage(): string {
        return this.$params.common.tournament?.imagePromo || '/gstatic/wlc/tournaments/tournament-decor.png';
    }

    public showAllPrizes(tournament: Tournament): void {
        this.modalService.showModal({
            id: 'prizes-board',
            modifier: 'prizes-board',
            modalTitle: tournament.name,
            size: 'md',
            backdrop: 'static',
            showFooter: false,
            dismissAll: true,
            component: TournamentPrizesComponent,
            componentParams: <ITournamentPrizesCParams>{
                common: {
                    tournament,
                    rowLimit: tournament.winningSpreadByPercent.length,
                },
            },
        });
    }

    public async joinToTournament(tournament: Tournament): Promise<void> {
        if (!this.isAuth) {
            this.modalService.showModal('login');

            return;
        }

        try {
            this.pending = true;

            await this.tournamentsService.joinTournament(tournament);
            this.cdr.markForCheck();
        } catch (error) {
            console.error(error);
        } finally {
            this.pending = false;
            this.isTournamentSelected = true;
        }
    }

    public async leaveFromTournament(tournament: Tournament): Promise<void> {
        try {
            this.pending = true;

            await this.tournamentsService.leaveTournament(tournament);
            this.cdr.markForCheck();
        } catch (error) {
            console.error(error);
        } finally {
            this.pending = false;
        }
    }
}
