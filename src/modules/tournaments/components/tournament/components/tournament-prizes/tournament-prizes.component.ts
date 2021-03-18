import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import {Tournament} from 'wlc-engine/modules/tournaments';

import * as Params
    from 'wlc-engine/modules/tournaments/components/tournament/components/tournament-prizes/tournament-prizes.params';

import {
    slice as _slice,
} from 'lodash-es';

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
    public prizesTable: any;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentPrizesCParams,
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
    }

    protected preparePrizesTable(): void {
        this.prizesTable = _slice(
            this.$params.common.tournament?.winningSpreadByPercent,
            0,
            this.$params.common.rowLimit || Params.PRIMARY_ROW_LIMIT);
    }
}
