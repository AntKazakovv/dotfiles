import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import _slice from 'lodash-es/slice';

import {
    AbstractComponent,
    GlobalHelper,
    ITooltipCParams,
} from 'wlc-engine/modules/core';
import {
    IPrizeRow,
    TPrizePodiumImages,
} from 'wlc-engine/modules/tournaments/system/interfaces/tournaments.interface';
import {Tournament} from 'wlc-engine/modules/tournaments/system/models/tournament.model';

import * as Params from './tournament-prizes.params';

@Component({
    selector: '[wlc-tournament-prizes]',
    templateUrl: './tournament-prizes.component.html',
    styleUrls: ['./styles/tournament-prizes.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentPrizesComponent
    extends AbstractComponent
    implements OnInit {
    @Input() public inlineParams: Params.ITournamentPrizesCParams;
    @Input() public type: Params.ComponentType;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public customMod: Params.CustomMod;
    @Input() public tournament: Tournament;
    @Input() public tournamentType: 'promo' | 'detail';

    public override $params: Params.ITournamentPrizesCParams;
    public podiumImages: TPrizePodiumImages;
    public prizesTable: IPrizeRow[];
    public isExpanded: boolean = false;
    public rowLimit: number;
    public hasInfoColumn: boolean;
    public bonusRewardText: ITooltipCParams;
    public useShowMoreButton: boolean;
    public btnTheme: Params.BtnTheme = 'default';

    private _initialRowLimit: number = 0;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPrizesCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'rowsLimit']));

        this.prepareLimits();
        this.preparePrizesTable();

        this.podiumImages = this.configService.get<TPrizePodiumImages>('$tournaments.prizePodium.images');
        this.bonusRewardText = {
            inlineText: this.configService.get<string>('$tournaments.bonusRewardText'),
            placement: 'top',
        };
        this.hasInfoColumn = this.tournament.target === 'bonus' && this.$params.theme === 'long';
        this.useShowMoreButton =
            this.$params.showMore?.use && this.tournament.prizeTable.length > this._initialRowLimit;
        if (this.$params.theme === 'wolf') {
            this.btnTheme = 'theme-wolf-link';
        };
    }

    public get toggleButtonText(): string {
        return this.isExpanded ? gettext('Show less') : gettext('Show all');
    }

    public toggleRows(): void {
        this.isExpanded = !this.isExpanded;
        this.rowLimit = this.isExpanded ? this.tournament.prizeTable.length : this._initialRowLimit;
    }

    protected prepareLimits(): void {
        this._initialRowLimit = this.$params.showMore?.rowLimit || Params.PRIMARY_ROW_LIMIT;

        if (this.$params.theme === 'long' || this.$params.theme === 'wolf') {
            this.rowLimit = this.$params.showMore.use ? this._initialRowLimit : this.tournament.prizeTable.length;
        } else {
            this.rowLimit = this._initialRowLimit;
        }
    }

    protected preparePrizesTable(): void {
        this.prizesTable = _slice(
            this.tournament.prizeTable,
            0,
            this._initialRowLimit);
    }
}
