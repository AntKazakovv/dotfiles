import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';
import {UserService} from 'wlc-engine/modules/user/system/services';
import * as Params from './logout.params';

@Component({
    selector: '[wlc-logout]',
    templateUrl: './logout.component.html',
    styleUrls: ['./styles/logout.component.scss'],
})
export class LogoutComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILogoutCParams;
    public $params: Params.ILogoutCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILogoutCParams,
        protected userService: UserService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
