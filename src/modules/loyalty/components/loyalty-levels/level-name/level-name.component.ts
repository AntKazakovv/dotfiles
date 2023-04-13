import {
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {
    AbstractComponent,
    ITooltipCParams,
} from 'wlc-engine/modules/core';

import * as Params from './level-name.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-level-name]',
    templateUrl: './level-name.component.html',
    styleUrls: ['./styles/level-name.component.scss'],
})
export class LevelNameComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILevelNameParams;
    public tooltipSettings: ITooltipCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILevelNameParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.tooltipSettings = {
            iconName: 'info',
            inlineText: this.$params.level.description,
        };
    }
}
