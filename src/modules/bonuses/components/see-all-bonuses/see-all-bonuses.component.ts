import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core';
import * as Params from 'wlc-engine/modules/bonuses/components/see-all-bonuses/see-all-bonuses.params';

@Component({
    selector: '[wlc-see-all-bonuses]',
    templateUrl: './see-all-bonuses.component.html',
    styleUrls: ['./styles/see-all-bonuses.component.scss'],
})
export class SeeAllBonusesComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public titleText: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISeeAllBonusesParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }
}
