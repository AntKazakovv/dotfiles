// TODO: remove this component. Temp component for demo.
import {
    Component,
    HostBinding,
} from '@angular/core';
import {ModalService} from 'wlc-engine/modules/core/system/services';

@Component({
    selector: '[wlc-pseudo-link]',
    templateUrl: './pseudo-link.component.html',
    styleUrls: ['./pseudo-link.component.scss'],
})
export class PseudoLinkComponent {
    @HostBinding('class') protected class = 'wlc-pseudo-link'

    constructor(
        protected modalService: ModalService,
    ) {
    }

    public showModal(): void {
        this.modalService.showModal('restorePassword');
    }
}
