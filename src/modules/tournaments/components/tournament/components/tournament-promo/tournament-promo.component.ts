import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
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
    PRIMARY_ROW_LIMIT,
    TournamentComponent,
} from 'wlc-engine/modules/tournaments';

import * as Params from './tournament-promo.params';

import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';

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
    @Input() public parentInstance: TournamentComponent;
    @Input() public actionParams: Params.IActionParams;

    public $params: Params.ITournamentPromoCParams;
    public isTournamentSelected: boolean;
    public rowLimit: number = PRIMARY_ROW_LIMIT;
    public pending: boolean = false;
    public isProcessed: boolean = false;
    public isAuth: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPromoCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
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
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'actionParams']));

        this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
        this.isAuth = this.ConfigService.get<boolean>('$user.isAuthenticated');

        this.checkParentInstance();

        this.tournamentsService.isProcessed$.pipe(takeUntil(this.$destroy))
            .subscribe(value => {
                this.isProcessed = value;
                this.isTournamentSelected = this.tournamentsService.isTournamentSelected;
                this.cdr.markForCheck();
            });
    }

    public joinToTournament(): void {
        this.parentInstance?.join();
    }

    /**
     * Update tournament list
     */
    public updateTournaments(): void {
        this.tournamentsService.updateTournaments();
    }

    public readMore(useSelector: boolean = false): void {
        const params = _cloneDeep(this.$params.common.actionParams);

        if (!useSelector) {
            _set(params, 'selector', '');
        }
        this.parentInstance?.readMore(params);
    }

    /**
     * get timer text from its state
     */
    public getTimerText(): string {
        return this.$params.common.tournament?.isTournamentStarts
            ? this.$params.common?.timerTextAfterStart
            : this.$params.common?.timerTextBeforeStart;
    }

    protected checkParentInstance(): void {
        if (!this.parentInstance) return;

        this.$params.common.tournament = this.parentInstance.tournament;
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
}
