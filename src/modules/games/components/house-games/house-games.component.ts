import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectionStrategy,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './house-games.params';

/**
 * Component displaying the house games
 *
 * @example
 *
 * {
 *     name: 'games.wlc-house-games',
 * }
 *
 */
@Component({
    selector: '[wlc-house-games]',
    templateUrl: './house-games.component.html',
    styleUrls: ['./styles/house-games.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HouseGamesComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IHouseGamesCParams;

    public override $params: Params.IHouseGamesCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IHouseGamesCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
