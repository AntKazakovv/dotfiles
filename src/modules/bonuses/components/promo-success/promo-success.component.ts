import {
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';
import {UIRouter} from '@uirouter/core';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

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
    @Input() public actionParams: Params.IActionParams;
    @Input() public btnText: string;
    @Input() public iconPath: string;
    @Input() public subtitle: string;
    @Input() public text: string;
    @Input() public title: string;

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
        const inputProperties: string[] = ['actionParams', 'btnText', 'iconName', 'subtitle', 'text', 'title'];
        super.ngOnInit(GlobalHelper.prepareParams(this, inputProperties));
    }

    public goTo(): void {
        this.modalService.hideModal('promo-success');
        if (this.$params.common.redirectPath) {
            this.router.stateService.go(this.$params.common.redirectPath);
        }
    }

}
