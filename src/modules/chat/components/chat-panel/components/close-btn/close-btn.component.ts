import {
    ChangeDetectionStrategy,
    Component,
} from '@angular/core';

import {AbstractChatComponent} from 'wlc-engine/modules/chat/system/classes/component.abstract.class';

@Component({
    selector: 'button[wlc-close-btn]',
    templateUrl: './close-btn.component.html',
    styleUrls: ['./close-btn.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseBtnComponent extends AbstractChatComponent {

    constructor() {
        super('wlc-close-btn');
    }
}
