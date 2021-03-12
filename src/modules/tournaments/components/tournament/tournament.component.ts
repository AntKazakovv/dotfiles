import {
    ChangeDetectionStrategy,
    Component, Inject,
    Input,
    OnInit,
} from '@angular/core';
import {Tournament} from 'wlc-engine/modules/tournaments';
import {
    AbstractComponent,
    GlobalHelper,
} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/tournaments/components/tournament/tournament.params';

@Component({
    selector: '[wlc-tournament]',
    templateUrl: './tournament.component.html',
    styleUrls: ['./styles/tournament.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.ITournamentCParams;
    @Input() public tournament: Tournament;
    @Input() public thumbType: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['tournament', 'thumbType']));
        this.thumbType = 'sec';
    }
}
