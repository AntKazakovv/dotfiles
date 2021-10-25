import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import {FormControl} from '@angular/forms';
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

import {BonusesService} from 'wlc-engine/modules/bonuses/system/services';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus';
import {IPushMessageParams, NotificationEvents} from 'wlc-engine/modules/core/system/services/notification';

import * as Params from 'wlc-engine/modules/bonuses/components/enter-promocode/enter-promocode.params';

@Component({
    selector: '[wlc-enter-promocode]',
    templateUrl: './enter-promocode.component.html',
    styleUrls: ['./styles/enter-promocode.component.scss'],
})
export class EnterPromocodeComponent
    extends AbstractComponent
    implements OnInit, OnDestroy {

    @Input() public inlineParams: Params.IEnterPromocodeCParams;
    @Input() public title: string;

    public $params: Params.IEnterPromocodeCParams;
    public pending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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
            placeholder: gettext('Enter promo code'),
            useLabel: false,
        },
        control: new FormControl(''),
    };

    public ngOnInit(): void {
        super.ngOnInit(GlobalHelper.prepareParams(this, ['title']));
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();

        this.pendingSubscriber?.unsubscribe();
    }

    public async getBonusByPromocode(): Promise<void> {
        const promocode = this.enterPromocodeInput.control.value;

        if (!promocode) {
            this.showErrorNotification(gettext('Enter promocode'));
            return;
        }

        try {
            this.pending$.next(true);

            const bonuses: Bonus[] = await this.bonusesService.getBonusesByCode(promocode);

            // TODO временно, нужно другое решение
            if (this.$destroy.isStopped) {
                return;
            }

            if (!bonuses.length) {
                this.showErrorNotification(gettext('No voucher found'));
                return;
            }

            this.modalService.showModal('promoSuccess');

            this.eventService.emit({
                name: 'PROMO_SUCCESS',
                data: bonuses[0],
            });

        } catch (error) {
            this.showErrorNotification(error.errors ? error.errors : error);
        } finally {
            this.pending$.next(false);
        }
    }

    protected showErrorNotification(message: string, title: string = gettext('Promocode error')): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'error',
                title,
                message,
                wlcElement: 'notification_promocode-error',
            },
        });
    }
}
