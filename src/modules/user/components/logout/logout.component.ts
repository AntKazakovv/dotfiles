import {
    Component,
    Inject,
    OnInit,
    Input,
    ChangeDetectorRef,
} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import * as Params from './logout.params';

@Component({
    selector: '[wlc-logout]',
    templateUrl: './logout.component.html',
    styleUrls: ['./styles/logout.component.scss'],
})
export class LogoutComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.ILogoutCParams;
    @Input() public useText: boolean;
    public $params: Params.ILogoutCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ILogoutCParams,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected userService: UserService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.$params.useText = this.$params.useText || this.useText;
    }

    public logout(): void {
        this.modalService.showModal({
            id: 'logout-confirm',
            modalTitle: gettext('Confirmation'),
            modifier: 'confirmation',
            wlcElement: 'modal_logout',
            modalMessage: gettext('Are you sure?'),
            showConfirmBtn: true,
            closeBtnParams: {
                themeMod: 'secondary',
                wlcElement: 'button_no',
                common: {
                    text: gettext('No'),
                },
            },
            confirmBtnParams: {
                wlcElement: 'button_yes',
                common: {
                    text: gettext('Yes'),
                },
            },
            textAlign: 'center',
            onConfirm: () => {
                this.userService.logout();
            },
            dismissAll: true,
        });
    }
}
