import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
} from 'wlc-engine/modules/core';

import {ActionType} from 'wlc-engine/modules/tournaments';

import * as Params from '../tournament-condition/tournament-condition.params';

@Component({
    selector: '[wlc-tournament-condition]',
    templateUrl: './tournament-condition.component.html',
    styleUrls: ['./styles/tournament-condition.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TournamentConditionComponent
    extends AbstractComponent
    implements OnInit {
    @Input() public inlineParams: Params.ITournamentConditionCParams;
    @Input() public userBalance: number;
    @Input() public feeAmount: number;
    @Input() public feeCurrency: string;
    @Input() public text: string;
    @Input() public actionType: ActionType;

    public override $params: Params.ITournamentConditionCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITournamentConditionCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
