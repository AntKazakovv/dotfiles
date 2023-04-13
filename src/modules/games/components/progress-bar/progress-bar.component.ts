import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './progress-bar.params';

@Component({
    selector: '[wlc-progress-bar]',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./styles/progress-bar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProgressBarComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IProgressBarCParams;
    @Input() public minValue: number = 0;
    @Input() public maxValue: number = 0;
    @Input() public currentValue: number = 0;

    public override $params: Params.IProgressBarCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProgressBarCParams,
        configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public get progressPercent(): string {
        return (this.currentValue / this.maxValue * 100) + '%';
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

}
