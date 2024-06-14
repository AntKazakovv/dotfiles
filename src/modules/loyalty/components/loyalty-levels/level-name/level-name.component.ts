import {
    Component,
    Inject,
    Input,
    OnInit,
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
    @Input() protected inlineParams: Params.ILevelNameCParams;

    public override $params: Params.ILevelNameCParams;
    public tooltipSettings: ITooltipCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILevelNameCParams,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (this.$params.level?.description) {
            this.tooltipSettings = {
                iconName: 'info',
                inlineText: this.$params.level.description,
            };
        }
    }
}
