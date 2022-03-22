import {
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    ConfigService,
    GlobalHelper,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TournamentsService,
    TournamentComponent,
} from 'wlc-engine/modules/tournaments';

import * as Params from './tournament-banner.params';

import _set from 'lodash-es/set';

@Component({
    selector: '[wlc-tournament-banner]',
    templateUrl: './tournament-banner.component.html',
    styleUrls: ['./styles/tournament-banner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentBannerComponent
    extends AbstractComponent
    implements OnInit {
    @Input() public inlineParams: Params.ITournamentBannerCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;
    @Input() public parentInstance: TournamentComponent;
    @Input() public actionParams: Params.IActionParams;

    public $params: Params.ITournamentBannerCParams;
    public isTournamentSelected: boolean;
    public isProcessed: boolean = false;
    public pending: boolean = false;
    public isAuth: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentBannerCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected tournamentsService: TournamentsService,
    ) {
        super(
            <IMixedParams<Params.ITournamentBannerCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'parentInstance', 'actionParams']));

        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');
        this.isTournamentSelected = this.tournamentsService.isTournamentSelected;

        this.checkParentInstance();

        this.tournamentsService.isProcessed$.pipe(takeUntil(this.$destroy))
            .subscribe(value => {
                this.isProcessed = value;
                this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
                this.cdr.markForCheck();
            });
    }

    /**
     * Update tournament list
     */
    public updateTournaments(): void {
        this.tournamentsService.updateTournaments();
    }

    protected checkParentInstance(): void {
        if (!this.parentInstance) return;

        this.$params.tournament = this.parentInstance.tournament;
        this.setSubscription();
    }

    protected setSubscription(): void {
        this.parentInstance.pending$.pipe(takeUntil(this.$destroy))
            .subscribe((pending) => {
                this.pending = pending;
                this.isTournamentSelected = this.parentInstance.isTournamentSelected;
                this.cdr.markForCheck();
            });
    }

    public readMore(useSelector: boolean = false): void {
        if (!useSelector) {
            _set(this.$params, 'common.actionParams.selector', '');
        }
        this.parentInstance?.readMore(this.$params.common.actionParams);
    }

    public joinToTournament(): void {
        this.parentInstance?.join();
    }
}
