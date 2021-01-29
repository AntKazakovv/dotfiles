import {
    Component,
    OnInit,
    Input,
    Inject,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';

import * as Params from './link-block.params';

import {
    forEach as _forEach,
    get as _get,
    keys as _keys,
    isUndefined as _isUndefined,
} from 'lodash-es';

@Component({
    selector: '[wlc-link-block]',
    templateUrl: './link-block.component.html',
    styleUrls: ['./styles/link-block.component.scss'],
})
export class LinkBlockComponent extends AbstractComponent
    implements OnInit {

    @Input() public actionParams: Params.IActionParams;
    @Input() public inlineParams: Params.ILinkBlockCParams;
    @Input() public linkText: string;
    @Input() public subtitleText: string;
    @Input() public titleText: string;

    public $params: Params.ILinkBlockCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILinkBlockCParams,
        protected modalService: ModalService,
        protected router: UIRouter,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
    }

    public goTo(data: Params.IActionParams): void {
        if (data.modal) {
            this.modalService.showModal(data.modal.name);
            return;
        } else if (data.url) {
            this.router.stateService.go(data.url.path);
            return;
        } else if (data.event) {
            // sent data.event.name
        }
    }

    protected prepareParams(): Params.ILinkBlockCParams {
        const inputProperties: string[] = ['titleText', 'subtitleText', 'linkText', 'actionParams'];
        const inlineParams: Params.ILinkBlockCParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }
}
