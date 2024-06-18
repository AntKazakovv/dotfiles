import {
    Component,
    Input,
    Inject,
    OnInit,
    ChangeDetectionStrategy,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './bet-info.params';

/**
 * bet-info component. Use for header of component.
 *
 * @example
 *
 * {
 *     name: 'core.wlc-bet-info',
 * }
 *
 */

@Component({
    selector: '[wlc-bet-info]',
    templateUrl: './bet-info.component.html',
    styleUrls: ['./styles/bet-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetInfoComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IBetInfoCParams;
    @Input() public BlockInfo: string;

    public override $params: Params.IBetInfoCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IBetInfoCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }
}
