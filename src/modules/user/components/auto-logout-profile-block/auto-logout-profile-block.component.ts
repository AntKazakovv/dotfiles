import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserHelper} from 'wlc-engine/modules/user/system/helpers/user.helper';

import * as Params from './auto-logout-profile-block.params';

@Component({
    selector: '[wlc-auto-logout-profile-block]',
    templateUrl: './auto-logout-profile-block.component.html',
    styleUrls: ['./styles/auto-logout-profile-block.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoLogoutProfileBlockComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IAutoLogoutProfileBlockCParams;

    public override $params: Params.IAutoLogoutProfileBlockCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IAutoLogoutProfileBlockCParams,
        configService: ConfigService,
        protected userService: UserService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public openModal(): void {
        UserHelper.showAutoLogoutFormModal(this.modalService, this.userService);
    }

}
