import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    Inject,
    Input,
    OnInit,
    inject,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {
    Subject,
    filter,
} from 'rxjs';

import {
    AbstractComponent,
    ICheckboxCParams,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services';
import {UserProfile} from 'wlc-engine/modules/user/system/models';

import * as Params from './subscriptions-modal.params';

@Component({
    selector: '[wlc-subscriptions-modal]',
    templateUrl: './subscriptions-modal.component.html',
    styleUrls: ['./styles/subscriptions-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SubscriptionsModalComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ISubscriptionsModalParams;

    public override $params: Params.ISubscriptionsModalParams;
    public toggleEmailBtn: ICheckboxCParams = Params.buttonsConfig.email;
    public toggleSmsBtn: ICheckboxCParams = Params.buttonsConfig.sms;

    protected readonly modalService = inject(ModalService);
    protected readonly userService = inject(UserService);
    protected readonly destroy = inject(DestroyRef);

    constructor(
        @Inject('injectParams') protected injectParams: Params.ISubscriptionsModalParams,
        @Inject('agreeSubscriptions') protected agreeSubscriptions$: Subject<Params.SubscriptionsType>,
    ) {
        super(
            <IMixedParams<Params.ISubscriptionsModalParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit();

        this.userService.userProfile$.pipe(
            filter((profile: UserProfile): boolean => !!profile),
            takeUntilDestroyed(this.destroy),
        ).subscribe((profile: UserProfile): void => {
            const {emailAgree, smsAgree}: Params.SubscriptionsType = profile;
            this.toggleEmailBtn.control.setValue(emailAgree);
            this.toggleSmsBtn.control.setValue(smsAgree);
        });
    }

    public onConfirm(): void {
        this.agreeSubscriptions$.next({
            emailAgree: this.toggleEmailBtn.control.value,
            smsAgree: this.toggleSmsBtn.control.value,
        });
        this.modalService.hideModal('subscriptions-modal');
    }
}
