import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';

import {
    BehaviorSubject,
    Subscription,
} from 'rxjs';

import {
    AbstractComponent,
    EventService,
    GlobalHelper,
    IInputCParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {PromoCodeService} from 'wlc-engine/modules/bonuses/system/services/promocode/promocode.service';
import {BonusesService} from 'wlc-engine/modules/bonuses/system/services/bonuses/bonuses.service';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {TPromoSuccessStatus} from 'wlc-engine/modules/bonuses/components/promo-success/promo-success.params';
import {ActionTypeEnum} from 'wlc-engine/modules/bonuses';

import * as Params from 'wlc-engine/modules/bonuses/components/enter-promocode/enter-promocode.params';

@Component({
    selector: '[wlc-enter-promocode]',
    templateUrl: './enter-promocode.component.html',
    styleUrls: ['./styles/enter-promocode.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnterPromocodeComponent extends AbstractComponent implements OnInit, OnDestroy {

    @Input() public inlineParams: Params.IEnterPromocodeCParams;
    @Input() public title: string;

    public override $params: Params.IEnterPromocodeCParams;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public promoCodeService: PromoCodeService = inject(PromoCodeService);

    protected bonus: Bonus[];
    protected pendingSubscriber: Subscription;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEnterPromocodeCParams,
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
        name: 'promoCode',
        theme: 'default',
        customMod: 'promocode',
        common: {
            placeholder: '',
            useLabel: false,
        },
        control: new UntypedFormControl(''),
    };

    public override ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['title']));
        this.enterPromocodeInput.common.placeholder = this.$params.common.placeholder;
    }

    public override ngOnDestroy(): void {
        super.ngOnDestroy();

        this.pendingSubscriber?.unsubscribe();
    }

    public async getBonusByPromocode(): Promise<void> {
        const promocode = this.enterPromocodeInput.control.value;

        if (!promocode) {
            this.promoCodeService.showPromoCodeError(gettext('Enter promo code'));
            return;
        }

        if (!this.configService.get<boolean>('$user.isAuthenticated')) {
            this.nonAuthSubmit(promocode);
            return;
        }

        try {
            this.pending$.next(true);

            const bonus: Bonus = await this.promoCodeService.getBonusByCode(promocode);

            if (!bonus) return;

            let promoSuccessStatus: TPromoSuccessStatus;

            // TODO временно, нужно другое решение
            if (this.$destroy.isStopped) {
                return;
            }

            if (bonus.selected) {
                promoSuccessStatus = bonus.active ? 'active' : 'selected';
            } else {
                promoSuccessStatus = 'notSelected';
            }

            this.enterPromocodeInput.control.setValue('');

            this.modalService.showModal('promoSuccess', {status: promoSuccessStatus});

            this.eventService.emit({
                name: 'PROMO_SUCCESS',
                data: bonus,
            });

            this.bonusesService.bonusActionEvent.next({
                actionType: ActionTypeEnum.PromoCodeSuccess,
                bonusId: bonus.id,
            });

        } catch (error) {
            this.eventService.emit({
                name: 'PROMO_ERROR',
            });
        } finally {
            this.pending$.next(false);
        }
    }

    protected nonAuthSubmit(promocode: string): void {
        this.configService.set({
            name: 'promoCode',
            value: promocode,
        });

        this.modalService.showModal(this.$params.common.signupModalName);
    }
}
