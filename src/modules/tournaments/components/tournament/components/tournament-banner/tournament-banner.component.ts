import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {takeUntil} from 'rxjs/operators';
import _set from 'lodash-es/set';

import {
    AbstractComponent,
    GlobalHelper,
    IMixedParams,
} from 'wlc-engine/modules/core';
import {
    Tournament,
    TournamentsService,
    TournamentComponent,
    ITournamentTags,
} from 'wlc-engine/modules/tournaments';
import {
    ITagCParams,
    ITagCommon,
} from 'wlc-engine/modules/core/components/tag/tag.params';

import * as Params from './tournament-banner.params';

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
    @Input() public parentInstance: TournamentComponent;
    @Input() public actionParams: Params.IActionParams;
    @Input() public isAlternative: boolean;

    public override $params: Params.ITournamentBannerCParams;
    public tournament: Tournament;
    public pending: boolean = false;
    public isAuth: boolean = false;
    public showJoin: boolean = false;
    public backgroundImgUrl: string = '';
    public lockBtnText: string;
    public tagClass: string;
    public tagConfig: ITagCParams;

    private isProcessed: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentBannerCParams,
        protected tournamentsService: TournamentsService,
    ) {
        super(
            <IMixedParams<Params.ITournamentBannerCParams>>{
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
        this.tagClass = this.tournament.tag.toLowerCase();
        if (this.tournament.onlyForLevels) {
            this.lockBtnText = this.configService.get('$tournaments.lockBtnText');
        }
        this.backgroundImgUrl = this.isAlternative ? this.tournament.imageOther : this.tournament.image;

        if (this.$params.theme === 'wolf' && this.tournament.tag) {

            const moduleTagsConfig = this.configService.get<ITournamentTags>('$tournaments.tagsConfig');
            // @ts-ignore no-implicit-any #672571
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

    /**
     * Update tournament list
     */
    public updateTournaments(): void {
        this.tournamentsService.updateTournaments();
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
