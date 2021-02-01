import {
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';
import {
    AbstractComponent,
    GlobalHelper, ModalService,
} from 'wlc-engine/modules/core';

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
        this.modalService.closeModal('promo-success');
        this.router.stateService.go(path);
    }

}
