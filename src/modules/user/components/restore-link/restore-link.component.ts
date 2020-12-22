import {
    Component,
    Input,
    OnInit,
    Inject,
} from '@angular/core';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import * as Params from './restore-link.params';

@Component({
    selector: '[wlc-restore-link]',
    templateUrl: './restore-link.component.html',
    styleUrls: ['./styles/restore-link.component.scss'],
})
export class RestoreLinkComponent extends AbstractComponent implements OnInit {
    public $params: Params.IRestoreLinkComponent;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IRestoreLinkComponent,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public showModal(): void {
        this.modalService.showModal('restorePassword');
    }
}
