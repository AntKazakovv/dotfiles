import {
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './promo-success.params';
import {UIRouter} from '@uirouter/core';

@Component({
    selector: '[wlc-promo-success]',
    templateUrl: './promo-success.component.html',
    styleUrls: ['./styles/promo-success.component.scss'],
})
export class PromoSuccessComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.IPromoSuccessCParams;

    @Input() public inlineParams: Params.IPromoSuccessCParams;
    @Input() public actionParams: Params.IActionParams;
    @Input() public btnText: string;
    @Input() public iconName: string;
    @Input() public subtitle: string;
    @Input() public text: string;
    @Input() public title: string;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoSuccessCParams,
        protected modalService: ModalService,
        protected router: UIRouter,

    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        const inputProperties: string[] = ['actionParams', 'btnText', 'iconName', 'subtitle', 'text', 'title'];
        super.ngOnInit(GlobalHelper.prepareParams(this, inputProperties));
    }

    public goTo(path: string): void {
        this.modalService.hideModal('promo-success');
        this.router.stateService.go(path);
    }

}
