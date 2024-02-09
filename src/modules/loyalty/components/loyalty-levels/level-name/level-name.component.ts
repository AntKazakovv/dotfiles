import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
} from '@angular/core';
import {
    AbstractComponent,
    ITooltipCParams,
} from 'wlc-engine/modules/core';

import * as Params from './level-name.params';

@Component({
    selector: '[wlc-level-name]',
    templateUrl: './level-name.component.html',
    styleUrls: ['./styles/level-name.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelNameComponent extends AbstractComponent implements OnInit {
    public override $params: Params.ILevelNameParams;
    public tooltipSettings: ITooltipCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILevelNameParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.tooltipSettings = {
            iconName: 'info',
            inlineText: this.$params.level.description,
        };
    }
}
