import {
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {
    AbstractComponent,
    EventService,
    IInputCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import * as Params from 'wlc-engine/modules/bonuses/components/enter-promocode/enter-promocode.params';

import {
    forEach as _forEach,
    get as _get,
    isUndefined as _isUndefined,
    keys as _keys,
} from 'lodash';

@Component({
    selector: '[wlc-enter-promocode]',
    templateUrl: './enter-promocode.component.html',
    styleUrls: ['./styles/enter-promocode.component.scss'],
})
export class EnterPromocodeComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.IEnterPromocodeParams;
    @Input() public titleText: string;

    protected bonus: Bonus[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEnterPromocodeParams,
        protected bonusesService: BonusesService,
        protected eventService: EventService,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public enterPromocodeInput: IInputCParams = {
        name: '',
        theme: 'default',
        common: {
            placeholder: gettext('Enter promo code'),
            useLable: false,
        },
        control: new FormControl(''),
    };


    ngOnInit() {
        super.ngOnInit(this.prepareParams());
    }

    protected prepareParams(): Params.IEnterPromocodeParams {
        const inputProperties: string[] = ['titleText'];
        const inlineParams: Params.IEnterPromocodeParams = {
            common: {},
        };

        _forEach(inputProperties, key => {
            if (!_isUndefined(_get(this, key))) {
                inlineParams.common[key] = _get(this, key);
            }
        });

        return _keys(inlineParams.common).length ? inlineParams : null;
    }

    public async getBonusByPromocode(): Promise<void> {
        const promocode = this.enterPromocodeInput.control.value;

        if (!promocode) {
            this.showPromoModalError('Enter promocode');
            return;
        }

        try {
            const bonuses: Bonus[] = await this.bonusesService.getBonusesByCode(promocode);

            if (!bonuses.length) {
                this.showPromoModalError('No voucher found', 'Info');
                return;
            }

            this.showPromoModalSuccess();

        } catch (error) {
            this.showPromoModalError(error.error);
        }
    }

    protected showPromoModalError(message: string, title: string = 'Error'): void {
        this.modalService.showError({
            modalTitle: gettext(title),
            modalMessage: gettext(message),
        });
    }

    protected showPromoModalSuccess() {
        this.modalService.showModal({
            id: 'promo-bonus',
            modalTitle: gettext('Promo code'),
            modalMessage: gettext(`Congratulations your promo code is activated!
                Bonus added to the Bonuses page and waiting for subscription`),
            closeBtnText: gettext('Got it'),
        });
    }
}
