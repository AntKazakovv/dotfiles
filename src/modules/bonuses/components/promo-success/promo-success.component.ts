import {
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
    ConfigService,
} from 'wlc-engine/modules/core';

import * as Params from './promo-success.params';

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

    constructor(
        @Inject('injectParams') protected injectParams: Params.IPromoSuccessCParams,
        protected modalService: ModalService,
        protected router: UIRouter,
        protected configService: ConfigService,

    ) {
        super(
            <IMixedParams<Params.IPromoSuccessCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public btnClickHandler(): void {
        this.modalService.hideModal('promo-success');

        if (this.$params.status === 'notSelected') {

            if (this.configService.get<boolean>('$bonuses.unitedPageBonuses')) {
                this.router.stateService.go('app.profile.loyalty-bonuses.all');
            } else {
                if (this.$params.redirectPath) {
                    this.router.stateService.go(this.$params.redirectPath);
                }
            }
        }
    }
}
