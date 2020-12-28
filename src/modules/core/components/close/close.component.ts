import {
    Component,
    EventEmitter,
    Input,
    Inject,
    Output,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';

import * as Params from './close.params';

@Component({
    selector: '[wlc-close]',
    templateUrl: './close.component.html',
    styleUrls: ['./styles/close.component.scss'],
})
export class CloseComponent extends AbstractComponent {

    @Output() closeUp: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        @Inject('injectParams') protected injectParams: Params.ICloseCParams,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public onClick(): void {
        this.closeUp.emit();
    }
}
