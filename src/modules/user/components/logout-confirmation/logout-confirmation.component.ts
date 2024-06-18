import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {WlcModalComponent} from 'wlc-engine/standalone/core/components/modal/modal.component';

import * as Params from './logout-confirmation.params';

@Component({
    selector: '[wlc-logout-confirmation]',
    templateUrl: './logout-confirmation.component.html',
    styleUrls: ['./styles/logout-confirmation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LogoutConfirmationComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IConfirmationCParams;

    public override $params: Params.IConfirmationCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IConfirmationCParams,
        @Inject(WlcModalComponent) protected modal: WlcModalComponent,
        protected userService: UserService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    protected confirm(): void {
        this.userService.logout();
        this.closeModal();
    }

    protected closeModal(): void {
        this.modal.closeModalByReason('closeIcon');
    }
}
