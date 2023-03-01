import {
    Component,
    ChangeDetectionStrategy,
    Input,
    SimpleChanges,
    OnChanges,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

export type TButtonTheme = 'default' | 'icon';
export type TButtonMod = 'default' | 'primary';
export type TButtonSize = 'default' | 'sm';

@Component({
    selector: '[wlc-btn]',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ButtonComponent extends AbstractChatComponent implements OnChanges {
    @Input() protected theme: TButtonTheme = 'default';
    @Input() protected mod: TButtonMod = 'default';
    @Input() protected size: TButtonSize = 'default';
    protected changeable: string[] = ['theme', 'mod', 'size']; //TODO: fix decorator

    constructor() {
        super('wlc-btn');
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
