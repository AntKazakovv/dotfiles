import {
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    ModalService,
    LogService,
} from 'wlc-engine/modules/core/system/services';
import {WINDOW} from 'wlc-engine/modules/app/system';

import * as Params from './login-signup.params';

import _get from 'lodash-es/get';


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
        @Inject(WINDOW) protected window: Window,
        protected modalService: ModalService,
        protected configService: ConfigService,
        protected logService: LogService,
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
                    this.window.open(url);
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
            this.window.open(url, '_self');
        } else {
            const logWaiter = this.logService.waitForElement({
                selector: (action === 'login') ? '.wlc-modal--login' : '.wlc-modal--signup',
                logObj: {
                    code: (action === 'login') ? '1.2.1' : '1.1.1',
                    data: {
                        target: 'wlc-login-signup',
                    },
                },
            });
            this.modalService.showModal(action).then((comp) => {
                comp.closed.then(logWaiter);
            });
        }
    }
}
