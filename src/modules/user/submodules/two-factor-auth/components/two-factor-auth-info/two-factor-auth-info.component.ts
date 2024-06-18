import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {
    AbstractComponent,
    EventService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    TwoFactorAuthService,
} from 'wlc-engine/modules/user/submodules/two-factor-auth/system/services/two-factor-auth/two-factor-auth.service';

import * as Params from './two-factor-auth-info.params';

@Component({
    selector: '[wlc-two-factor-auth-info]',
    templateUrl: './two-factor-auth-info.component.html',
    styleUrls: ['./styles/two-factor-auth-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthInfoComponent extends AbstractComponent implements OnInit {

    @Input() public inlineParams: Params.ITwoFactorAuthInfoCParams;
    public override $params: Params.ITwoFactorAuthInfoCParams;
    protected notify2FAGoogle: boolean = false;
    protected hrefGooglePlay = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
    protected hrefAppStore = 'https://apps.apple.com/app/google-authenticator/id388497605';

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITwoFactorAuthInfoCParams,
        protected modalService: ModalService,
        protected eventService: EventService,
        protected twoFactorAuthService: TwoFactorAuthService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        this.getNotify2FAGoogle();
        this.onTurnOff();
    }

    protected onTurnOff(): void {
        this.eventService.subscribe({name: 'TURN_OFF_NOTIFICATION'}, async() => {
            await this.twoFactorAuthService.disableNotification();
            this.modalService.hideModal('two-factor-auth-info');
        }, this.$destroy);
    }

    protected async getNotify2FAGoogle(): Promise<void> {
        const {notify2FAGoogle} = await this.twoFactorAuthService.getUserInfo();
        this.notify2FAGoogle = notify2FAGoogle;
        this.cdr.markForCheck();
    }
}
