import {
    Component,
    ChangeDetectionStrategy,
    Input,
    OnChanges,
    SimpleChanges,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

export type TAlertTheme = 'default' | 'panel';
export type TAlertMod = 'default' | 'warning' | 'error' | 'success';

@Component({
    selector: '[wlc-alert]',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AlertComponent extends AbstractChatComponent implements OnChanges {
    @Input() public theme: TAlertTheme = 'default';
    @Input() public mod: TAlertMod = 'default';
    protected changeable: string[] = ['theme', 'mod']; //TODO: fix decorator

    constructor() {
        super('wlc-alert');
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.changeable.forEach((prop: string): void => {
            if (changes[prop] && changes[prop].previousValue !== this[prop]) {
                this.replaceMod(
                    `${prop}-${changes[prop].previousValue}`,
                    `${prop}-${this[prop]}`,
                );
            }
        });
    }
}
