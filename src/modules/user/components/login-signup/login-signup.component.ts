import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ModalService} from 'wlc-engine/modules/core/system/services';

import * as Params from './login-signup.params';

import {
    get as _get,
} from 'lodash-es';


export {ILoginSignupCParams} from './login-signup.params';

@Component({
    selector: '[wlc-login-signup]',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./styles/login-signup.component.scss'],
})
export class LoginSignupComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoginSignupCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoginSignupCParams,
        protected ModalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public get loginText(): string {
        return _get(this.$params, 'login.title');
    }

    public get signupText(): string {
        return _get(this.$params, 'signup.title');
    }

    public get changePasswordText(): string {
        return _get(this.$params, 'changePassword.title');
    }

    public action(actionButton: Params.IActionNameType): void {
        switch (this.$params?.[actionButton]?.action) {
            case 'url': {
                const url = _get(this.$params, `${actionButton}.url`);
                if (!url) return;
                if (_get(this.$params, `${actionButton}.target`) === 'blank') {
                    window.open(url);
                } else {
                    location.href = url;
                }
                break;
            }
            case 'login': {
                this.ModalService.showModal('login');
                break;
            }
            case 'signup': {
                this.ModalService.showModal('signup');
                break;
            }
        }
    }
}
