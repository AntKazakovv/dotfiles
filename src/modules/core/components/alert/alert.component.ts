import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    SimpleChanges,
    OnChanges,
} from '@angular/core';

import _get from 'lodash-es/get';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './alert.params';

@Component({
    selector: '[wlc-alert]',
    templateUrl: './alert.component.html',
    styleUrls: ['./styles/alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AlertComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input('title') public title: string;
    @Input('text') public text: string;
    @Input('level') protected level: Params.TLevel;

    @Input() protected inlineParams: Params.IAlertCParams;

    public override $params: Params.IAlertCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAlertCParams,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.title ??= this.$params.title;
        this.text ??= this.$params.text;
        this.level ??= this.$params.level;

        this.addModifiers(String(this.level));
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        const level = _get(changes, 'level');

        if (level?.previousValue && level.currentValue !== level.previousValue) {
            this.removeModifiers(level.previousValue);
            this.addModifiers(level.currentValue);
        }
    }

    public get levelIcon(): string {
        return Params.alertIcons[this.level];
    }
}
