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
    ConfigService,
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

    public $params: Params.ITournamentPrizesCParams;
    public podiumImages: TPrizePodiumImages;
    public prizesTable: IPrizeRow[];
    public isExpanded: boolean = false;
    public rowLimit: number;
    public hasInfoColumn: boolean;
    public bonusRewardText: ITooltipCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPrizesCParams,
        protected configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this,
            ['tournament', 'type', 'theme', 'themeMod', 'customMod', 'rowsLimit']));

        this.preparePrizesTable();
        this.podiumImages = this.configService.get<TPrizePodiumImages>('$tournaments.prizePodium.images');
        this.bonusRewardText = {
            inlineText: this.configService.get<string>('$tournaments.bonusRewardText'),
            placement: 'top',
        };
        this.hasInfoColumn = this.tournament.target === 'bonus' && this.$params.theme === 'long';

        if (this.$params.theme === 'long') {
            this.rowLimit = this.$params.common?.rowLimit || Params.PRIMARY_ROW_LIMIT;
        }
    }

    public get toggleButtonText(): string {
        return this.isExpanded ? gettext('Show less') : gettext('Show more');
    }

    public toggleRows(): void {
        this.isExpanded = !this.isExpanded;

        if (this.isExpanded) {
            this.rowLimit = this.tournament.prizeTable.length;
        } else {
            this.rowLimit = this.$params.common?.rowLimit || Params.PRIMARY_ROW_LIMIT;
        }
    }

    protected preparePrizesTable(): void {
        this.prizesTable = _slice(
            this.tournament.prizeTable,
            0,
            this.$params.common.rowLimit || Params.PRIMARY_ROW_LIMIT);
    }
}
