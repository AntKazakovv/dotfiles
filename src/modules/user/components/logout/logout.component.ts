import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
    ChangeDetectionStrategy,
} from '@angular/core';

import {
    AbstractComponent,
    ModalService,
    ConfigService,
    EventService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import * as Params from './logout.params';

@Component({
    selector: '[wlc-logout]',
    templateUrl: './logout.component.html',
    styleUrls: ['./styles/logout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILogoutCParams;
    @Input() public useText: boolean;
    public override $params: Params.ILogoutCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILogoutCParams,
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected userService: UserService,
        protected eventService: EventService,
        configService: ConfigService,
    ) {
        super({
            injectParams: params,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.$params.useText = this.$params.useText || this.useText;
    }

    public logout(): void {
        this.eventService.emit({
            name: 'LOGOUT_CONFIRM',
            data: {
                modalMessage: this.$params.textMessage,
            },
        });
    }
}
