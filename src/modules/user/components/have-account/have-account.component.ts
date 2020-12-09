import {
    Component,
    OnInit,
    Input,
    Inject,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import * as Params from 'wlc-engine/modules/user/components/have-account/have-account.params';

import {
    forEach as _forEach,
    get as _get,
    keys as _keys,
    isUndefined as _isUndefined,
} from 'lodash';

@Component({
    selector: '[wlc-have-account]',
    templateUrl: './have-account.component.html',
    styleUrls: ['./styles/have-account.component.scss'],
})
export class HaveAccountComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IHaveAccountCParams;
    @Input() public linkText: string;
    @Input() public titleText: string;
    public $params: Params.IHaveAccountCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IHaveAccountCParams,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.prepareParams());
    }

    public showModal(modalName): void {
        this.modalService.closeAllModals();
        this.modalService.showModal(modalName);
    }

    protected prepareParams(): Params.IHaveAccountCParams {
        const inputProperties: string[] = ['linkText', 'titleText'];
        const inlineParams: Params.IHaveAccountCParams = {
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
