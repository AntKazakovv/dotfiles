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

import * as Params from './alert.params';

@Component({
    selector: '[wlc-alert]',
    templateUrl: './alert.component.html',
    styleUrls: ['./styles/alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AlertComponent extends AbstractComponent implements OnInit {
    @Input('title') public title: string;
    @Input('text') public text: string;
    @Input('level') protected level: Params.TLevel;

    @Input() protected inlineParams: Params.IAlertCParams;

    public $params: Params.IAlertCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAlertCParams,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.title ??= this.$params.title;
        this.text ??= this.$params.text;
        this.level ??= this.$params.level;

        this.addModifiers(String(this.level));
    }

    public get levelIcon(): string {
        return Params.alertIcons[this.level];
    }

}
