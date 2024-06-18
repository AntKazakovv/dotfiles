import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';
import _set from 'lodash-es/set';
import _cloneDeep from 'lodash-es/cloneDeep';

import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TournamentsService,
    PRIMARY_ROW_LIMIT,
    TournamentComponent,
    ITournamentTags,
} from 'wlc-engine/modules/tournaments';
import {
    ITagCParams,
    ITagCommon,
} from 'wlc-engine/modules/core/components/tag/tag.params';

import * as Params from './tournament-promo.params';
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
    @Input() public parentInstance: TournamentComponent;
    @Input() public actionParams: Params.IActionParams;

    public override $params: Params.ITournamentPromoCParams;
    public tournament: Tournament;
    public rowLimit: number = PRIMARY_ROW_LIMIT;
    public pending: boolean = false;
    public isAuth: boolean = false;
    public showJoin: boolean = false;
    public tagClass: string;
    public tagConfig: ITagCParams;
    public lockBtnText: string;

    private isProcessed: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPromoCParams,
        protected tournamentsService: TournamentsService,
    ) {
        super(
            <IMixedParams<Params.ITournamentPromoCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'actionParams']));

        this.isAuth = this.configService.get<boolean>('$user.isAuthenticated');
        this.checkParentInstance();

        this.tournamentsService.isProcessed$.pipe(takeUntil(this.$destroy))
            .subscribe(value => {
                this.isProcessed = value;
                this.cdr.markForCheck();
            });
        this.showJoin = !this.isProcessed && this.tournament.canJoin;

        if (this.tournament.onlyForLevels) {
            this.lockBtnText = this.configService.get('$tournaments.lockBtnText');
        }
        this.tagClass = this.tournament.tag.toLowerCase();

        if (this.$params.theme === 'wolf' && this.tournament.tag) {
            const moduleTagsConfig = this.configService.get<ITournamentTags>('$tournaments.tagsConfig');
            const tagCommon: ITagCommon = moduleTagsConfig.tagList[this.tournament.tag];

            if (tagCommon) {

                if (!moduleTagsConfig.useIcons) {
                    tagCommon.iconUrl = null;
                }

                this.tagConfig = {
                    common: tagCommon,
                };
            };
        }
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

    protected checkParentInstance(): void {
        if (!this.parentInstance) return;

        this.tournament = this.parentInstance.tournament;
        this.setSubscription();
    }

    protected setSubscription(): void {
        this.parentInstance.pending$.pipe(takeUntil(this.$destroy))
            .subscribe((pending) => {
                this.pending = pending;
                this.cdr.markForCheck();
            });
    }
}
