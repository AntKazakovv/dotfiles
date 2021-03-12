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
import * as Params from 'wlc-engine/modules/tournaments/components/tournament-thumb/tournament-thumb.params';

@Component({
    selector: '[wlc-tournament-thumb]',
    templateUrl: './tournament-thumb.component.html',
    styleUrls: ['./styles/tournament-thumb.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentThumbComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.ITournamentThumbCParams;
    @Input() public tournament: Tournament;
    @Input() public thumbType: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentThumbCParams,
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
