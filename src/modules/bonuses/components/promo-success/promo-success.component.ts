import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {
    ModalService,
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core';

import * as Params from './promo-success.params';

@Component({
    selector: '[wlc-promo-success]',
    templateUrl: './promo-success.component.html',
    styleUrls: ['./styles/promo-success.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoSuccessComponent
    extends AbstractComponent
    implements OnInit {

    public override $params: Params.IPromoSuccessCParams;

    @Input() public inlineParams: Params.IPromoSuccessCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoSuccessCParams,
        protected modalService: ModalService,
        protected router: UIRouter,
    ) {
        super(
            <IMixedParams<Params.IPromoSuccessCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();
    }

    public btnClickHandler(): void {
        this.modalService.hideModal('promo-success');

        if (this.$params.status === 'notSelected' && this.$params.redirectPath) {

            this.router.stateService.go(this.$params.redirectPath);
        }
    }
}
