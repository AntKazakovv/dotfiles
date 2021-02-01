import {
    Component,
    OnInit,
    Input,
    Inject,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {GlobalHelper} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    EventService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';

import * as Params from './link-block.params';

@Component({
    selector: '[wlc-link-block]',
    templateUrl: './link-block.component.html',
    styleUrls: ['./styles/link-block.component.scss'],
})
export class LinkBlockComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ILinkBlockCParams;
    @Input() public actionParams: Params.IActionParams;
    @Input() public link: string;
    @Input() public subtitle: string;
    @Input() public themeMod: Params.ThemeMod;
    @Input() public title: string;

    public $params: Params.ILinkBlockCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILinkBlockCParams,
        protected eventService: EventService,
        protected modalService: ModalService,
        protected router: UIRouter,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        const inputProperties: string[] = ['title', 'subtitle', 'link', 'actionParams'];
        super.ngOnInit(GlobalHelper.prepareParams(this, inputProperties));
    }

    public goTo(data: Params.IActionParams): void {
        if (data.modal) {
            this.modalService.showModal(data.modal.name);
            return;
        } else if (data.url) {
            this.router.stateService.go(data.url.path);
            return;
        } else if (data.event) {
            this.eventService.emit({
                name: data.event.name,
            });
        }
    }
}
