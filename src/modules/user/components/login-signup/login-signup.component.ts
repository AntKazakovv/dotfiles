import {Component, Inject, OnInit} from '@angular/core';

import {
    get as _get,
} from 'lodash';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';

import * as Params from './login-signup.params';

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
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public get loginText(): string {
        return _get(this.$params, 'login.title');
    }

    public get signupText(): string {
        return _get(this.$params, 'login.signup');
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

    public action(actionButton: Params.IActionNameType): void {
        if (this.$params.login?.action === 'url') {
            const url = _get(this.$params, `${actionButton}.url`);
            if (!url) return;
            if (_get(this.$params, `${actionButton}.target`) === 'blank') {
                window.open(url);
            } else {
                location.href = url;
            }
        }
    }
}
