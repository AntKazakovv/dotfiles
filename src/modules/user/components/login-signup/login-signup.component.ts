import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';

import * as Params from './login-signup.params';

import _get from 'lodash-es/get';
import {DOCUMENT} from '@angular/common';


@Component({
    selector: '[wlc-login-signup]',
    templateUrl: './login-signup.component.html',
    styleUrls: ['./styles/login-signup.component.scss'],
})
export class LoginSignupComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILoginSignupCParams;
    protected isAffiliate: boolean = false;
    protected affiliateUrl: string = '';

    constructor(
        @Inject('injectParams') protected injectParams: Params.ILoginSignupCParams,
        @Inject(DOCUMENT) protected document: Document,
        protected ModalService: ModalService,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.isAffiliate = this.configService.get('$base.app.type') === 'aff';
        if (this.isAffiliate) {
            this.affiliateUrl = this.configService.get<string>('$base.affiliate.affiliateUrl');
        }
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
                    this.document.defaultView.open(url);
                } else {
                    location.href = url;
                }
                break;
            }
            case 'login':
            case 'signup': {
                this.setAction((actionButton as Params.IActionNameType));
                break;
            }
        }
    }

    protected setAction(action: Params.IActionNameType): void {
        if (this.isAffiliate) {
            const lang = this.configService.get<string>('currentLanguage');
            const url = this.affiliateUrl + lang + (action === 'signup' ? '/Register' : '');
            this.document.defaultView.open(url, '_self');
        } else {
            this.ModalService.showModal(action);
        }
    }
}


