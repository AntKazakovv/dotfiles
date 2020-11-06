import {Component, Inject, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {ILSParams} from 'wlc-engine/modules/base/components/language-selector/language-selector.params';
import * as LSParams from './login-signup.params';
import {ConfigService} from 'wlc-engine/modules/core';

@Component({
    selector: '[wlc-login-signup]',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./styles/login-signup.component.scss'],
})
export class LoginSignupComponent extends AbstractComponent implements OnInit {

    constructor(
        @Inject('injectParams') protected params: ILSParams,
    ) {
        super({injectParams: params, defaultParams: LSParams.defaultParams});
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
